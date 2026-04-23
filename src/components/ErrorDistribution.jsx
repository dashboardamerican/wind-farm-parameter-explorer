import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import InfoTip from './InfoTip';

export default function ErrorDistribution({ bins, median }) {
  if (!bins || bins.length === 0) return null;

  return (
    <div className="card">
      <div className="chart-title-row">
        <span className="chart-title">Signed Error Distribution</span>
        <InfoTip label="About this chart">
          One bar per farm-bin. X-axis is the <strong>signed matching-score
          error in pp</strong> (model − actual); Y-axis is the number of farms
          landing in that 1-pp bin.
          <br /><br />
          <strong>Red bars (≥ 0)</strong> = overcredited; <strong>green bars (&lt; 0)</strong>
          = undercredited. The dashed blue line marks the fleet median.
          <br /><br />
          A good parameter set has a tall, narrow distribution centered on zero.
          A distribution leaning right means systematic overcredit — risky for
          certificate markets.
        </InfoTip>
      </div>
      <div className="histogram-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
            <XAxis
              dataKey="x"
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Signed error (pp)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#5F6368' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#5F6368' }}
              label={{ value: 'Farms', angle: -90, position: 'insideLeft', offset: 4, fontSize: 12, fill: '#5F6368' }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [`${value} farms`, 'Count']}
              labelFormatter={(label) => `${label} pp`}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
            />
            <ReferenceLine x={0} stroke="#202124" strokeWidth={2} />
            <ReferenceLine
              x={median}
              stroke="#4285F4"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              label={{ value: `median ${median.toFixed(1)}`, position: 'top', fontSize: 11, fill: '#4285F4' }}
            />
            <Bar dataKey="count" isAnimationActive={false} radius={[2, 2, 0, 0]}>
              {bins.map((entry, i) => (
                <Cell key={i} fill={entry.x >= 0 ? '#EA4335' : '#34A853'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
