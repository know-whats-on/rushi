alter table public."RUSHI_PERSONAL_QUOTES"
  add column if not exists quote_id text not null default '',
  add column if not exists issued_on date,
  add column if not exists terms text,
  add column if not exists acceptance_line text;

create or replace function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public."RUSHI_PERSONAL_BROCHURES" (
  id uuid primary key default gen_random_uuid(),
  brochure_code text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  client_name text not null default '',
  logo_url text not null default '',
  title text not null default 'Untitled Brochure',
  subtitle text not null default '',
  duration text not null default '',
  delivery_mode text not null default '',
  study_load text not null default '',
  price_label text not null default '',
  ctas jsonb not null default '[]'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  footer_compliance_text text,
  admin_email text not null default 'rushi@knowwhatson.com',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop index if exists "RUSHI_PERSONAL_QUOTES_CODE_UNIQUE";
create unique index if not exists "RUSHI_PERSONAL_QUOTES_CODE_UNIQUE"
  on public."RUSHI_PERSONAL_QUOTES" (lower(quote_code))
  where length(trim(quote_code)) > 0;

drop index if exists "RUSHI_PERSONAL_BROCHURES_CODE_UNIQUE";
create unique index if not exists "RUSHI_PERSONAL_BROCHURES_CODE_UNIQUE"
  on public."RUSHI_PERSONAL_BROCHURES" (lower(brochure_code))
  where length(trim(brochure_code)) > 0;

drop trigger if exists "RUSHI_PERSONAL_BROCHURES_TOUCH_UPDATED_AT"
  on public."RUSHI_PERSONAL_BROCHURES";

create trigger "RUSHI_PERSONAL_BROCHURES_TOUCH_UPDATED_AT"
before update on public."RUSHI_PERSONAL_BROCHURES"
for each row
execute function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"();

alter table public."RUSHI_PERSONAL_BROCHURES" enable row level security;

drop policy if exists "RUSHI_PERSONAL_BROCHURES_ADMIN_SELECT" on public."RUSHI_PERSONAL_BROCHURES";
create policy "RUSHI_PERSONAL_BROCHURES_ADMIN_SELECT"
on public."RUSHI_PERSONAL_BROCHURES"
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_BROCHURES_ADMIN_INSERT" on public."RUSHI_PERSONAL_BROCHURES";
create policy "RUSHI_PERSONAL_BROCHURES_ADMIN_INSERT"
on public."RUSHI_PERSONAL_BROCHURES"
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_BROCHURES_ADMIN_UPDATE" on public."RUSHI_PERSONAL_BROCHURES";
create policy "RUSHI_PERSONAL_BROCHURES_ADMIN_UPDATE"
on public."RUSHI_PERSONAL_BROCHURES"
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_BROCHURES_ADMIN_DELETE" on public."RUSHI_PERSONAL_BROCHURES";
create policy "RUSHI_PERSONAL_BROCHURES_ADMIN_DELETE"
on public."RUSHI_PERSONAL_BROCHURES"
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

create or replace function public."RUSHI_PERSONAL_GET_BROCHURE_BY_CODE"(input_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  brochure_row public."RUSHI_PERSONAL_BROCHURES"%rowtype;
begin
  select *
  into brochure_row
  from public."RUSHI_PERSONAL_BROCHURES"
  where lower(brochure_code) = lower(trim(input_code))
    and status = 'published'
  limit 1;

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'id', brochure_row.id,
    'brochureCode', brochure_row.brochure_code,
    'status', brochure_row.status,
    'clientName', brochure_row.client_name,
    'logoUrl', brochure_row.logo_url,
    'title', brochure_row.title,
    'subtitle', brochure_row.subtitle,
    'duration', brochure_row.duration,
    'deliveryMode', brochure_row.delivery_mode,
    'studyLoad', brochure_row.study_load,
    'priceLabel', brochure_row.price_label,
    'ctas', brochure_row.ctas,
    'sections', brochure_row.sections,
    'footerComplianceText', brochure_row.footer_compliance_text,
    'adminEmail', brochure_row.admin_email,
    'createdAt', brochure_row.created_at,
    'updatedAt', brochure_row.updated_at
  );
end;
$$;

grant execute on function public."RUSHI_PERSONAL_GET_BROCHURE_BY_CODE"(text) to anon;
grant execute on function public."RUSHI_PERSONAL_GET_BROCHURE_BY_CODE"(text) to authenticated;

create or replace function public."RUSHI_PERSONAL_GET_QUOTE_BY_CODE"(input_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  quote_row public."RUSHI_PERSONAL_QUOTES"%rowtype;
begin
  select *
  into quote_row
  from public."RUSHI_PERSONAL_QUOTES"
  where lower(quote_code) = lower(trim(input_code))
    and status = 'published'
  limit 1;

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'id', quote_row.id,
    'quoteCode', quote_row.quote_code,
    'quoteId', quote_row.quote_id,
    'status', quote_row.status,
    'title', quote_row.title,
    'clientName', quote_row.client_name,
    'clientCompany', quote_row.client_company,
    'clientEmail', quote_row.client_email,
    'introText', quote_row.intro_text,
    'issuedOn', quote_row.issued_on,
    'currency', quote_row.currency,
    'gstMode', quote_row.gst_mode,
    'subtotal', quote_row.subtotal,
    'gstAmount', quote_row.gst_amount,
    'total', quote_row.total,
    'validUntil', quote_row.valid_until,
    'notes', quote_row.notes,
    'terms', quote_row.terms,
    'acceptanceLine', quote_row.acceptance_line,
    'ctaLabel', quote_row.cta_label,
    'adminEmail', quote_row.admin_email,
    'createdAt', quote_row.created_at,
    'updatedAt', quote_row.updated_at,
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
  );
end;
$$;

grant execute on function public."RUSHI_PERSONAL_GET_QUOTE_BY_CODE"(text) to anon;
grant execute on function public."RUSHI_PERSONAL_GET_QUOTE_BY_CODE"(text) to authenticated;
