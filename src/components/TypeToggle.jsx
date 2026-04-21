import React from 'react';

const TYPES = [
  { key: 'all', label: 'All' },
  { key: 'offshore', label: 'Offshore' },
  { key: 'onshore', label: 'Onshore' },
];

export default function TypeToggle({ active, counts, onChange }) {
  return (
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
  );
}
