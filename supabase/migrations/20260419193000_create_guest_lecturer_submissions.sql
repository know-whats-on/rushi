create table if not exists public."RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS" (
  id uuid primary key default gen_random_uuid(),
  campaign_key text not null,
  name text not null default '',
  email text not null default '',
  linkedin_url text not null default '',
  topic_preference text not null default '',
  selected_weeks integer[] not null default '{}'::integer[],
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists "RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS_CREATED_AT_IDX"
  on public."RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS" (campaign_key, created_at desc);

create index if not exists "RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS_SELECTED_WEEKS_IDX"
  on public."RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS"
  using gin (selected_weeks);

alter table public."RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS" enable row level security;
