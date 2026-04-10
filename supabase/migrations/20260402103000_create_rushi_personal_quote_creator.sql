create table if not exists public."RUSHI_PERSONAL_QUOTES" (
  id uuid primary key default gen_random_uuid(),
  quote_code text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  title text not null default 'Untitled Quote',
  client_name text not null default '',
  client_company text not null default '',
  client_email text not null default '',
  intro_text text not null default '',
  currency text not null default 'AUD',
  gst_mode text not null default 'exclusive' check (gst_mode in ('none', 'exclusive', 'inclusive')),
  subtotal numeric(12,2) not null default 0,
  gst_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  valid_until date,
  notes text,
  cta_label text not null default 'Email about this quote',
  admin_email text not null default 'rushi@knowwhatson.com',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public."RUSHI_PERSONAL_QUOTE_ITEMS" (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public."RUSHI_PERSONAL_QUOTES"(id) on delete cascade,
  description text not null default '',
  quantity numeric(12,2) not null default 0 check (quantity >= 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  line_total numeric(12,2) not null default 0,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists "RUSHI_PERSONAL_QUOTES_CODE_UNIQUE"
  on public."RUSHI_PERSONAL_QUOTES" (lower(quote_code));

create index if not exists "RUSHI_PERSONAL_QUOTE_ITEMS_QUOTE_ID_IDX"
  on public."RUSHI_PERSONAL_QUOTE_ITEMS" (quote_id, display_order);

create or replace function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists "RUSHI_PERSONAL_QUOTES_TOUCH_UPDATED_AT" on public."RUSHI_PERSONAL_QUOTES";

create trigger "RUSHI_PERSONAL_QUOTES_TOUCH_UPDATED_AT"
before update on public."RUSHI_PERSONAL_QUOTES"
for each row
execute function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"();

alter table public."RUSHI_PERSONAL_QUOTES" enable row level security;
alter table public."RUSHI_PERSONAL_QUOTE_ITEMS" enable row level security;

drop policy if exists "RUSHI_PERSONAL_QUOTES_ADMIN_SELECT" on public."RUSHI_PERSONAL_QUOTES";
create policy "RUSHI_PERSONAL_QUOTES_ADMIN_SELECT"
on public."RUSHI_PERSONAL_QUOTES"
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_QUOTES_ADMIN_INSERT" on public."RUSHI_PERSONAL_QUOTES";
create policy "RUSHI_PERSONAL_QUOTES_ADMIN_INSERT"
on public."RUSHI_PERSONAL_QUOTES"
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_QUOTES_ADMIN_UPDATE" on public."RUSHI_PERSONAL_QUOTES";
create policy "RUSHI_PERSONAL_QUOTES_ADMIN_UPDATE"
on public."RUSHI_PERSONAL_QUOTES"
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_QUOTES_ADMIN_DELETE" on public."RUSHI_PERSONAL_QUOTES";
create policy "RUSHI_PERSONAL_QUOTES_ADMIN_DELETE"
on public."RUSHI_PERSONAL_QUOTES"
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_SELECT" on public."RUSHI_PERSONAL_QUOTE_ITEMS";
create policy "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_SELECT"
on public."RUSHI_PERSONAL_QUOTE_ITEMS"
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_INSERT" on public."RUSHI_PERSONAL_QUOTE_ITEMS";
create policy "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_INSERT"
on public."RUSHI_PERSONAL_QUOTE_ITEMS"
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_UPDATE" on public."RUSHI_PERSONAL_QUOTE_ITEMS";
create policy "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_UPDATE"
on public."RUSHI_PERSONAL_QUOTE_ITEMS"
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_DELETE" on public."RUSHI_PERSONAL_QUOTE_ITEMS";
create policy "RUSHI_PERSONAL_QUOTE_ITEMS_ADMIN_DELETE"
on public."RUSHI_PERSONAL_QUOTE_ITEMS"
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

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
    'status', quote_row.status,
    'title', quote_row.title,
    'clientName', quote_row.client_name,
    'clientCompany', quote_row.client_company,
    'clientEmail', quote_row.client_email,
    'introText', quote_row.intro_text,
    'currency', quote_row.currency,
    'gstMode', quote_row.gst_mode,
    'subtotal', quote_row.subtotal,
    'gstAmount', quote_row.gst_amount,
    'total', quote_row.total,
    'validUntil', quote_row.valid_until,
    'notes', quote_row.notes,
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
