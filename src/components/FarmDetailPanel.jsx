import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area, ReferenceLine,
} from 'recharts';
import InfoTip from './InfoTip';

const CUT_IN = 3.0;

function powerCurve(ws, vr, exp) {
  if (ws < CUT_IN) return 0;
  const frac = (ws - CUT_IN) / (vr - CUT_IN);
  if (frac <= 0) return 0;
  return Math.min(Math.pow(frac, exp), 1.0);
}

/**
 * Weighted percentiles of `values` with integer `weights`, at each of `pcts`.
 * Returns an array aligned with `pcts`. Uses the "lower value" rule — i.e.
 * returns the value whose cumulative weight first reaches the target fraction.
 */
function weightedPercentiles(values, weights, pcts) {
  const pairs = values.map((v, i) => [v, weights[i]]).sort((a, b) => a[0] - b[0]);
  const totalW = pairs.reduce((s, p) => s + p[1], 0);
  if (totalW === 0) return pcts.map(() => 0);

  const out = [];
  let cum = 0;
  let j = 0;
  for (const p of pcts) {
    const target = (p / 100) * totalW;
    while (j < pairs.length - 1 && cum + pairs[j][1] < target) {
      cum += pairs[j][1];
      j++;
    }
    out.push(pairs[j][0]);
  }
  return out;
}

