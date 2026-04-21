import React from 'react';

const PRESETS = [
  { label: 'Conservative', vr: 15.0, exp: 2.0 },
  { label: 'Optimized', vr: 13.5, exp: 1.75 },
  { label: 'Cubic', vr: 13.5, exp: 3.0 },
];

export default function ParameterControls({ vr, exp, grid, onVrChange, onExpChange, activePreset, onPresetChange, disabled }) {
  if (!grid) return null;

  return (
    <div className={`card ${disabled ? 'controls-disabled' : ''}`}>
      <div className="controls-row">
        <div className="preset-group">
          {PRESETS.map(p => (
            <button
              key={p.label}
              className={`preset-btn ${activePreset === p.label ? 'active' : ''}`}
              onClick={() => onPresetChange(p)}
              disabled={disabled}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="slider-group">
        <div className="slider-control">
          <div className="slider-label">
            <span>Rated Wind Speed (Vr)</span>
            <span className="slider-value">{vr.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min={grid.vr_min}
            max={grid.vr_max}
            step={grid.vr_step}
            value={vr}
            onChange={e => onVrChange(parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>
        <div className="slider-control">
          <div className="slider-label">
            <span>Curve Exponent (n)</span>
            <span className="slider-value">{exp.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={grid.exp_min}
            max={grid.exp_max}
            step={grid.exp_step}
            value={exp}
            onChange={e => onExpChange(parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>
      </div>
      {disabled && (
        <div className="controls-disabled-note">
          Parameters are per-farm calibrated — sliders don't apply in calibration mode
        </div>
      )}
    </div>
  );
}
