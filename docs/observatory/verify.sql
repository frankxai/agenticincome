-- Read-only state checks plus rejection probes rolled back inside exception blocks.
do $$
declare role_name text;
begin
  if (select count(*) from product_intelligence.products) <> 12 then raise exception 'Expected 12 seed products'; end if;
  if (select count(*) from product_intelligence.sources) <> 15 then raise exception 'Expected 15 seed sources'; end if;
  if (select count(*) from product_intelligence.observations) <> 25 then raise exception 'Expected 25 seed observations'; end if;
  if exists (select 1 from product_intelligence.assessments group by product_id having sum(weight) <> 1) then raise exception 'Rubric weights must total 1'; end if;
  if exists (select 1 from product_intelligence.operating_goals where actual is not null or status <> 'unmeasured') then raise exception 'Seed must not claim customer success'; end if;
  begin
    insert into product_intelligence.products select * from product_intelligence.products where product_id='tally';
    raise exception 'Duplicate identity accepted';
  exception when unique_violation then null; end;
  begin
    update product_intelligence.assessments set score=5 where state='unknown';
    raise exception 'Unknown score accepted';
  exception when check_violation then null; end;
  begin
    update product_intelligence.observations set value_numeric=.5,unit='currency_minor',currency='USD' where observation_id='tally-reported_arr-20261101';
    raise exception 'Fractional minor-unit money accepted';
  exception when check_violation then null; end;
  begin
    update product_intelligence.funnel_edges set rate=1.1;
    raise exception 'Invalid funnel rate accepted';
  exception when check_violation then null; end;
  foreach role_name in array array['anon','authenticated'] loop
    begin
      execute format('set local role %I',role_name);
      perform 1 from product_intelligence.products limit 1;
      execute 'reset role';
      raise exception 'Unprivileged market-data read succeeded';
    exception when insufficient_privilege then null; end;
  end loop;
end $$;
select jsonb_build_object(
  'products',(select count(*) from product_intelligence.products),
  'sources',(select count(*) from product_intelligence.sources),
  'observations',(select count(*) from product_intelligence.observations),
  'assessments',(select count(*) from product_intelligence.assessments),
  'unscored_dimensions',(select count(*) from product_intelligence.assessments where state='unknown'),
  'funnel_edges',(select count(*) from product_intelligence.funnel_edges),
  'unmeasured_goals',(select count(*) from product_intelligence.operating_goals where status='unmeasured'),
  'verified_financial_observations',(select count(*) from product_intelligence.observations where basis='first_party_verified'),
  'tables',(select jsonb_agg(jsonb_build_object('name',c.relname,'rls',c.relrowsecurity,'anon_select',has_table_privilege('anon',c.oid,'SELECT'),'authenticated_select',has_table_privilege('authenticated',c.oid,'SELECT'))) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='product_intelligence' and c.relkind='r'),
  'rejection_probes','passed: duplicate identity, unknown numeric score, fractional minor-unit money, invalid rate, anonymous read, authenticated read'
) as verification;
