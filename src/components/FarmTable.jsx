import React, { useState, useMemo } from 'react';

const COLUMNS = [
  { key: 'name', label: 'Farm Name', align: 'left' },
  { key: 'country', label: 'Country', align: 'left' },
  { key: 'type', label: 'Type', align: 'left' },
  { key: 'r', label: 'r', align: 'right' },
  { key: 'error', label: 'Error (pp)', align: 'right' },
];

export default function FarmTable({ farms, errors, selectedFarmId, onFarmClick }) {
  const [sortKey, setSortKey] = useState('error');
  const [sortDir, setSortDir] = useState('desc');

  const rows = useMemo(() => {
    if (!farms || !errors) return [];

    const mapped = farms.map((f, i) => ({
      ...f,
      error: errors[i],
    }));

    return mapped.sort((a, b) => {
      let cmp;
      if (sortKey === 'error') {
        cmp = Math.abs(b.error) - Math.abs(a.error);
      } else if (sortKey === 'r') {
        cmp = (b.r ?? 0) - (a.r ?? 0);
      } else {
        const aVal = a[sortKey] || '';
        const bVal = b[sortKey] || '';
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return sortDir === 'desc' ? cmp : -cmp;
    });
  }, [farms, errors, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'error' ? 'desc' : 'asc');
    }
  }

  return (
    <div className="card">
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 12 }}>
        Per-Farm Detail <span style={{ fontWeight: 400, color: 'var(--gray-500)' }}>— click a row to inspect</span>
      </div>
      <div className="farm-table-wrapper">
        <table className="farm-table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={sortKey === col.key ? `sorted ${sortDir}` : ''}
                  onClick={() => handleSort(col.key)}
                  style={{ textAlign: col.align }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.id}
                className={selectedFarmId === row.id ? 'selected' : ''}
                onClick={() => onFarmClick(row)}
              >
                <td>{row.name}</td>
                <td>{row.country}</td>
                <td>
                  <span className={`type-badge ${row.type}`}>
                    {row.type}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--gray-700)' }}>
                  {row.r != null ? row.r.toFixed(3) : '—'}
                </td>
                <td className={`error-cell ${row.error > 0 ? 'overcredit' : 'undercredit'}`}>
                  {row.error > 0 ? '+' : ''}{row.error.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
