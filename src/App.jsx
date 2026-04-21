import React, { useState, useMemo, useEffect } from 'react';
import { useExplorerData } from './hooks/useExplorerData';
import { computeStats, buildHistogramBins } from './computeStats';
import ParameterControls from './components/ParameterControls';
import CalibrationToggle from './components/CalibrationToggle';
import CorrectionToggle from './components/CorrectionToggle';
import TypeToggle from './components/TypeToggle';
import SummaryCards from './components/SummaryCards';
import ErrorDistribution from './components/ErrorDistribution';
import CorrelationScatter from './components/CorrelationScatter';
import FarmTable from './components/FarmTable';
import FarmDetailPanel from './components/FarmDetailPanel';

const PRESETS = {
  Conservative: { vr: 15.0, exp: 2.0 },
  Optimized: { vr: 13.5, exp: 1.75 },
  Cubic: { vr: 12.0, exp: 3.0 },
};

export default function App() {
  const {
    data,
    loading,
    error,
    lookup,
    lookupCalibration,
    getDetail,
    hasCalibration,
    hasGwa,
    gwaStrategy,
    gwaCoverage,
  } = useExplorerData();
  const [vr, setVr] = useState(13.5);
  const [exp, setExp] = useState(1.75);
  const [terrainFilter, setTerrainFilter] = useState('all');
  const [activePreset, setActivePreset] = useState('Optimized');
  const [calMonths, setCalMonths] = useState(0);
  const [correctionMode, setCorrectionMode] = useState('raw');
  const [selectedFarm, setSelectedFarm] = useState(null);

  const isCalibrated = calMonths > 0;
  const effectiveCorrectionMode = isCalibrated ? 'raw' : correctionMode;

  useEffect(() => {
    if (isCalibrated && correctionMode !== 'raw') {
      setCorrectionMode('raw');
    }
  }, [isCalibrated, correctionMode]);

  // Get all errors: from grid lookup (blind) or calibration lookup
  const allErrors = useMemo(() => {
    if (isCalibrated) return lookupCalibration(calMonths);
    return lookup(vr, exp, effectiveCorrectionMode);
  }, [isCalibrated, calMonths, lookupCalibration, lookup, vr, exp, effectiveCorrectionMode]);

  // Filter farms + errors by terrain type (skip nulls from calibration)
  const { filteredFarms, filteredErrors } = useMemo(() => {
    if (!data || !allErrors) return { filteredFarms: [], filteredErrors: [] };

    const farms = [];
    const errors = [];
    data.farms.forEach((f, i) => {
      if (terrainFilter === 'all' || f.type === terrainFilter) {
        if (allErrors[i] != null) {
          farms.push(f);
          errors.push(allErrors[i]);
        }
      }
    });
    return { filteredFarms: farms, filteredErrors: errors };
  }, [data, allErrors, terrainFilter]);

  useEffect(() => {
    if (selectedFarm && !filteredFarms.some(f => f.id === selectedFarm.id)) {
      setSelectedFarm(null);
    }
  }, [filteredFarms, selectedFarm]);

  // Compute stats + histogram
  const stats = useMemo(() => computeStats(filteredErrors), [filteredErrors]);
  const bins = useMemo(() => buildHistogramBins(filteredErrors), [filteredErrors]);

  // Compute median of signed errors for reference line
  const medianSigned = useMemo(() => {
    if (!filteredErrors || filteredErrors.length === 0) return 0;
    const sorted = [...filteredErrors].sort((a, b) => a - b);
    const n = sorted.length;
    return n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  }, [filteredErrors]);

  // Type counts
  const counts = useMemo(() => {
    if (!data || !allErrors) return { all: 0, offshore: 0, onshore: 0 };
    const availableFarms = data.farms.filter((_, i) => allErrors[i] != null);
    return {
      all: availableFarms.length,
      offshore: availableFarms.filter(f => f.type === 'offshore').length,
      onshore: availableFarms.filter(f => f.type === 'onshore').length,
    };
  }, [data, allErrors]);

  const activeDetail = selectedFarm ? getDetail(selectedFarm.id, effectiveCorrectionMode) : null;

  function handlePreset(preset) {
    setActivePreset(preset.label);
    setVr(preset.vr);
    setExp(preset.exp);
  }

  function handleVrChange(v) {
    setVr(v);
    setActivePreset(null);
  }

  function handleExpChange(e) {
    setExp(e);
    setActivePreset(null);
  }

  if (loading) return <div className="app"><div className="loading">Loading explorer data...</div></div>;
  if (error) return <div className="app"><div className="loading">Error: {error}</div></div>;

  return (
    <div className="app">
      <div className="header">
        <h1>Wind Farm Parameter Explorer</h1>
        <div className="controls-row" style={{ marginBottom: 0 }}>
          <TypeToggle active={terrainFilter} counts={counts} onChange={setTerrainFilter} />
        </div>
      </div>

      <CalibrationToggle
        active={calMonths}
        onChange={setCalMonths}
        hasData={hasCalibration}
      />

      <CorrectionToggle
        active={correctionMode}
        onChange={setCorrectionMode}
        hasData={hasGwa}
        disabled={isCalibrated}
      />

      <ParameterControls
        vr={vr}
        exp={exp}
        grid={data.grid}
        onVrChange={handleVrChange}
        onExpChange={handleExpChange}
        activePreset={activePreset}
        onPresetChange={handlePreset}
        disabled={isCalibrated}
      />

      {hasGwa && effectiveCorrectionMode === 'gwa' && gwaStrategy && gwaCoverage && (
        <div className="card info-card">
          <div className="info-card-title">GWA Correction Mode</div>
          <div className="info-card-body">
            <strong>{gwaCoverage.n_farms} farms covered</strong> ({gwaCoverage.n_onshore} onshore, {gwaCoverage.n_offshore} offshore).
            {` ${gwaStrategy.description}`}
          </div>
        </div>
      )}

      {hasGwa && isCalibrated && (
        <div className="mode-note">
          GWA correction is only precomputed for blind mode. Calibration view uses the raw ERA5 explorer data.
        </div>
      )}

      {activePreset === 'Conservative' && terrainFilter === 'all' && (
        <div className="conservative-note">
          Conservative defaults: Vr=15.0 for offshore, Vr=14.5 for onshore. Showing Vr=15.0 for combined view.
        </div>
      )}

      <SummaryCards stats={stats} />

      <ErrorDistribution bins={bins} median={medianSigned} />

      <CorrelationScatter farms={filteredFarms} errors={filteredErrors} />

      {selectedFarm && activeDetail && (
        <FarmDetailPanel
          farm={selectedFarm}
          detail={activeDetail}
          error={selectedFarm.error}
          correctionMode={effectiveCorrectionMode}
          onClose={() => setSelectedFarm(null)}
        />
      )}

      <FarmTable
        farms={filteredFarms}
        errors={filteredErrors}
        selectedFarmId={selectedFarm?.id}
        onFarmClick={(row) => setSelectedFarm(selectedFarm?.id === row.id ? null : row)}
      />

      {data.excluded && data.excluded.length > 0 && (
        <div className="data-note">
          <strong>{data.excluded.length} farms excluded</strong> due to unreliable metered data
          (generation uncorrelated with peer farms in the same region).
          Meter data can sometimes reflect grid curtailment, dispatch constraints,
          or reporting errors rather than actual wind-driven output.
        </div>
      )}
    </div>
  );
}
