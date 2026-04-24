import React from 'react';
import InfoTip from './InfoTip';

const PRESETS = [
  {
    label: 'Conservative',
    vr: 15.0,
    exp: 2.0,
    tip: 'Vr = 15.0 m/s, n = 2.0. Biased toward under-credit: almost no farm is overcredited. Recommended for certificate-market defaults where over-issuance is the risk to avoid.',
  },
  {
    label: 'Optimized',
    vr: 13.5,
    exp: 1.75,
    tip: 'Vr = 13.5 m/s, n = 1.75. Accuracy-optimal across the fleet — lowest median absolute error — but ~45% of farms end up overcredited. Useful as a benchmark, not a policy default.',
  },
  {
    label: 'Cubic',
    vr: 13.5,
    exp: 3.0,
    tip: 'Vr = 13.5 m/s, n = 3.0. The "textbook" cubic wind-power law (P ∝ v³). Shown for comparison: real turbines behave more linearly below rated, so this over-penalizes low-wind hours.',
  },
];

export default function ParameterControls({ vr, exp, grid, onVrChange, onExpChange, activePreset, onPresetChange, disabled }) {
  if (!grid) return null;

  return (
    <div className={`card ${disabled ? 'controls-disabled' : ''}`}>
      <div className="controls-row">
        <div className="preset-group-wrap">
          <span className="preset-group-label">
            Presets
            <InfoTip label="About presets">
              Three candidate parameter sets from the underlying study.
              Click any preset to jump to its (Vr, n) values, then adjust with
              the sliders.
              <br /><br />
              {PRESETS.map(p => (
                <span key={p.label} style={{ display: 'block', marginTop: 6 }}>
                  <strong>{p.label}:</strong> {p.tip}
                </span>
              ))}
            </InfoTip>
          </span>
          <div className="preset-group">
            {PRESETS.map(p => (
              <button
                key={p.label}
                className={`preset-btn ${activePreset === p.label ? 'active' : ''}`}
                onClick={() => onPresetChange(p)}
                disabled={disabled}
                title={p.tip}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="slider-group">
        <div className="slider-control">
          <div className="slider-label">
            <span>
              Rated Wind Speed (Vr)
              <InfoTip label="About Vr">
                The wind speed at which the turbine reaches rated power.
                Below Vr, output follows the curve defined by exponent <em>n</em>;
                at or above Vr, output is clipped to 100% capacity until cut-out.
                <br /><br />
                <strong>Higher Vr</strong> → the model has to climb further to
                hit 100%, so more low-ish-wind hours stay below rated and the
                modeled capacity factor drops.
                <br /><br />
                Real turbines typically sit between 11–15 m/s depending on
                IEC wind class and hub height.
              </InfoTip>
            </span>
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
            <span>
              Curve Exponent (n)
              <InfoTip label="About exponent n">
                Shape of the power curve below rated:{' '}
                <strong>P(v) = (v / Vr)<sup>n</sup></strong> for v &lt; Vr.
                <br /><br />
                <strong>n = 3</strong> is the textbook cubic law (power of the wind).{' '}
                <strong>n ≈ 1.75</strong> is accuracy-optimal for the fleet — real
                turbines are more linear than cubic once drivetrain, control, and
                blade design are accounted for.{' '}
                <strong>n = 2</strong> is a conservative middle ground.
                <br /><br />
                Higher n makes the curve steeper near cut-in and flatter near Vr.
              </InfoTip>
            </span>
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
