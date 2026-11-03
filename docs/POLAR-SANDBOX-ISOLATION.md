# Polar sandbox isolation — draft follow-up to commerce kit

This change extends the existing candidate in PR #86; it does not open any
offer, add credentials, create products, or deploy payment collection. The
catalog sale gate, provider selection and kill switch remain mandatory.

`POLAR_SERVER=sandbox` selects the sandbox API only in a local Node test or
development process, or a Vercel preview/development deployment. It refuses
Vercel production and unknown deployment environments. Sandbox requires its
own `POLAR_SANDBOX_ACCESS_TOKEN` and `POLAR_SANDBOX_PRODUCT_ID_*` values; neither
falls back to production values. A sandbox checkout response must use
`https://sandbox.polar.sh`. An unset `POLAR_SERVER` keeps the adapter's existing
production behavior. No setting in this document alone opens a checkout.

For a full rehearsal, use the existing Polar sandbox organization and its test
product, obtain a sandbox-scoped token through an approved secret channel, and
run against an isolated test fixture that satisfies the catalog gate. Do not
change production catalog statuses to exercise the sandbox. Verify the order,
signature-verified webhook, delivery, and refund separately. A checkout URL or
an `open` checkout is not a completed order or proof of fulfillment.

The API shape is documented by Polar's [create checkout session API](https://polar.sh/docs/api-reference/checkouts/create-session).
Polar documents [sandbox SDK configuration](https://docs.polar.sh/documentation/sdks/typescript-sdk);
the sandbox API host and checkout host were additionally observed in the
existing dashboard on 2026-11-03. The separate sandbox token is not provisioned
by this change. Never commit or print it.

Validation so far: `node --test tests/polar-environment.test.mjs tests/polar-adapter-sandbox.test.mjs`.
The adapter test replaces import aliases and supplies a synthetic catalog and
mock fetch; it makes no provider requests. Full repository checks, checkout
payment, webhook/fulfillment, independent security review, and integration with
current main remain pending.
