import React from 'react';
import InfoTip from './InfoTip';

const CARDS = [
  {
    label: 'Median Error',
    key: 'median',
    unit: 'pp',
    color: 'var(--blue)',
    format: (s) => s.median.toFixed(1),
    tip: (
      <>
        <strong>Median absolute matching-score error</strong>, in percentage points,
        across the currently-filtered fleet.
        <br /><br />
        Lower is better. "Absolute" means under- and over-credit are treated equally
        for this summary — the sign shows up in the distribution chart below.
      </>
    ),
  },
  {
    label: 'Overcredited',
    key: 'overcredited',
    unit: '%',
    color: 'var(--red)',
    format: (s) => s.pctOvercredited.toFixed(0),
    tip: (
      <>
        Share of farms where the <strong>modeled matching score exceeds actual</strong>.
        <br /><br />
        For granular certificate markets, overcrediting is the dangerous failure mode
        — it issues more hourly-matched credits than a buyer actually earned.
      </>
    ),
  },
  {
    label: 'Max Overcredit',
    key: 'maxOC',
    unit: 'pp',
    color: 'var(--yellow)',
    format: (s) => `+${s.maxOvercredit.toFixed(1)}`,
    tip: (
      <>
        The <strong>single most-overcredited farm</strong> under the current parameters.
        <br /><br />
        This is the worst-case buyer-side exposure: the model thinks a REC from
        this farm matches the load better than it actually does, by this many
        percentage points.
      </>
    ),
  },
  {
    label: 'Max Undercredit',
    key: 'maxUC',
    unit: 'pp',
    color: 'var(--green)',
    format: (s) => s.maxUndercredit.toFixed(1),
    tip: (
      <>
        The <strong>single most-undercredited farm</strong> — the model understates
        its matching score by this many pp.
        <br /><br />
        Undercrediting is conservative for a market: it never over-issues
        certificates, but it does penalize the generator.
      </>
    ),
  },
];

export default function SummaryCards({ stats }) {
  return (
    <div className="summary-row">
      {CARDS.map(c => (
        <div key={c.key} className="stat-card">
          <div className="label">
            {c.label}
            <InfoTip label={`About ${c.label}`}>{c.tip}</InfoTip>
          </div>
          <div className="value" style={{ color: c.color }}>
            {c.format(stats)}<span className="unit">{c.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
