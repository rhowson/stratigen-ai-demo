import { useApp } from '../../context/AppContext';
import { Shield } from 'react-feather';

export default function RiskIndicators() {
  const { state } = useApp();
  const { regulations } = state;

  if (regulations.length === 0) return null;

  const riskCounts = { Critical: 0, High: 0, Moderate: 0, Low: 0 };
  regulations.forEach(r => {
    riskCounts[r.riskClassification] = (riskCounts[r.riskClassification] || 0) + 1;
  });

  const riskColors = {
    Critical: 'var(--maturity-1)',
    High: 'var(--accent-rose)',
    Moderate: 'var(--accent-amber)',
    Low: 'var(--accent-emerald)',
  };

  return (
    <div className="insight-section animate-fade-in">
      <div className="insight-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} /> Risk Indicators
        </div>
        <span className="insight-count">{regulations.length}</span>
      </div>

      <div className="summary-grid" style={{ marginBottom: 'var(--space-md)' }}>
        {Object.entries(riskCounts).map(([level, count]) => (
          <div key={level} className="summary-card">
            <div className="summary-value" style={{ color: riskColors[level] }}>{count}</div>
            <div className="summary-label">{level}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {regulations.map((reg, i) => (
          <div key={i} className="insight-card" style={{ cursor: 'default' }}>
            <div className="insight-card-header">
              <span className="insight-card-title">{reg.capabilityName}</span>
              <span
                className={`chip ${
                  reg.riskClassification === 'Critical' ? 'chip-rose' :
                  reg.riskClassification === 'High' ? 'chip-rose' :
                  reg.riskClassification === 'Moderate' ? 'chip-amber' : 'chip-emerald'
                }`}
                style={{ fontSize: '9px' }}
              >
                {reg.riskClassification}
              </span>
            </div>
            <div className="insight-card-chips">
              {reg.regulations.map((r, j) => (
                <span key={j} className="chip" style={{ fontSize: '9px' }}>{r.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
