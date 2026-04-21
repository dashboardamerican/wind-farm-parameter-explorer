import React from 'react';

export default function SummaryCards({ stats }) {
  const cards = [
    { label: 'Median Error', value: stats.median.toFixed(1), unit: 'pp', color: 'var(--blue)' },
    { label: 'Overcredited', value: stats.pctOvercredited.toFixed(0), unit: '%', color: 'var(--red)' },
    { label: 'Max Overcredit', value: `+${stats.maxOvercredit.toFixed(1)}`, unit: 'pp', color: 'var(--yellow)' },
    { label: 'Max Undercredit', value: stats.maxUndercredit.toFixed(1), unit: 'pp', color: 'var(--green)' },
  ];

  return (
    <div className="summary-row">
      {cards.map(c => (
        <div key={c.label} className="stat-card">
          <div className="label">{c.label}</div>
          <div className="value" style={{ color: c.color }}>
            {c.value}<span className="unit">{c.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
