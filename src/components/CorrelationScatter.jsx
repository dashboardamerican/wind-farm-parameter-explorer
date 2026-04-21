import React, { useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, ZAxis,
} from 'recharts';

const DOT_COLORS = { offshore: '#4285F4', onshore: '#34A853' };

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'white', border: '1px solid #DADCE0', borderRadius: 6,
      padding: '8px 12px', fontSize: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: '#5F6368' }}>
        Temporal r: <strong>{d.r.toFixed(3)}</strong>
      </div>
      <div style={{ color: '#5F6368' }}>
        Error: <strong>{d.error > 0 ? '+' : ''}{d.error.toFixed(1)}pp</strong>
      </div>
      <div style={{ color: '#5F6368', marginTop: 2 }}>
        {d.type} &middot; {d.country}
      </div>
    </div>
  );
}

export default function CorrelationScatter({ farms, errors }) {
  const { offshoreData, onshoreData, rCorr } = useMemo(() => {
    if (!farms || !errors) {
      return { offshoreData: [], onshoreData: [], rCorr: null };
    }

    const offshore = [];
    const onshore = [];
    const rs = [];
    const es = [];

    farms.forEach((f, i) => {
      if (f.r == null || errors[i] == null) return;
      const pt = {
        r: f.r,
        error: errors[i],
        name: f.name,
        type: f.type,
        country: f.country,
      };
      rs.push(f.r);
      es.push(errors[i]);
      if (f.type === 'offshore') offshore.push(pt);
      else onshore.push(pt);
    });

    // Pearson r between temporal-r and matching score error
    let corr = null;
    if (rs.length >= 3) {
      const n = rs.length;
      const mr = rs.reduce((a, b) => a + b, 0) / n;
      const me = es.reduce((a, b) => a + b, 0) / n;
      let num = 0, dr2 = 0, de2 = 0;
      for (let i = 0; i < n; i++) {
        const dr = rs[i] - mr;
        const de = es[i] - me;
        num += dr * de;
        dr2 += dr * dr;
        de2 += de * de;
      }
      const denom = Math.sqrt(dr2 * de2);
      corr = denom > 0 ? num / denom : null;
    }

    return { offshoreData: offshore, onshoreData: onshore, rCorr: corr };
  }, [farms, errors]);

  if (!farms || farms.length === 0) return null;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)' }}>
          Temporal Correlation vs Matching Score Error
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
          r(correlation, error) = {rCorr != null ? rCorr.toFixed(2) : '—'}
        </div>
      </div>
      <div className="histogram-container">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" />
            <XAxis
              type="number"
              dataKey="r"
              domain={[0, 1]}
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Temporal correlation (r)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#5F6368' }}
            />
            <YAxis
              type="number"
              dataKey="error"
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Signed error (pp)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 12, fill: '#5F6368' }}
            />
            <ZAxis range={[48, 48]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#DADCE0" strokeWidth={1} />
            {offshoreData.length > 0 && (
              <Scatter name="Offshore" data={offshoreData} fill={DOT_COLORS.offshore} fillOpacity={0.7} />
            )}
            {onshoreData.length > 0 && (
              <Scatter name="Onshore" data={onshoreData} fill={DOT_COLORS.onshore} fillOpacity={0.7} />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
