import React from 'react';

const OPTIONS = [
  { label: 'Blind', value: 0 },
  { label: '1 mo', value: 1 },
  { label: '2 mo', value: 2 },
  { label: '3 mo', value: 3 },
  { label: '5 mo', value: 5 },
  { label: '10 mo', value: 10 },
];

export default function CalibrationToggle({ active, onChange, hasData }) {
  if (!hasData) return null;

  return (
    <div className="calibration-toggle">
      <span className="calibration-label">Mode</span>
      <div className="calibration-pills">
        {OPTIONS.map(o => (
          <button
            key={o.value}
            className={`cal-pill ${active === o.value ? 'active' : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
