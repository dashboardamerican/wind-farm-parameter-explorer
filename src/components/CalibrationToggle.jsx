import React from 'react';
import InfoTip from './InfoTip';

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
      <span className="calibration-label">
        Mode
        <InfoTip label="About calibration mode">
          <strong>Blind</strong> applies the same global (Vr, n) power curve to every
          farm — no farm-specific data used.
          <br /><br />
          <strong>N-month calibration</strong> instead refits (Vr, n) for each farm
          using N months of that farm's own metered data, then applies that
          calibrated curve to the held-out remainder of the year. More months
          generally means lower error, with diminishing returns past ~3 months.
          <br /><br />
          Sliders and presets are disabled in calibration mode because each
          farm gets its own fitted parameters.
        </InfoTip>
      </span>
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
