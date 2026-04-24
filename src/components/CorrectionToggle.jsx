import React from 'react';
import InfoTip from './InfoTip';

const OPTIONS = [
  { label: 'ERA5 raw', value: 'raw' },
  { label: 'GWA corrected', value: 'gwa' },
];

export default function CorrectionToggle({ active, onChange, hasData, disabled }) {
  if (!hasData) return null;

  return (
    <div className="calibration-toggle">
      <span className="calibration-label">
        Wind Climate
        <InfoTip label="About wind climate correction">
          <strong>ERA5 raw</strong> uses the reanalysis wind speed as-is.
          <br /><br />
          <strong>GWA corrected</strong> rescales ERA5's year-specific winds toward
          the long-term local mean from the <em>Global Wind Atlas</em>, which is a
          10 km microscale downscaling. This helps in places where ERA5's coarser
          grid smooths over terrain features (hills, coastlines) that change the
          actual wind climate a turbine sees.
          <br /><br />
          Correction applies per-farm and is only available in blind mode.
        </InfoTip>
      </span>
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
