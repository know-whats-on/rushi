do $$
declare
  constraint_name text;
begin
  select con.conname
  into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'RUSHI_PERSONAL_DOCUMENTS'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%kind in (%brochure%quote%';

  if constraint_name is not null then
    execute format(
      'alter table public."RUSHI_PERSONAL_DOCUMENTS" drop constraint %I',
      constraint_name
    );
  end if;
end
$$;

alter table public."RUSHI_PERSONAL_DOCUMENTS"
  drop constraint if exists "RUSHI_PERSONAL_DOCUMENTS_KIND_CHECK";

alter table public."RUSHI_PERSONAL_DOCUMENTS"
  add constraint "RUSHI_PERSONAL_DOCUMENTS_KIND_CHECK"
  check (kind in ('brochure', 'quote', 'project'));

with normalized as (
  select
    doc.id,
    doc.kind,
    doc.status,
    doc.title,
    doc.client_name,
    doc.client_company,
    doc.client_email,
    doc.content,
    coalesce(
      nullif(trim(doc.content ->> 'introText'), ''),
      nullif(trim(doc.title), ''),
      'Shared through the public studio.'
    ) as intro_text,
    coalesce(nullif(trim(doc.content ->> 'logoUrl'), ''), '') as logo_url
  from public."RUSHI_PERSONAL_DOCUMENTS" doc
)
update public."RUSHI_PERSONAL_DOCUMENTS" as doc
set
  kind = 'project',
  content =
    case
      when normalized.content ->> 'mode' = 'project' then
        jsonb_set(
          normalized.content,
          '{libraryMeta}',
          jsonb_build_object(
            'isListed', doc.status = 'published',
            'cardCompany',
              coalesce(
                nullif(trim(doc.client_company), ''),
                nullif(trim(doc.client_name), ''),
                'Studio Project'
              ),
            'cardTitle', coalesce(nullif(trim(doc.title), ''), 'Untitled project'),
            'cardCategory', 'Project',
            'cardStatusLabel',
              case
                when doc.status = 'published' then 'Code required'
                when doc.status = 'archived' then 'Archived'
                else 'Draft'
              end,
            'cardSummary',
              coalesce(
                nullif(trim(normalized.content ->> 'introText'), ''),
                nullif(trim(doc.title), ''),
                'Shared through the public studio.'
              ),
            'cardLogoUrl', coalesce(nullif(trim(normalized.content ->> 'logoUrl'), ''), '')
          )::jsonb,
          true
        )
      when normalized.kind = 'quote' then
        jsonb_build_object(
          'mode', 'project',
          'quoteId', coalesce(normalized.content ->> 'quoteId', ''),
          'logoUrl', '',
          'issuedOn', coalesce(normalized.content ->> 'issuedOn', ''),
          'validUntil', coalesce(normalized.content ->> 'validUntil', ''),
          'introText',
            coalesce(
              nullif(trim(normalized.content ->> 'introText'), ''),
              nullif(trim(doc.title), ''),
              'Review the scope, totals, and PDF on one page.'
            ),
          'notes', coalesce(normalized.content ->> 'notes', ''),
          'terms', coalesce(normalized.content ->> 'terms', ''),
          'acceptanceLine',
            coalesce(nullif(trim(normalized.content ->> 'acceptanceLine'), ''), 'Accepted by:'),
          'currency', coalesce(nullif(trim(normalized.content ->> 'currency'), ''), 'AUD'),
          'gstMode', coalesce(nullif(trim(normalized.content ->> 'gstMode'), ''), 'exclusive'),
          'defaultSelectedBaseIds', jsonb_build_array('legacy-base-' || replace(doc.id::text, '-', '')),
          'defaultSelectedAddOnIds', '[]'::jsonb,
          'baseOptions', jsonb_build_array(
            jsonb_build_object(
              'id', 'legacy-base-' || replace(doc.id::text, '-', ''),
              'title', coalesce(nullif(trim(doc.title), ''), 'Base option'),
              'subtitle',
                coalesce(
                  nullif(trim(doc.client_company), ''),
                  nullif(trim(doc.client_name), ''),
                  ''
                ),
              'description',
                coalesce(
                  nullif(trim(normalized.content ->> 'introText'), ''),
                  'Prepared from the existing quote.'
                ),
              'price',
                greatest(
                  0,
                  coalesce((normalized.content ->> 'subtotal')::numeric, 0),
                  coalesce((normalized.content ->> 'total')::numeric, 0)
                ),
              'facts', jsonb_build_array(
                jsonb_build_object('label', 'Issued', 'value', coalesce(normalized.content ->> 'issuedOn', '')),
                jsonb_build_object('label', 'Valid until', 'value', coalesce(normalized.content ->> 'validUntil', '')),
                jsonb_build_object('label', 'Currency', 'value', coalesce(normalized.content ->> 'currency', 'AUD'))
              ),
              'highlights',
                coalesce(
                  (
                    select jsonb_agg(item.value ->> 'description')
                    from jsonb_array_elements(coalesce(normalized.content -> 'items', '[]'::jsonb)) as item(value)
                    where nullif(trim(item.value ->> 'description'), '') is not null
                  ),
                  '[]'::jsonb
                ),
              'brochureSections', jsonb_build_array(
                jsonb_build_object(
                  'id', 'legacy-overview-' || replace(doc.id::text, '-', ''),
                  'title', 'Overview',
                  'column', 'left',
                  'paragraphs',
                    jsonb_build_array(
                      coalesce(
                        nullif(trim(normalized.content ->> 'introText'), ''),
                        'Prepared from the existing quote.'
                      )
                    ),
                  'bullets', '[]'::jsonb
                ),
                jsonb_build_object(
                  'id', 'legacy-scope-' || replace(doc.id::text, '-', ''),
                  'title', 'Scope',
                  'column', 'right',
                  'paragraphs', '[]'::jsonb,
                  'bullets',
                    coalesce(
                      (
                        select jsonb_agg(item.value ->> 'description')
                        from jsonb_array_elements(coalesce(normalized.content -> 'items', '[]'::jsonb)) as item(value)
                        where nullif(trim(item.value ->> 'description'), '') is not null
                      ),
                      '[]'::jsonb
                    )
                )
              )
            )
          ),
          'addOnOptions', '[]'::jsonb,
          'bundleRule', null,
          'libraryMeta', jsonb_build_object(
            'isListed', doc.status = 'published',
            'cardCompany',
              coalesce(
                nullif(trim(doc.client_company), ''),
                nullif(trim(doc.client_name), ''),
                'Studio Project'
              ),
            'cardTitle', coalesce(nullif(trim(doc.title), ''), 'Untitled project'),
            'cardCategory', 'Project',
            'cardStatusLabel',
              case
                when doc.status = 'published' then 'Code required'
                when doc.status = 'archived' then 'Archived'
                else 'Draft'
              end,
            'cardSummary',
              coalesce(
                nullif(trim(normalized.content ->> 'introText'), ''),
                nullif(trim(doc.title), ''),
                'Shared through the public studio.'
              ),
            'cardLogoUrl', ''
          )
        )
      else
        jsonb_build_object(
          'mode', 'project',
          'quoteId', '',
          'logoUrl', normalized.logo_url,
          'issuedOn', '',
          'validUntil', '',
          'introText', normalized.intro_text,
          'notes', 'Prepared from the existing brochure.',
          'terms', 'Scope, timing, and delivery details can be adjusted before approval.',
          'acceptanceLine', 'Accepted by:',
          'currency', 'AUD',
          'gstMode', 'exclusive',
          'defaultSelectedBaseIds', jsonb_build_array('legacy-base-' || replace(doc.id::text, '-', '')),
          'defaultSelectedAddOnIds', '[]'::jsonb,
          'baseOptions', jsonb_build_array(
            jsonb_build_object(
              'id', 'legacy-base-' || replace(doc.id::text, '-', ''),
              'title', coalesce(nullif(trim(doc.title), ''), 'Base option'),
              'subtitle', coalesce(nullif(trim(normalized.content ->> 'subtitle'), ''), ''),
              'description', normalized.intro_text,
              'price',
                coalesce(
                  nullif(
                    regexp_replace(
                      coalesce(normalized.content ->> 'priceLabel', ''),
                      '[^0-9.]',
                      '',
                      'g'
                    ),
                    ''
                  )::numeric,
                  0
                ),
              'facts', jsonb_build_array(
                jsonb_build_object('label', 'Duration', 'value', coalesce(normalized.content ->> 'duration', '')),
                jsonb_build_object('label', 'Delivery', 'value', coalesce(normalized.content ->> 'deliveryMode', '')),
                jsonb_build_object('label', 'Format', 'value', coalesce(normalized.content ->> 'studyLoad', ''))
              ),
              'highlights',
                coalesce(
                  (
                    select jsonb_agg(section.value ->> 'title')
                    from jsonb_array_elements(coalesce(normalized.content -> 'sections', '[]'::jsonb)) as section(value)
                    where nullif(trim(section.value ->> 'title'), '') is not null
                  ),
                  '[]'::jsonb
                ),
              'brochureSections',
                coalesce(
                  (
                    select jsonb_agg(
                      jsonb_build_object(
                        'id',
                          coalesce(
                            nullif(trim(section.value ->> 'id'), ''),
                            'legacy-section-' || replace(doc.id::text, '-', '') || '-' || section.ordinality::text
                          ),
                        'title', coalesce(section.value ->> 'title', ''),
                        'column',
                          case
                            when mod(section.ordinality, 2) = 0 then 'right'
                            else 'left'
                          end,
                        'paragraphs',
                          case
                            when nullif(trim(section.value ->> 'body'), '') is not null
                              then jsonb_build_array(section.value ->> 'body')
                            else '[]'::jsonb
                          end,
                        'bullets', coalesce(section.value -> 'bullets', '[]'::jsonb)
                      )
                      order by section.ordinality
                    )
                    from jsonb_array_elements(coalesce(normalized.content -> 'sections', '[]'::jsonb))
                      with ordinality as section(value, ordinality)
                  ),
                  '[]'::jsonb
                )
            )
          ),
          'addOnOptions', '[]'::jsonb,
          'bundleRule', null,
          'libraryMeta', jsonb_build_object(
            'isListed', doc.status = 'published',
            'cardCompany',
              coalesce(
                nullif(trim(doc.client_company), ''),
                nullif(trim(doc.client_name), ''),
                'Studio Project'
              ),
            'cardTitle', coalesce(nullif(trim(doc.title), ''), 'Untitled project'),
            'cardCategory', 'Project',
            'cardStatusLabel',
              case
                when doc.status = 'published' then 'Code required'
                when doc.status = 'archived' then 'Archived'
                else 'Draft'
              end,
            'cardSummary', normalized.intro_text,
            'cardLogoUrl', normalized.logo_url
          )
        )
    end
from normalized
where doc.id = normalized.id;

drop function if exists public."RUSHI_PERSONAL_LIST_STUDIO_LIBRARY"();

create function public."RUSHI_PERSONAL_LIST_STUDIO_LIBRARY"()
returns table (
  id uuid,
  "engagementId" uuid,
  code text,
  kind text,
  "documentStatus" text,
  "updatedAt" timestamptz,
  "cardCompany" text,
  "cardTitle" text,
  "cardCategory" text,
  "cardStatusLabel" text,
  "cardSummary" text,
  "cardLogoUrl" text
)
language sql
security definer
set search_path = public
as $$
  select
    document_row.id,
    document_row.engagement_id as "engagementId",
    document_row.code,
    'project'::text as kind,
    document_row.status as "documentStatus",
    document_row.updated_at as "updatedAt",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardCompany'), ''),
      nullif(trim(document_row.client_company), ''),
      nullif(trim(document_row.client_name), ''),
      'Studio Project'
    ) as "cardCompany",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardTitle'), ''),
      nullif(trim(document_row.title), ''),
      'Untitled project'
    ) as "cardTitle",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardCategory'), ''),
      'Project'
    ) as "cardCategory",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardStatusLabel'), ''),
      case
        when document_row.status = 'published' then 'Code required'
        when document_row.status = 'archived' then 'Archived'
        else 'Draft'
      end
    ) as "cardStatusLabel",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardSummary'), ''),
      nullif(trim(document_row.content ->> 'introText'), ''),
      nullif(trim(document_row.title), ''),
      'Shared through the public studio.'
    ) as "cardSummary",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardLogoUrl'), ''),
      nullif(trim(document_row.content ->> 'logoUrl'), ''),
      ''
    ) as "cardLogoUrl"
  from public."RUSHI_PERSONAL_DOCUMENTS" document_row
  where document_row.status = 'published'
  order by document_row.updated_at desc;
$$;

grant execute on function public."RUSHI_PERSONAL_LIST_STUDIO_LIBRARY"() to anon;
grant execute on function public."RUSHI_PERSONAL_LIST_STUDIO_LIBRARY"() to authenticated;

drop function if exists public."RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE"(text);

create function public."RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE"(input_code text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', document_row.id,
    'engagementId', document_row.engagement_id,
    'kind', 'project',
    'code', document_row.code,
    'status', document_row.status,
    'title', document_row.title,
    'clientName', document_row.client_name,
    'clientCompany', document_row.client_company,
    'clientEmail', document_row.client_email,
    'ctaLabel', document_row.cta_label,
    'adminEmail', document_row.admin_email,
    'content', document_row.content,
    'createdAt', document_row.created_at,
    'updatedAt', document_row.updated_at
  )
  from public."RUSHI_PERSONAL_DOCUMENTS" document_row
  where lower(document_row.code) = lower(trim(input_code))
    and document_row.status = 'published'
  limit 1;
$$;

grant execute on function public."RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE"(text) to anon;
grant execute on function public."RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE"(text) to authenticated;
