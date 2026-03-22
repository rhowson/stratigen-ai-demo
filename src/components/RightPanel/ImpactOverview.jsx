import { useApp } from '../../context/AppContext';
import { Activity } from 'react-feather';

export default function ImpactOverview() {
  const { state } = useApp();
  const { capabilities, impactedCapabilities } = state;

  const l0Summary = capabilities.map(l0 => {
    let totalPains = 0;
    l0.l1.forEach(l1 => {
      l1.l2.forEach(l2 => {
        const pCount = (impactedCapabilities[l2.id] || []).length;
        totalPains += pCount;
      });
    });
    return { name: l0.name, pains: totalPains };
  });

  // Sort by highest pain
  l0Summary.sort((a, b) => b.pains - a.pains);

  // Find max for scaling relative to highest impact
  const maxPains = Math.max(...l0Summary.map(l => l.pains), 1);
  const hasImpacts = l0Summary.some(l => l.pains > 0);

  return (
    <div className="insight-section">
      <div className="insight-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} /> Process Impact Analysis
        </div>
      </div>
      <div className="bar-chart">
        {!hasImpacts ? (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', padding: 'var(--space-md) 0' }}>
            No processes currently impacted. Map pain points to begin analysis.
          </div>
        ) : l0Summary.map((l0, i) => {
          if (l0.pains === 0) return null;
          const pct = (l0.pains / maxPains) * 100;
          // Heatmap scaling for L0 aggregates 
          const color = l0.pains >= 10 ? '#9B1C1C' : l0.pains >= 4 ? '#F8B4B4' : '#E0F2FE';
          
          return (
            <div key={i} className="bar-row">
              <div className="bar-label">
                <span>{l0.name.length > 25 ? l0.name.slice(0, 25) + '…' : l0.name}</span>
                <span style={{ fontWeight: 600 }}>{l0.pains}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
