import React from 'react';

const OPTIONS = [
  { label: 'ERA5 raw', value: 'raw' },
  { label: 'GWA corrected', value: 'gwa' },
];

export default function CorrectionToggle({ active, onChange, hasData, disabled }) {
  if (!hasData) return null;

  return (
    <div className="calibration-toggle">
      <span className="calibration-label">Wind Climate</span>
      <div className={`calibration-pills ${disabled ? 'toggle-disabled' : ''}`}>
        {OPTIONS.map(o => (
          <button
            key={o.value}
            className={`cal-pill ${active === o.value ? 'active' : ''}`}
            onClick={() => onChange(o.value)}
            disabled={disabled}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
