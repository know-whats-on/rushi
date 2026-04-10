do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'RUSHI_PERSONAL_DOCUMENTS'
      and con.contype = 'c'
      and exists (
        select 1
        from unnest(con.conkey) as key(attnum)
        join pg_attribute attr
          on attr.attrelid = rel.oid
         and attr.attnum = key.attnum
        where attr.attname = 'kind'
      )
  loop
    execute format(
      'alter table public."RUSHI_PERSONAL_DOCUMENTS" drop constraint %I',
      constraint_name
    );
  end loop;
end
$$;

alter table public."RUSHI_PERSONAL_DOCUMENTS"
  add constraint "RUSHI_PERSONAL_DOCUMENTS_KIND_CHECK"
  check (kind in ('brochure', 'quote', 'project'));