function PowerCurveChart({ curveData, modelLabel }) {
  if (!curveData || curveData.length === 0) return null;

  return (
    <div>
      <div className="detail-chart-title">
        Power Curve: Model vs Actual
        <InfoTip label="About the power curve">
          The <strong>blue line</strong> is the chosen generic power curve
          evaluated at 0.5 m/s wind-speed bins. The <strong>red dots</strong>
          are the farm's empirical capacity factor in each wind-speed bin
          (metered MW ÷ nameplate, averaged over hours in that bin).
          <br /><br />
          A good fit means the dots sit on or near the line across the full
          wind range, especially the 6–12 m/s band where most energy is
          produced.
        </InfoTip>
      </div>
      <div className="detail-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curveData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" />
            <XAxis
              dataKey="ws"
              type="number"
              domain={[0, 25]}
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Wind speed (m/s)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#5F6368' }}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Capacity factor', angle: -90, position: 'insideLeft', offset: 4, fontSize: 12, fill: '#5F6368' }}
            />
            <Tooltip
              formatter={(value, name) => [value == null ? '—' : value.toFixed(3), name === 'model' ? 'Model CF' : 'Actual CF']}
              labelFormatter={(ws) => `${ws} m/s`}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={24}
              wrapperStyle={{ fontSize: 12, paddingBottom: 4 }}
              formatter={(value) => value === 'model' ? modelLabel : 'Actual (metered)'}
            />
            <Line type="monotone" dataKey="model" stroke="#4285F4" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="actual" stroke="#EA4335" strokeWidth={0} dot={{ r: 3, fill: '#EA4335' }} connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CdfChart({ pcts, cdfActual, cdfModel, modelLabel }) {
  if (!pcts || !cdfActual || !cdfModel) return null;

  const data = pcts.map((p, i) => ({
    pct: p,
    actual: cdfActual[i],
    model: cdfModel[i],
  }));

  return (
    <div>
      <div className="detail-chart-title">
        Generation Shape CDF: Model vs Actual
        <InfoTip label="About the CDF" align="right">
          Cumulative distribution of hourly generation over the year, sorted
          low to high. Both lines are divided by their own annual average, so
          the chart compares shape rather than total annual output.
          <br /><br />
          A value of <strong>1.0</strong> is an average generation hour. Values
          above 1.0 are above-average hours, not capacity factor above
          nameplate.
          <br /><br />
          Matching-score accuracy depends on the <strong>shape of this curve</strong>,
          not on timing. If the blue (model) and red (actual) lines trace the
          same path, the farm's REC will match a load nearly as well in the
          model as in reality — even if hour-by-hour timing differs.
        </InfoTip>
      </div>
      <div className="detail-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" />
            <XAxis
              dataKey="pct"
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Percentile', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#5F6368' }}
            />
            <YAxis
              domain={[0, 'auto']}
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Hourly generation / annual average', angle: -90, position: 'insideLeft', offset: 4, fontSize: 12, fill: '#5F6368' }}
            />
            <Tooltip
              formatter={(value, name) => [`${value.toFixed(2)}x avg`, name === 'model' ? 'Modeled shape' : 'Actual shape']}
              labelFormatter={(p) => `P${p}`}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={24}
              wrapperStyle={{ fontSize: 12, paddingBottom: 4 }}
              formatter={(value) => value === 'model' ? modelLabel : 'Actual shape'}
            />
            <ReferenceLine y={1} stroke="#9AA0A6" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="actual" stroke="#EA4335" fill="#EA4335" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="model" stroke="#4285F4" fill="#4285F4" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function FarmDetailPanel({ farm, detail, error, correctionMode, vr, exp, onClose }) {
  // Power-curve chart: one row per bin center; 'actual' is the empirical mean CF
  // in that bin (hidden when the bin has too few samples), 'model' is the
  // generic curve evaluated at the bin center with the user's current sliders.
  const curveData = useMemo(() => {
    if (!detail?.bins) return [];
    return detail.bins.map(b => ({
      ws: b.ws,
      actual: b.n >= 3 ? b.actual : null,
      model: powerCurve(b.ws, vr, exp),
    }));
  }, [detail, vr, exp]);

  const cdfActualNormalized = useMemo(() => {
    if (!detail?.cdf_actual || !detail?.mean_actual_cf) return null;
    return detail.cdf_actual.map(v => v / detail.mean_actual_cf);
  }, [detail]);

  // Shape CDF: divide the model curve by its own weighted annual average, then
  // take weighted percentiles. This compares distribution shape without
  // presenting annual-energy scaling as physical capacity factor.
  const cdfModel = useMemo(() => {
    if (!detail?.bins || !detail?.cdf_pcts) return null;
    const values = detail.bins.map(b => powerCurve(b.ws, vr, exp));
    const weights = detail.bins.map(b => b.n);
    const totalW = weights.reduce((s, w) => s + w, 0) || 1;
    const meanModel = values.reduce((s, v, i) => s + v * weights[i], 0) / totalW;
    const normalized = meanModel > 0 ? values.map(v => v / meanModel) : values.map(() => 0);
    return weightedPercentiles(normalized, weights, detail.cdf_pcts);
  }, [detail, vr, exp]);

  if (!farm || !detail) return null;

  const modelLabel = correctionMode === 'gwa' ? 'Model (GWA-corrected blind)' : 'Model (blind)';

  return (
    <div className="card farm-detail-panel">
      <div className="detail-header">
        <div>
          <div className="detail-farm-name">{farm.name}</div>
          <div className="detail-farm-meta">
            <span className={`type-badge ${farm.type}`}>{farm.type}</span>
            <span>{farm.country}</span>
            <span>{farm.capacity_mw} MW</span>
            <span>r = {farm.r != null ? farm.r.toFixed(3) : '—'}</span>
            {correctionMode === 'gwa' && farm.gwa_scale_factor != null && (
              <>
                <span>scale × {farm.gwa_scale_factor.toFixed(3)}</span>
                <span>GWA {farm.gwa_mean_ws100.toFixed(2)} / ERA5 hist {farm.era5_history_mean_ws100.toFixed(2)} m/s</span>
              </>
            )}
            <span className={error > 0 ? 'overcredit-text' : 'undercredit-text'}>
              Error: {error > 0 ? '+' : ''}{error.toFixed(2)}pp
            </span>
          </div>
        </div>
        <button className="detail-close" onClick={onClose}>&times;</button>
      </div>

      <div className="detail-charts-grid">
        <PowerCurveChart curveData={curveData} modelLabel={modelLabel} />
        <CdfChart
          pcts={detail.cdf_pcts}
          cdfActual={cdfActualNormalized}
          cdfModel={cdfModel}
          modelLabel={correctionMode === 'gwa' ? 'GWA-corrected model shape' : 'Modeled shape'}
        />
      </div>
    </div>
  );
}
