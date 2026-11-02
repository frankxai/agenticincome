-- Run only through an authorized server/database connection. Never put its credentials
-- in a browser. Feed the resulting snapshot to query-observatory.mjs for field projection.
-- No customer, goal, run, receipt-provider or memory tables are selected here.
select jsonb_build_object(
  'as_of', now(),
  'products', coalesce((select jsonb_agg(p order by product_id) from product_intelligence.products p), '[]'::jsonb),
  'sources', coalesce((select jsonb_agg(s order by source_id) from product_intelligence.sources s), '[]'::jsonb),
  'observations', coalesce((select jsonb_agg(o order by observation_id) from product_intelligence.observations o), '[]'::jsonb),
  'assessments', coalesce((select jsonb_agg(a order by assessment_id) from product_intelligence.assessments a), '[]'::jsonb)
) as snapshot;
