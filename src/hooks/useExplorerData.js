import { useState, useEffect, useCallback } from 'react';

/**
 * Load explorer-data.json and provide a lookup function
 * that snaps (vr, exp) to the nearest grid point.
 */
export function useExplorerData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/explorer-data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const lookup = useCallback((vr, exp, mode = 'raw') => {
    if (!data) return null;
    const { vr_step, exp_step, vr_min, vr_max, exp_min, exp_max } = data.grid;
    const source = mode === 'gwa' ? data.gwa?.results : data.results;
    if (!source) return null;

    // Snap to nearest grid point
    const snappedVr = Math.round(Math.min(Math.max(vr, vr_min), vr_max) / vr_step) * vr_step;
    const snappedExp = Math.round(Math.min(Math.max(exp, exp_min), exp_max) / exp_step) * exp_step;

    const key = `${snappedVr.toFixed(2)}_${snappedExp.toFixed(3)}`;
    return source[key] || null;
  }, [data]);

  const lookupCalibration = useCallback((nMonths) => {
    if (!data || !data.calibration) return null;
    return data.calibration[String(nMonths)] || null;
  }, [data]);

  const hasCalibration = !!(data && data.calibration);
  const hasGwa = !!(data && data.gwa && data.gwa.results);
  const gwaStrategy = data?.gwa?.strategy ?? null;
  const gwaCoverage = data?.gwa?.coverage ?? null;

  const getDetail = useCallback((farmId, mode = 'raw') => {
    if (!data || !farmId) return null;
    if (mode === 'gwa') {
      return data.gwa?.details?.[farmId] ?? null;
    }
    return data.details?.[farmId] ?? null;
  }, [data]);

  return {
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
  };
}
