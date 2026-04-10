create table if not exists public."RUSHI_PERSONAL_ENGAGEMENTS" (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new', 'drafting', 'shared', 'won', 'archived')),
  source text not null default 'manual',
  contact_name text not null default '',
  organisation text not null default '',
  email text not null default '',
  service_type text not null default '',
  timeline text not null default '',
  budget_range text not null default '',
  brief text not null default '',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public."RUSHI_PERSONAL_DOCUMENTS" (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public."RUSHI_PERSONAL_ENGAGEMENTS"(id) on delete cascade,
  kind text not null check (kind in ('brochure', 'quote')),
  code text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  title text not null default '',
  client_name text not null default '',
  client_company text not null default '',
  client_email text not null default '',
  cta_label text not null default 'Email about this quote',
  admin_email text not null default 'rushi@knowwhatson.com',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (engagement_id)
);

drop trigger if exists "RUSHI_PERSONAL_ENGAGEMENTS_TOUCH_UPDATED_AT"
  on public."RUSHI_PERSONAL_ENGAGEMENTS";

create trigger "RUSHI_PERSONAL_ENGAGEMENTS_TOUCH_UPDATED_AT"
before update on public."RUSHI_PERSONAL_ENGAGEMENTS"
for each row
execute function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"();

drop trigger if exists "RUSHI_PERSONAL_DOCUMENTS_TOUCH_UPDATED_AT"
  on public."RUSHI_PERSONAL_DOCUMENTS";

create trigger "RUSHI_PERSONAL_DOCUMENTS_TOUCH_UPDATED_AT"
before update on public."RUSHI_PERSONAL_DOCUMENTS"
for each row
execute function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"();

alter table public."RUSHI_PERSONAL_ENGAGEMENTS" enable row level security;
alter table public."RUSHI_PERSONAL_DOCUMENTS" enable row level security;

drop policy if exists "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_SELECT" on public."RUSHI_PERSONAL_ENGAGEMENTS";
create policy "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_SELECT"
on public."RUSHI_PERSONAL_ENGAGEMENTS"
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_INSERT" on public."RUSHI_PERSONAL_ENGAGEMENTS";
create policy "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_INSERT"
on public."RUSHI_PERSONAL_ENGAGEMENTS"
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_UPDATE" on public."RUSHI_PERSONAL_ENGAGEMENTS";
create policy "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_UPDATE"
on public."RUSHI_PERSONAL_ENGAGEMENTS"
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_DELETE" on public."RUSHI_PERSONAL_ENGAGEMENTS";
create policy "RUSHI_PERSONAL_ENGAGEMENTS_ADMIN_DELETE"
on public."RUSHI_PERSONAL_ENGAGEMENTS"
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_DOCUMENTS_ADMIN_SELECT" on public."RUSHI_PERSONAL_DOCUMENTS";
create policy "RUSHI_PERSONAL_DOCUMENTS_ADMIN_SELECT"
on public."RUSHI_PERSONAL_DOCUMENTS"
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_DOCUMENTS_ADMIN_INSERT" on public."RUSHI_PERSONAL_DOCUMENTS";
create policy "RUSHI_PERSONAL_DOCUMENTS_ADMIN_INSERT"
on public."RUSHI_PERSONAL_DOCUMENTS"
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_DOCUMENTS_ADMIN_UPDATE" on public."RUSHI_PERSONAL_DOCUMENTS";
create policy "RUSHI_PERSONAL_DOCUMENTS_ADMIN_UPDATE"
on public."RUSHI_PERSONAL_DOCUMENTS"
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_DOCUMENTS_ADMIN_DELETE" on public."RUSHI_PERSONAL_DOCUMENTS";
create policy "RUSHI_PERSONAL_DOCUMENTS_ADMIN_DELETE"
on public."RUSHI_PERSONAL_DOCUMENTS"
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

create index if not exists "RUSHI_PERSONAL_ENGAGEMENTS_STATUS_IDX"
  on public."RUSHI_PERSONAL_ENGAGEMENTS" (status, updated_at desc);

drop index if exists "RUSHI_PERSONAL_DOCUMENTS_CODE_UNIQUE";
create unique index if not exists "RUSHI_PERSONAL_DOCUMENTS_CODE_UNIQUE"
  on public."RUSHI_PERSONAL_DOCUMENTS" (lower(code))
  where length(trim(code)) > 0;

do $$
declare
  quote_row record;
  brochure_row record;
  engagement_uuid uuid;
begin
  if to_regclass('public."RUSHI_PERSONAL_QUOTES"') is not null then
    for quote_row in
      select *
      from public."RUSHI_PERSONAL_QUOTES"
      where length(trim(coalesce(quote_code, ''))) > 0
    loop
      if exists (
        select 1
        from public."RUSHI_PERSONAL_DOCUMENTS" document_row
        where lower(document_row.code) = lower(trim(quote_row.quote_code))
      ) then
        continue;
      end if;

      insert into public."RUSHI_PERSONAL_ENGAGEMENTS" (
        status,
        source,
        contact_name,
        organisation,
        email,
        service_type,
        brief,
        notes,
        created_at,
        updated_at
      )
      values (
        case
          when quote_row.status = 'published' then 'shared'
          when quote_row.status = 'archived' then 'archived'
          else 'drafting'
        end,
        'legacy-quote',
        coalesce(quote_row.client_name, ''),
        coalesce(quote_row.client_company, ''),
        coalesce(quote_row.client_email, ''),
        'Quote',
        coalesce(quote_row.intro_text, ''),
        coalesce(quote_row.notes, ''),
        coalesce(quote_row.created_at, timezone('utc', now())),
        coalesce(quote_row.updated_at, coalesce(quote_row.created_at, timezone('utc', now())))
      )
      returning id into engagement_uuid;

      insert into public."RUSHI_PERSONAL_DOCUMENTS" (
        engagement_id,
        kind,
        code,
        status,
        title,
        client_name,
        client_company,
        client_email,
        cta_label,
        admin_email,
        content,
        created_at,
        updated_at
      )
      values (
        engagement_uuid,
        'quote',
        trim(quote_row.quote_code),
        quote_row.status,
        coalesce(quote_row.title, ''),
        coalesce(quote_row.client_name, ''),
        coalesce(quote_row.client_company, ''),
        coalesce(quote_row.client_email, ''),
        coalesce(quote_row.cta_label, 'Email about this quote'),
        coalesce(quote_row.admin_email, 'rushi@knowwhatson.com'),
        jsonb_build_object(
          'quoteId', coalesce(quote_row.quote_id, ''),
          'introText', coalesce(quote_row.intro_text, ''),
          'issuedOn', quote_row.issued_on,
          'currency', coalesce(quote_row.currency, 'AUD'),
          'gstMode', coalesce(quote_row.gst_mode, 'exclusive'),
          'validUntil', quote_row.valid_until,
          'notes', coalesce(quote_row.notes, ''),
          'terms', coalesce(quote_row.terms, ''),
          'acceptanceLine', coalesce(quote_row.acceptance_line, ''),
          'items',
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'id', item.id,
                    'description', item.description,
                    'quantity', item.quantity,
                    'unitPrice', item.unit_price,
                    'lineTotal', item.line_total,
                    'displayOrder', item.display_order
                  )
                  order by item.display_order
                )
                from public."RUSHI_PERSONAL_QUOTE_ITEMS" item
                where item.quote_id = quote_row.id
              ),
              '[]'::jsonb
            )
        ),
        coalesce(quote_row.created_at, timezone('utc', now())),
        coalesce(quote_row.updated_at, coalesce(quote_row.created_at, timezone('utc', now())))
      );
    end loop;
  end if;

  if to_regclass('public."RUSHI_PERSONAL_BROCHURES"') is not null then
    for brochure_row in
      select *
      from public."RUSHI_PERSONAL_BROCHURES"
      where length(trim(coalesce(brochure_code, ''))) > 0
    loop
      if exists (
        select 1
        from public."RUSHI_PERSONAL_DOCUMENTS" document_row
        where lower(document_row.code) = lower(trim(brochure_row.brochure_code))
      ) then
        continue;
      end if;

      insert into public."RUSHI_PERSONAL_ENGAGEMENTS" (
        status,
        source,
        contact_name,
        organisation,
        email,
        service_type,
        brief,
        notes,
        created_at,
        updated_at
      )
      values (
        case
          when brochure_row.status = 'published' then 'shared'
          when brochure_row.status = 'archived' then 'archived'
          else 'drafting'
        end,
        'legacy-brochure',
        coalesce(brochure_row.client_name, ''),
        coalesce(brochure_row.client_name, ''),
        '',
        'Brochure',
        coalesce(brochure_row.subtitle, ''),
        coalesce(brochure_row.footer_compliance_text, ''),
        coalesce(brochure_row.created_at, timezone('utc', now())),
        coalesce(brochure_row.updated_at, coalesce(brochure_row.created_at, timezone('utc', now())))
      )
      returning id into engagement_uuid;

      insert into public."RUSHI_PERSONAL_DOCUMENTS" (
        engagement_id,
        kind,
        code,
        status,
        title,
        client_name,
        client_company,
        client_email,
        cta_label,
        admin_email,
        content,
        created_at,
        updated_at
      )
      values (
        engagement_uuid,
        'brochure',
        trim(brochure_row.brochure_code),
        brochure_row.status,
        coalesce(brochure_row.title, ''),
        coalesce(brochure_row.client_name, ''),
        coalesce(brochure_row.client_name, ''),
        '',
        'View brochure',
        coalesce(brochure_row.admin_email, 'rushi@knowwhatson.com'),
        jsonb_build_object(
          'logoUrl', coalesce(brochure_row.logo_url, ''),
          'subtitle', coalesce(brochure_row.subtitle, ''),
          'duration', coalesce(brochure_row.duration, ''),
          'deliveryMode', coalesce(brochure_row.delivery_mode, ''),
          'studyLoad', coalesce(brochure_row.study_load, ''),
          'priceLabel', coalesce(brochure_row.price_label, ''),
          'ctas', coalesce(brochure_row.ctas, '[]'::jsonb),
          'sections', coalesce(brochure_row.sections, '[]'::jsonb),
          'footerComplianceText', coalesce(brochure_row.footer_compliance_text, '')
        ),
        coalesce(brochure_row.created_at, timezone('utc', now())),
        coalesce(brochure_row.updated_at, coalesce(brochure_row.created_at, timezone('utc', now())))
      );
    end loop;
  end if;
end;
$$;

create or replace function public."RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE"(input_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  document_row public."RUSHI_PERSONAL_DOCUMENTS"%rowtype;
begin
  select *
  into document_row
  from public."RUSHI_PERSONAL_DOCUMENTS"
  where lower(code) = lower(trim(input_code))
    and status = 'published'
  limit 1;

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'id', document_row.id,
    'engagementId', document_row.engagement_id,
    'kind', document_row.kind,
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
  );
end;
$$;

grant execute on function public."RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE"(text) to anon;
grant execute on function public."RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE"(text) to authenticated;
