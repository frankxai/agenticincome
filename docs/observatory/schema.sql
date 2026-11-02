-- Additive private market-research schema. No customer ledger, Registry replacement,
-- public API grants, auth functions, checkout, cron, or production UI changes.
begin;
create schema product_intelligence;
revoke all on schema product_intelligence from public, anon, authenticated;
grant usage on schema product_intelligence to service_role;

create table product_intelligence.products (
  product_id text primary key check (product_id ~ '^[a-z0-9][a-z0-9-]+$'),
  name text not null,
  canonical_url text not null unique check (canonical_url ~ '^https://'),
  layer text not null,
  revenue_model text not null,
  model_basis text not null default 'editorial_classification',
  customer_job text not null,
  research_priority integer not null check (research_priority between 1 and 100),
  priority_reason text not null,
  image_url text check (image_url is null or image_url ~ '^https://'),
  review_state text not null default 'research' check (review_state in ('research','tested','approved_projection','archived')),
  created_at timestamptz not null default now()
);

create table product_intelligence.sources (
  source_id text primary key,
  canonical_url text not null check (canonical_url ~ '^https://'),
  title text not null,
  observed_at timestamptz not null,
  published_at timestamptz,
  source_class text not null check (source_class in ('official_documentation','vendor_report','review_platform','first_party_receipt','estimate_provider','research')),
  content_sha256 text not null check (content_sha256 ~ '^[a-f0-9]{64}$'),
  retrieval_id text,
  summary text not null,
  rights_state text not null default 'metadata_and_original_annotation_only',
  unique (canonical_url, content_sha256, observed_at)
);

create table product_intelligence.observations (
  observation_id text primary key,
  product_id text not null references product_intelligence.products,
  source_id text not null references product_intelligence.sources,
  signal text not null,
  basis text not null check (basis in ('vendor_reported','platform_reported','first_party_verified','modeled_estimate','documentation')),
  value_numeric numeric,
  unit text not null,
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  period_start date,
  period_end date,
  period_label text not null,
  definition text not null,
  verification_note text not null,
  observed_at timestamptz not null,
  check (value_numeric is null or value_numeric >= 0),
  check (period_end is null or period_start is null or period_end >= period_start),
  check ((unit = 'currency_minor' and currency is not null and value_numeric = trunc(value_numeric) and value_numeric <= 9007199254740991) or (unit <> 'currency_minor' and currency is null)),
  unique (product_id, source_id, signal, period_label)
);

create table product_intelligence.assessments (
  assessment_id text primary key,
  product_id text not null references product_intelligence.products,
  source_id text references product_intelligence.sources,
  rubric_version text not null,
  dimension text not null,
  score numeric check (score between 0 and 5),
  weight numeric not null check (weight > 0 and weight <= 1),
  state text not null check (state in ('unknown','editorial','tested')),
  rationale text not null,
  assessed_at timestamptz not null,
  check ((state = 'unknown' and score is null) or (state <> 'unknown' and score is not null and source_id is not null)),
  unique (product_id, rubric_version, dimension, assessed_at)
);

create table product_intelligence.funnel_edges (
  edge_id text primary key,
  product_id text not null references product_intelligence.products,
  source_id text not null references product_intelligence.sources,
  from_stage text not null,
  to_stage text not null,
  rate numeric check (rate between 0 and 1),
  numerator bigint check (numerator >= 0),
  denominator bigint check (denominator > 0),
  period_label text not null,
  basis text not null check (basis in ('vendor_reported','first_party_verified','modeled_estimate','hypothesis')),
  definition text not null,
  check (numerator is null or denominator is null or numerator <= denominator),
  check (basis <> 'first_party_verified' or (numerator is not null and denominator is not null)),
  unique (product_id, source_id, from_stage, to_stage, period_label)
);

create table product_intelligence.curation_runs (
  run_id text primary key,
  started_at timestamptz not null,
  completed_at timestamptz,
  status text not null check (status in ('running','complete','partial','blocked')),
  search_calls integer not null default 0 check (search_calls >= 0),
  scrape_calls integer not null default 0 check (scrape_calls >= 0),
  reported_credits numeric check (reported_credits >= 0),
  actual_cost_minor bigint check (actual_cost_minor >= 0),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  notes text not null,
  check ((actual_cost_minor is null and currency is null) or (actual_cost_minor is not null and currency is not null))
);

create table product_intelligence.operating_goals (
  goal_id text primary key,
  registry_product_ids text[] not null,
  metric_key text not null,
  target numeric not null,
  comparison text not null check (comparison in ('gte','lte','gt')),
  unit text not null,
  due_date date not null,
  actual numeric,
  status text not null default 'unmeasured' check (status in ('unmeasured','met','not_met')),
  definition text not null,
  check ((actual is null and status = 'unmeasured') or (actual is not null and status <> 'unmeasured'))
);

alter table product_intelligence.products enable row level security;
alter table product_intelligence.sources enable row level security;
alter table product_intelligence.observations enable row level security;
alter table product_intelligence.assessments enable row level security;
alter table product_intelligence.funnel_edges enable row level security;
alter table product_intelligence.curation_runs enable row level security;
alter table product_intelligence.operating_goals enable row level security;
revoke all on all tables in schema product_intelligence from public, anon, authenticated;
grant select, insert, update on all tables in schema product_intelligence to service_role;
alter default privileges in schema product_intelligence revoke all on tables from public, anon, authenticated;
comment on schema product_intelligence is 'Private external product research. Not customer data, a sales ledger, or canonical owned-product Registry. No public projection is approved by creation.';
commit;
