import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';

function PowerCurveChart({ curve, modelLabel }) {
  if (!curve || curve.length === 0) return null;

  return (
    <div>
      <div className="detail-chart-title">Power Curve: Model vs Actual</div>
      <div className="detail-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" />
            <XAxis
              dataKey="ws"
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Wind speed (m/s)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#5F6368' }}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Capacity factor', angle: -90, position: 'insideLeft', offset: 4, fontSize: 12, fill: '#5F6368' }}
            />
            <Tooltip
              formatter={(value, name) => [value.toFixed(3), name === 'model' ? 'Model CF' : 'Actual CF']}
              labelFormatter={(ws) => `${ws} m/s`}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => value === 'model' ? modelLabel : 'Actual (metered)'}
            />
            <Line type="monotone" dataKey="model" stroke="#4285F4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="actual" stroke="#EA4335" strokeWidth={2} dot={{ r: 3, fill: '#EA4335' }} />
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
      <div className="detail-chart-title">Generation CDF: Shaped vs Actual</div>
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
              label={{ value: 'Capacity factor', angle: -90, position: 'insideLeft', offset: 4, fontSize: 12, fill: '#5F6368' }}
            />
            <Tooltip
              formatter={(value, name) => [value.toFixed(3), name === 'model' ? 'Shaped model' : 'Actual']}
              labelFormatter={(p) => `P${p}`}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => value === 'model' ? modelLabel : 'Actual metered'}
            />
            <Area type="monotone" dataKey="actual" stroke="#EA4335" fill="#EA4335" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="model" stroke="#4285F4" fill="#4285F4" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function FarmDetailPanel({ farm, detail, error, correctionMode, onClose }) {
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
        <PowerCurveChart curve={detail.curve} modelLabel={modelLabel} />
        <CdfChart
          pcts={detail.cdf_pcts}
          cdfActual={detail.cdf_actual}
          cdfModel={detail.cdf_model}
          modelLabel={correctionMode === 'gwa' ? 'Shaped GWA-corrected model' : 'Shaped model'}
        />
      </div>
    </div>
  );
}
