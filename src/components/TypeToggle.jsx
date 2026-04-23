import React from 'react';
import InfoTip from './InfoTip';

const TYPES = [
  { key: 'all', label: 'All' },
  { key: 'offshore', label: 'Offshore' },
  { key: 'onshore', label: 'Onshore' },
];

export default function TypeToggle({ active, counts, onChange }) {
  return (
    <div className="type-toggle-wrap">
      <div className="type-toggle">
        {TYPES.map(t => (
          <button
            key={t.key}
            className={`type-btn ${active === t.key ? 'active' : ''}`}
            onClick={() => onChange(t.key)}
          >
            {t.label} ({counts[t.key] || 0})
          </button>
        ))}
      </div>
      <InfoTip label="About fleet filter" align="right">
        Filters the fleet by turbine environment. <strong>Offshore</strong> farms
        see smoother, stronger wind — cleaner ERA5 fit, lower typical error.
        <strong> Onshore</strong> farms sit in complex terrain where ERA5's
        ~28 km grid cells smooth over hills and forests, so errors are
        larger and more variable.
      </InfoTip>
    </div>
  );
}
