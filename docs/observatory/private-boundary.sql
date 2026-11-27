-- Repeatable catalog-only check. Returns zero rows when the research boundary holds.
-- Reads no product observations and works after the historical seed changes.
with expected(name) as (
  values ('products'), ('sources'), ('observations'), ('assessments'),
         ('funnel_edges'), ('curation_runs'), ('operating_goals')
), clients(role_name) as (
  values ('anon'), ('authenticated')
), relations as (
  select c.oid, c.relname::text as name, c.relkind, c.relrowsecurity
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'product_intelligence' and c.relkind in ('r','p','v','m','f')
)
select name as object_name, 'expected table missing' as finding
from expected
where not exists (select 1 from relations r where r.name = expected.name and r.relkind in ('r','p'))
union all
select name, 'row level security disabled'
from relations where relkind in ('r','p') and not relrowsecurity
union all
select n.nspname, 'client schema privileges: ' || role_name
from pg_namespace n cross join clients
where n.nspname = 'product_intelligence' and has_schema_privilege(role_name, n.oid, 'USAGE, CREATE')
union all
select r.name, 'client relation privileges: ' || role_name
from relations r cross join clients
where has_table_privilege(role_name, r.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')
   or has_any_column_privilege(role_name, r.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
order by 1, 2;
