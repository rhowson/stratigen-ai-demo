import { useApp } from '../context/AppContext';
import { AlertTriangle, ArrowRight, X } from 'react-feather';
import './SlideInPanel.css';

export default function SlideInPanel() {
  const { state, actions } = useApp();
  const { slidePanel, maturityScores, impactedCapabilities, painPoints, fixes, aiOpportunities, regulations } = state;

  if (!slidePanel) return null;

  const renderContent = () => {
    switch (slidePanel.type) {
      case 'capability': return renderCapability(slidePanel.data);
      case 'workpackage': return renderWorkPackage(slidePanel.data);
      case 'ai': return renderAI(slidePanel.data);
      default: return null;
    }
  };

  function renderCapability(cap) {
    const maturity = maturityScores[cap.l2Id] || 1;
    const cappedMaturity = Math.round(maturity);
    const pains = (impactedCapabilities[cap.l2Id] || []).map(ppId => painPoints.find(p => p.id === ppId)).filter(Boolean);
    const capFixes = fixes.filter(f => f.capabilityId === cap.l2Id);
    const capAI = aiOpportunities.filter(a => a.capabilityId === cap.l2Id);
    const capRegs = regulations.filter(r => r.capabilityId === cap.l2Id);

    return (
      <>
        <div className="slide-header">
          <h3>{cap.l2Name}</h3>
          <div className="slide-breadcrumb">{cap.l0Name} <ArrowRight size={10} style={{ margin: '0 4px' }} /> {cap.l1Name}</div>
        </div>

        <div className="slide-section">
          <div className="section-title">Impact Severity</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 16, height: 16, borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)',
              background: pains.length >= 5 ? '#9B1C1C' : pains.length >= 3 ? '#F8B4B4' : pains.length >= 1 ? '#E0F2FE' : '#FFFFFF'
            }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {pains.length >= 5 ? 'Critical' : pains.length >= 3 ? 'High' : pains.length >= 1 ? 'Moderate' : 'Neutral'}
            </span>
          </div>
        </div>

        {pains.length > 0 && (
          <div className="slide-section">
            <div className="section-title">Pain Points ({pains.length})</div>
            <div className="pain-list">
              {pains.map(p => (
                <div key={p.id} className="pain-item">
                  <span className="pain-icon"><AlertTriangle size={12} className="badge-warning" /></span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {capFixes.length > 0 && (
          <div className="slide-section">
            <div className="section-title">Fixes</div>
            {capFixes.map(fix => (
              <div key={fix.capabilityId} className="fix-detail">
                {Object.entries(fix.dimensions).map(([dim, items]) => (
                  <div key={dim} className="fix-dimension">
                    <div className="dim-label">{dim.charAt(0).toUpperCase() + dim.slice(1)}</div>
                    <ul className="dim-items">
                      {items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {capAI.length > 0 && (
          <div className="slide-section">
            <div className="section-title">AI Opportunities</div>
            {capAI.map(ai => (
              <div key={ai.capabilityId} className="ai-detail">
                {ai.levels.map(l => (
                  <div key={l.level} className="ai-level-item">
                    <span className={`chip chip-${l.level === 1 ? 'emerald' : l.level === 2 ? 'amber' : 'rose'}`}>
                      L{l.level} — {l.type}
                    </span>
                    <span className="ai-name">{l.name}</span>
                    <span className="ai-meta">Value: {l.value} · Complexity: {l.complexity}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {capRegs.length > 0 && (
          <div className="slide-section">
            <div className="section-title">Regulatory</div>
            {capRegs.map(reg => (
              <div key={reg.capabilityId} className="reg-detail">
                <div className={`risk-badge risk-${reg.riskClassification.toLowerCase()}`}>
                  {reg.riskClassification} Risk
                </div>
                <div className="reg-list">
                  {reg.regulations.map(r => (
                    <span key={r.id} className="chip">{r.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  function renderWorkPackage(pkg) {
    return (
      <>
        <div className="slide-header">
          <h3>{pkg.name}</h3>
          <div className="slide-breadcrumb">{pkg.l1Domain}</div>
        </div>
        <div className="slide-section">
          <div className="section-title">Scope</div>
          <div className="wp-stats">
            <div className="wp-stat">
              <span className="stat-value">{pkg.fixCount}</span>
              <span className="stat-label">Total Fixes</span>
            </div>
            <div className="wp-stat">
              <span className="stat-value">{pkg.impactScore}</span>
              <span className="stat-label">Impact Score</span>
            </div>
            <div className="wp-stat">
              <span className={`chip chip-${pkg.priority === 'High' ? 'rose' : pkg.priority === 'Medium' ? 'amber' : 'emerald'}`}>
                {pkg.priority}
              </span>
              <span className="stat-label">Priority</span>
            </div>
          </div>
        </div>
        <div className="slide-section">
          <div className="section-title">Capabilities</div>
          <div className="cap-tags">
            {pkg.capabilities.map((c, i) => <span key={i} className="chip">{c}</span>)}
          </div>
        </div>
        {pkg.dependencies.length > 0 && (
          <div className="slide-section">
            <div className="section-title">Dependencies</div>
            <div className="dep-list">
              {pkg.dependencies.map((d, i) => (
                <div key={i} className="dep-item"><ArrowRight size={10} style={{ marginRight: 6 }} /> {d}</div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  function renderAI(ai) {
    return (
      <>
        <div className="slide-header">
          <h3>{ai.capabilityName}</h3>
          <div className="slide-breadcrumb">{ai.l0Name} <ArrowRight size={10} style={{ margin: '0 4px' }} /> {ai.l1Name}</div>
        </div>
        <div className="slide-section">
          <div className="section-title">AI Acceleration Levels</div>
          {ai.levels.map(l => (
            <div key={l.level} className="ai-level-card glass-card">
              <div className="ai-level-header">
                <span className={`ai-level-badge level-${l.level}`}>Level {l.level}</span>
                <span className="ai-level-type">{l.type}</span>
              </div>
              <div className="ai-level-name">{l.name}</div>
              <div className="ai-level-metrics">
                <span>Value: <strong>{l.value}</strong></span>
                <span>Complexity: <strong>{l.complexity}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="slide-overlay" onClick={actions.closeSlidePanel} />
      <aside className="slide-panel">
        <button className="slide-close" onClick={actions.closeSlidePanel}>
          <X size={18} />
        </button>
        <div className="slide-content">
          {renderContent()}
        </div>
      </aside>
    </>
  );
}
