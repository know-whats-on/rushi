create table if not exists public."RUSHI_PERSONAL_PROJECT_ACCESS" (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public."RUSHI_PERSONAL_DOCUMENTS"(id) on delete cascade,
  code text not null,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (document_id)
);

create table if not exists public."RUSHI_PERSONAL_PROJECT_PARTICIPANTS" (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public."RUSHI_PERSONAL_DOCUMENTS"(id) on delete cascade,
  code text not null,
  name text not null default '',
  email text not null default '',
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public."RUSHI_PERSONAL_PROJECT_MESSAGES" (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public."RUSHI_PERSONAL_DOCUMENTS"(id) on delete cascade,
  participant_id uuid references public."RUSHI_PERSONAL_PROJECT_PARTICIPANTS"(id) on delete set null,
  code text not null,
  author_role text not null check (author_role in ('client', 'studio')),
  author_name text not null default '',
  author_email text not null default '',
  body text not null default '',
  visible_to_client boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public."RUSHI_PERSONAL_PROJECT_ACTIONS" (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public."RUSHI_PERSONAL_DOCUMENTS"(id) on delete cascade,
  participant_id uuid references public."RUSHI_PERSONAL_PROJECT_PARTICIPANTS"(id) on delete set null,
  code text not null,
  kind text not null check (kind in ('approve', 'request_changes')),
  author_name text not null default '',
  author_email text not null default '',
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

drop index if exists "RUSHI_PERSONAL_PROJECT_ACCESS_CODE_UNIQUE";
create unique index if not exists "RUSHI_PERSONAL_PROJECT_ACCESS_CODE_UNIQUE"
  on public."RUSHI_PERSONAL_PROJECT_ACCESS" (lower(code));

drop index if exists "RUSHI_PERSONAL_PROJECT_PARTICIPANTS_EMAIL_UNIQUE";
create unique index if not exists "RUSHI_PERSONAL_PROJECT_PARTICIPANTS_EMAIL_UNIQUE"
  on public."RUSHI_PERSONAL_PROJECT_PARTICIPANTS" (document_id, lower(email));

create index if not exists "RUSHI_PERSONAL_PROJECT_MESSAGES_DOCUMENT_ID_IDX"
  on public."RUSHI_PERSONAL_PROJECT_MESSAGES" (document_id, created_at);

create index if not exists "RUSHI_PERSONAL_PROJECT_ACTIONS_DOCUMENT_ID_IDX"
  on public."RUSHI_PERSONAL_PROJECT_ACTIONS" (document_id, created_at);

drop trigger if exists "RUSHI_PERSONAL_PROJECT_ACCESS_TOUCH_UPDATED_AT"
  on public."RUSHI_PERSONAL_PROJECT_ACCESS";
create trigger "RUSHI_PERSONAL_PROJECT_ACCESS_TOUCH_UPDATED_AT"
before update on public."RUSHI_PERSONAL_PROJECT_ACCESS"
for each row
execute function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"();

drop trigger if exists "RUSHI_PERSONAL_PROJECT_PARTICIPANTS_TOUCH_UPDATED_AT"
  on public."RUSHI_PERSONAL_PROJECT_PARTICIPANTS";
create trigger "RUSHI_PERSONAL_PROJECT_PARTICIPANTS_TOUCH_UPDATED_AT"
before update on public."RUSHI_PERSONAL_PROJECT_PARTICIPANTS"
for each row
execute function public."RUSHI_PERSONAL_TOUCH_UPDATED_AT"();

alter table public."RUSHI_PERSONAL_PROJECT_ACCESS" enable row level security;
alter table public."RUSHI_PERSONAL_PROJECT_PARTICIPANTS" enable row level security;
alter table public."RUSHI_PERSONAL_PROJECT_MESSAGES" enable row level security;
alter table public."RUSHI_PERSONAL_PROJECT_ACTIONS" enable row level security;
