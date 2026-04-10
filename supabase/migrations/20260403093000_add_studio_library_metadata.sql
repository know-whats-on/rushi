alter table public."RUSHI_PERSONAL_ENGAGEMENTS"
  add column if not exists request_payload jsonb not null default '{}'::jsonb;

create or replace function public."RUSHI_PERSONAL_LIST_STUDIO_LIBRARY"()
returns table (
  id uuid,
  "engagementId" uuid,
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
    document_row.kind,
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
      case
        when document_row.kind = 'quote' then 'Quote'
        else 'Brochure'
      end
    ) as "cardCategory",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardStatusLabel'), ''),
      case
        when document_row.status = 'published' then 'Live'
        when document_row.status = 'draft' then 'In progress'
        else 'Archived'
      end
    ) as "cardStatusLabel",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardSummary'), ''),
      nullif(trim(document_row.title), ''),
      'Shared through the public studio library.'
    ) as "cardSummary",
    coalesce(
      nullif(trim(document_row.content -> 'libraryMeta' ->> 'cardLogoUrl'), ''),
      nullif(trim(document_row.content ->> 'logoUrl'), ''),
      ''
    ) as "cardLogoUrl"
  from public."RUSHI_PERSONAL_DOCUMENTS" document_row
  where coalesce((document_row.content -> 'libraryMeta' ->> 'isListed')::boolean, false)
    and document_row.status <> 'archived'
  order by document_row.updated_at desc;
$$;

grant execute on function public."RUSHI_PERSONAL_LIST_STUDIO_LIBRARY"() to anon;
grant execute on function public."RUSHI_PERSONAL_LIST_STUDIO_LIBRARY"() to authenticated;
