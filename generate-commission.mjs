#!/usr/bin/env node
// Generates sales-rep-commission-calculator.html from live DB values.

import fs from 'fs';

// ── Live DB values (queried from recruiting-baseline 2026-05-17) ──
const COMP = { y1_rate_bps: 2000, y2_rate_bps: 500, crosssell_y1_rate_bps: 1000, crosssell_stacks_on_subscription: false };
const PROJECTIONS = [
  { month_index:1,  new_logos:1, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:2,  new_logos:1, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:3,  new_logos:1, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:4,  new_logos:3, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:5,  new_logos:3, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:6,  new_logos:4, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:7,  new_logos:4, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:8,  new_logos:4, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:9,  new_logos:4, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:10, new_logos:4, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:11, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:12, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:13, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:14, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:15, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:16, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:17, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:18, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:19, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:20, new_logos:5, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:21, new_logos:6, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:22, new_logos:6, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:23, new_logos:6, new_arr_cents:1200000, new_install_cents:500000 },
  { month_index:24, new_logos:6, new_arr_cents:1200000, new_install_cents:500000 },
];

// ── Math (exact copy from commission-scorecards.js) ──
function applyRate(cents, bps) { return Math.round((cents * bps) / 10000); }
function monthlyArr(c) { return Math.floor(c / 12); }

function computeCashflow(projections, comp) {
  const N = 24;
  const rows = Array.from({length: N}, (_, i) => ({
    month_index: i+1,
    new_deals_projected: 0,
    install_commission_cents: 0,
    y1_sub_commission_cents: 0,
    y2_sub_commission_cents: 0,
    crosssell_commission_cents: 0,
    total_this_month_cents: 0,
    trailing_12_cents: 0,
    cumulative_cents: 0,
  }));

  for (const p of projections) {
    const n = p.month_index;
    if (n < 1 || n > N) continue;
    rows[n-1].new_deals_projected += p.new_logos;
    if (!p.new_logos) continue;
    const monthlySub    = monthlyArr(p.new_arr_cents);
    const installPerLogo   = applyRate(p.new_install_cents, comp.y1_rate_bps);
    const y1MonthlyPerLogo = applyRate(monthlySub, comp.y1_rate_bps);
    const y2MonthlyPerLogo = applyRate(monthlySub, comp.y2_rate_bps);
    rows[n-1].install_commission_cents += installPerLogo * p.new_logos;
    for (let off=0; off<12; off++) { if (n+off<=N) rows[n+off-1].y1_sub_commission_cents += y1MonthlyPerLogo * p.new_logos; }
    for (let off=12; off<24; off++) { if (n+off<=N) rows[n+off-1].y2_sub_commission_cents += y2MonthlyPerLogo * p.new_logos; }
  }

  let cumul = 0;
  for (const r of rows) {
    r.total_this_month_cents = r.install_commission_cents + r.y1_sub_commission_cents + r.y2_sub_commission_cents;
    cumul += r.total_this_month_cents;
    r.cumulative_cents = cumul;
  }
  for (let i=0; i<N; i++) {
    let s = 0;
    for (let j=Math.max(0,i-11); j<=i; j++) s += rows[j].total_this_month_cents;
    rows[i].trailing_12_cents = s;
  }
  return rows;
}

