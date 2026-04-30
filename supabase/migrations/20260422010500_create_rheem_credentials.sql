create table if not exists public."RUSHI_PERSONAL_CREDENTIALS" (
  id uuid primary key default gen_random_uuid(),
  event_key text not null default 'rheem-ai-fluency-2026',
  code text not null,
  participant_name text not null,
  claim_source text not null default 'self-claim' check (claim_source in ('self-claim', 'manual', 'import')),
  status text not null default 'issued' check (status in ('issued', 'revoked')),
  issued_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (length(trim(event_key)) > 0),
  check (length(trim(code)) > 0),
  check (length(trim(participant_name)) > 0)
);

drop trigger if exists "RUSHI_PERSONAL_CREDENTIALS_TOUCH_UPDATED_AT"
  on public."RUSHI_PERSONAL_CREDENTIALS";

create trigger "RUSHI_PERSONAL_CREDENTIALS_TOUCH_UPDATED_AT"
before update on public."RUSHI_PERSONAL_CREDENTIALS"
for each row
execute function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"();

alter table public."RUSHI_PERSONAL_CREDENTIALS" enable row level security;

drop policy if exists "RUSHI_PERSONAL_CREDENTIALS_ADMIN_SELECT" on public."RUSHI_PERSONAL_CREDENTIALS";
create policy "RUSHI_PERSONAL_CREDENTIALS_ADMIN_SELECT"
on public."RUSHI_PERSONAL_CREDENTIALS"
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_CREDENTIALS_ADMIN_INSERT" on public."RUSHI_PERSONAL_CREDENTIALS";
create policy "RUSHI_PERSONAL_CREDENTIALS_ADMIN_INSERT"
on public."RUSHI_PERSONAL_CREDENTIALS"
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_CREDENTIALS_ADMIN_UPDATE" on public."RUSHI_PERSONAL_CREDENTIALS";
create policy "RUSHI_PERSONAL_CREDENTIALS_ADMIN_UPDATE"
on public."RUSHI_PERSONAL_CREDENTIALS"
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop policy if exists "RUSHI_PERSONAL_CREDENTIALS_ADMIN_DELETE" on public."RUSHI_PERSONAL_CREDENTIALS";
create policy "RUSHI_PERSONAL_CREDENTIALS_ADMIN_DELETE"
on public."RUSHI_PERSONAL_CREDENTIALS"
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'rushi@knowwhatson.com');

drop index if exists "RUSHI_PERSONAL_CREDENTIALS_CODE_UNIQUE";
create unique index if not exists "RUSHI_PERSONAL_CREDENTIALS_CODE_UNIQUE"
  on public."RUSHI_PERSONAL_CREDENTIALS" (lower(code));

create index if not exists "RUSHI_PERSONAL_CREDENTIALS_EVENT_KEY_IDX"
  on public."RUSHI_PERSONAL_CREDENTIALS" (lower(event_key), issued_at desc);
