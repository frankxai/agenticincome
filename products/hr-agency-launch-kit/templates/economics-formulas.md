# Economics formulas

Use one currency, one period and comparable service units. The supplied scenarios use US dollars and one month. Taxes are not revenue in this model. The model is arithmetic for education; replace every assumption before commercial use.

Inputs:
- Client count, fee per client, refund fraction, fee-processing fraction.
- Variable tooling cost per client; fixed monthly tooling.
- Human hours per client; internal loaded hourly cost.
- Monthly available working hours; fraction reserved for delivery.
- Monthly acquisition cost; setup cost allocated to this month.

Formulas:
- Gross billed scenario = client count × fee.
- Refund allowance = gross × refund fraction.
- Processing allowance = gross × processing fraction. Charged on gross conservatively, even where refunds occur.
- Human hours = client count × human hours per client.
- Labor cost = human hours × loaded hourly cost.
- Contribution = gross − refunds − processing − variable tooling − fixed tooling − labor − acquisition − allocated setup.
- Unit contribution before fixed cost = fee × (1 − refund fraction − processing fraction) − variable tooling per client − human hours per client × loaded hourly cost.
- Break-even clients = ceiling((fixed tooling + acquisition + allocated setup) / unit contribution), only when unit contribution is positive.
- Delivery capacity = floor(available hours × delivery fraction / human hours per client), only when human hours per client is positive.
- Over capacity = modeled human hours exceeds available delivery hours.
- Contribution margin = contribution / gross, only when gross is positive.

A zero denominator is reported as unavailable, never infinity or a fabricated percentage. Negative contribution is preserved. Capacity is a time ceiling, not proof of demand.

The calculator includes two stresses: twice the review/service time and 50% more variable tooling cost. Neither is a forecast. Set refunds to zero only when that assumption is justified; do not remove acquisition, setup or human review to make the business look attractive.
