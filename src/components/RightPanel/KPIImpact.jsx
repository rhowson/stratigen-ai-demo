import { useApp, kpiLibrary } from '../../context/AppContext';
import { TrendingUp } from 'react-feather';
import InsightSection from './InsightSection';

export default function KPIImpact() {
  const { state } = useApp();
  const { fixes } = state;

  if (fixes.length === 0) return null;

  const impactedKPIs = kpiLibrary.map(kpi => {
    const relatedFixes = fixes.filter(f =>
      kpi.capabilityIds.some(capId =>
        f.capabilityId === capId || f.l1Name?.toLowerCase().includes(capId.replace(/-/g, ' '))
      )
    );
    const impact = relatedFixes.length;
    return { ...kpi, impact, improvementPct: Math.min(impact * 12, 60) };
  }).filter(k => k.impact > 0).sort((a, b) => b.impact - a.impact);

  if (impactedKPIs.length === 0) return null;

  return (
    <InsightSection
      title="KPI Impact"
      icon={<TrendingUp size={14} />}
      count={impactedKPIs.length}
      defaultOpen={false}
    >
      <div className="bar-chart">
        {impactedKPIs.slice(0, 8).map((kpi, i) => (
          <div key={i} className="bar-row">
            <div className="bar-label">
              <span>{kpi.name}</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>+{kpi.improvementPct}%</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${kpi.improvementPct}%`, background: 'var(--accent-emerald)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </InsightSection>
  );
}
