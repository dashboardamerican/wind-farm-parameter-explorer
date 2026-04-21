/**
 * Compute summary statistics from an array of signed errors (in pp).
 */

export function computeStats(errors) {
  if (!errors || errors.length === 0) {
    return { median: 0, pctOvercredited: 0, maxOvercredit: 0, maxUndercredit: 0 };
  }

  const sorted = [...errors].sort((a, b) => a - b);
  const n = sorted.length;

  // Median of absolute errors
  const absErrors = errors.map(Math.abs).sort((a, b) => a - b);
  const median = n % 2 === 1
    ? absErrors[Math.floor(n / 2)]
    : (absErrors[n / 2 - 1] + absErrors[n / 2]) / 2;

  const overcredited = errors.filter(e => e > 0).length;
  const pctOvercredited = (overcredited / n) * 100;

  const maxOvercredit = Math.max(...errors);
  const maxUndercredit = Math.min(...errors);

  return {
    median: Math.round(median * 100) / 100,
    pctOvercredited: Math.round(pctOvercredited * 10) / 10,
    maxOvercredit: Math.round(maxOvercredit * 100) / 100,
    maxUndercredit: Math.round(maxUndercredit * 100) / 100,
  };
}

/**
 * Build histogram bins from signed errors.
 * Bin width = 1 pp, centered on integers.
 */
export function buildHistogramBins(errors) {
  if (!errors || errors.length === 0) return [];

  const min = Math.floor(Math.min(...errors)) - 1;
  const max = Math.ceil(Math.max(...errors)) + 1;

  const bins = [];
  for (let i = min; i <= max; i++) {
    bins.push({ x: i, count: 0 });
  }

  for (const e of errors) {
    const idx = Math.round(e) - min;
    if (idx >= 0 && idx < bins.length) {
      bins[idx].count++;
    }
  }

  return bins;
}