function fmtMoney(cents) {
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${Math.floor(Math.abs(cents)/100).toLocaleString('en-US')}`;
}
function bpsToPct(bps) { return (bps/100).toFixed(bps%100===0?0:2); }

const cashflow = computeCashflow(PROJECTIONS, COMP);
const lastRow  = cashflow[23];
const y1Total  = cashflow[11].cumulative_cents;
const y2Total  = lastRow.cumulative_cents - y1Total;
const YEAR_BOUNDARY = new Set([12, 24]);

const CSS = `
:root{--cerulean:#0693e3;--teal:#2DB68D;--dark-blue:#1a6fa8;--ink:#111111;--white:#ffffff;--surface:#f0f2f5;--border:#e2e8f0;--text-muted:#6b7280;--shadow:0 1px 4px rgba(0,0,0,0.07);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);line-height:1.5;background:var(--surface);-webkit-font-smoothing:antialiased;}
h1,h2{font-family:'Urbanist',sans-serif;}
.commission-present{min-height:100vh;background:var(--surface);padding:2.5rem 1.25rem 4rem;}
.commission-present-inner{max-width:920px;margin:0 auto;}
.commission-present-eyebrow{text-transform:uppercase;font-size:.78rem;letter-spacing:.08em;color:var(--cerulean);font-weight:700;margin-bottom:.4rem;}
.page-title{font-family:'Urbanist',sans-serif;font-size:2rem;font-weight:800;color:var(--ink);letter-spacing:-.02em;margin:.25rem 0 .5rem;}
.page-subtitle{color:var(--text-muted);font-size:.95rem;margin-bottom:1.5rem;}
.commission-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.75rem 0 2rem;}
.commission-summary-tile{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.25rem;box-shadow:var(--shadow);}
.commission-summary-tile-emphasis{background:var(--cerulean);border-color:var(--cerulean);}
.commission-summary-tile-emphasis .commission-summary-label,.commission-summary-tile-emphasis .commission-summary-help{color:rgba(255,255,255,.85);}
.commission-summary-tile-emphasis .commission-summary-amount{color:var(--white);}
.commission-summary-label{text-transform:uppercase;font-size:.72rem;font-weight:600;letter-spacing:.05em;color:var(--text-muted);margin-bottom:.3rem;}
.commission-summary-amount{font-family:'Urbanist',sans-serif;font-size:1.85rem;font-weight:800;color:var(--ink);line-height:1.1;}
.commission-summary-help{color:var(--text-muted);font-size:.82rem;margin-top:.2rem;}
.commission-comp-summary{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.4rem;margin-bottom:1.5rem;box-shadow:var(--shadow);}
.commission-comp-summary-title{font-family:'Urbanist',sans-serif;font-weight:700;color:var(--ink);margin-bottom:.6rem;}
.commission-comp-summary-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.45rem;}
.commission-comp-summary-list li{padding-left:1.1rem;position:relative;color:var(--ink);}
.commission-comp-summary-list li::before{content:'•';color:var(--cerulean);position:absolute;left:0;font-weight:700;}
.commission-table-section{margin-top:1.25rem;}
.commission-section-title{font-family:'Urbanist',sans-serif;font-size:1.15rem;font-weight:700;color:var(--ink);margin:0 0 .75rem;}
.commission-table-wrap{overflow-x:auto;}
.commission-table{width:100%;border-collapse:separate;border-spacing:0;font-variant-numeric:tabular-nums;}
.commission-table thead th{color:var(--white);font-family:'Urbanist',sans-serif;font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:.75rem 1rem;text-align:center;border:none;}
.commission-table tbody td{padding:.65rem .85rem;border:none;font-size:.95rem;vertical-align:middle;text-align:center;}
.commission-group-blue{background:var(--cerulean);}
.commission-group-green{background:var(--teal);}
.commission-group-left{border-top-left-radius:10px;}
.commission-group-right{border-top-right-radius:10px;}
.commission-group-spacer{width:18px;min-width:18px;background:transparent!important;border:none!important;padding:0!important;}
.commission-table.commission-table-grouped.commission-table-present tbody tr:nth-child(even) td:not(.commission-group-spacer){background:rgba(0,0,0,.025);}
.commission-table.commission-table-grouped tbody tr.commission-row-year-boundary td:not(.commission-group-spacer){background:rgba(45,182,141,.12)!important;}
.commission-table.commission-table-grouped tbody tr.commission-row-year-boundary .commission-cell-cumulative,
.commission-table.commission-table-grouped tbody tr.commission-row-year-boundary .commission-month-label{color:var(--teal);font-weight:800;}
.commission-cell-month{white-space:nowrap;font-weight:600;}
.commission-month-label{display:inline-block;}
.commission-cell-input-readonly{font-weight:600;}
.commission-cell-derived{color:var(--text-muted);}
.commission-cell-total{font-weight:700;color:var(--ink);}
.commission-cell-trailing{font-weight:600;color:var(--teal);}
.commission-cell-cumulative{font-weight:600;color:var(--dark-blue);}
.commission-present-footer{margin-top:2rem;text-align:center;color:var(--text-muted);font-size:.85rem;}
@media(max-width:720px){.commission-summary{grid-template-columns:1fr;}}
`;

const rows = cashflow.map(row => {
  const isBoundary = YEAR_BOUNDARY.has(row.month_index);
  const installCents   = row.install_commission_cents;
  const recurringCents = row.y1_sub_commission_cents + row.y2_sub_commission_cents + row.crosssell_commission_cents;
  const monthlyCents   = installCents + recurringCents;
  return `
    <tr${isBoundary ? ' class="commission-row-year-boundary"' : ''}>
      <td class="commission-cell-month"><span class="commission-month-label">Month ${row.month_index}</span></td>
      <td class="commission-cell-input-readonly">${row.new_deals_projected}</td>
      <td class="commission-group-spacer" aria-hidden="true"></td>
      <td class="commission-cell-derived">${fmtMoney(installCents)}</td>
      <td class="commission-cell-derived">${fmtMoney(recurringCents)}</td>
      <td class="commission-cell-total">${fmtMoney(monthlyCents)}</td>
      <td class="commission-cell-trailing">${fmtMoney(row.trailing_12_cents)}</td>
      <td class="commission-cell-cumulative">${fmtMoney(row.cumulative_cents)}</td>
    </tr>`;
}).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sales Rep Commission Calculator | Built2Buy</title>
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<main class="commission-present">
  <div class="commission-present-inner">
    <div class="commission-present-eyebrow">Built2Buy · Sales Rep Commission</div>
    <h1 class="page-title">Sales Rep Commission Calculator</h1>
    <p class="page-subtitle">24-month commission projection — recruiting baseline.</p>

    <section class="commission-summary">
      <div class="commission-summary-tile">
        <div class="commission-summary-label">Year 1 total</div>
        <div class="commission-summary-amount">${fmtMoney(y1Total)}</div>
        <div class="commission-summary-help">First 12 months</div>
      </div>
      <div class="commission-summary-tile">
        <div class="commission-summary-label">Year 2 total</div>
        <div class="commission-summary-amount">${fmtMoney(y2Total)}</div>
        <div class="commission-summary-help">Months 13–24</div>
      </div>
      <div class="commission-summary-tile commission-summary-tile-emphasis">
        <div class="commission-summary-label">24-month total</div>
        <div class="commission-summary-amount">${fmtMoney(lastRow.cumulative_cents)}</div>
        <div class="commission-summary-help">Cumulative</div>
      </div>
    </section>

    <section class="commission-comp-summary">
      <div class="commission-comp-summary-title">Compensation structure</div>
      <ul class="commission-comp-summary-list">
        <li><strong>${bpsToPct(COMP.y1_rate_bps)}%</strong> of subscription + installation revenue, year 1 of each new customer</li>
        <li><strong>${bpsToPct(COMP.y2_rate_bps)}%</strong> of subscription revenue, year 2 (renewal)</li>
        <li><strong>${bpsToPct(COMP.crosssell_y1_rate_bps)}%</strong> on additional contracts the same customer signs within their first year</li>
      </ul>
    </section>

    <section class="commission-table-section">
      <h2 class="commission-section-title">24-month projection</h2>
      <div class="commission-table-wrap">
        <table class="commission-table commission-table-grouped commission-table-present">
          <thead>
            <tr>
              <th class="commission-group-blue commission-group-left">Month</th>
              <th class="commission-group-blue commission-group-right">New deals</th>
              <th class="commission-group-spacer" aria-hidden="true"></th>
              <th class="commission-group-green commission-group-left">Install commissions</th>
              <th class="commission-group-green">Recurring commission</th>
              <th class="commission-group-green">Monthly commission</th>
              <th class="commission-group-green">Trailing 12 months</th>
              <th class="commission-group-green commission-group-right">Cumulative</th>
            </tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>
    </section>

    <footer class="commission-present-footer">
      Built2Buy · built2buy.com
    </footer>
  </div>
</main>
</body>
</html>`;

fs.writeFileSync('sales-rep-commission-calculator.html', html);
console.log('Done.');
console.log(`Y1: ${fmtMoney(y1Total)}  Y2: ${fmtMoney(y2Total)}  24mo: ${fmtMoney(lastRow.cumulative_cents)}`);
