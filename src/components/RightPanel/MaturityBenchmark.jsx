import { useApp } from '../../context/AppContext';
import { Activity } from 'react-feather';

export default function MaturityBenchmark() {
  const { state } = useApp();
  const { capabilities, maturityScores } = state;

  const l0Summary = capabilities.map(l0 => {
    let total = 0, count = 0;
    l0.l1.forEach(l1 => {
      l1.l2.forEach(l2 => {
        total += maturityScores[l2.id] || 1;
        count++;
      });
    });
    return { name: l0.name, avg: count > 0 ? total / count : 0 };
  });

  return (
    <div className="insight-section">
      <div className="insight-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} /> Maturity Overview
        </div>
      </div>
      <div className="bar-chart">
        {l0Summary.map((l0, i) => {
          const pct = (l0.avg / 5) * 100;
          const color = l0.avg < 2 ? 'var(--maturity-1)' : l0.avg < 3 ? 'var(--maturity-2)' : l0.avg < 4 ? 'var(--maturity-3)' : 'var(--maturity-4)';
          return (
            <div key={i} className="bar-row">
              <div className="bar-label">
                <span>{l0.name.length > 25 ? l0.name.slice(0, 25) + '…' : l0.name}</span>
                <span style={{ color, fontWeight: 600 }}>{l0.avg.toFixed(1)}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
                <div className="bar-benchmark" style={{ left: '60%' }} title="Industry Baseline (3.0)" />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ display: 'inline-block', width: 8, height: 2, background: 'var(--text-tertiary)' }} />
          Industry Baseline
        </span>
      </div>
    </div>
  );
}
