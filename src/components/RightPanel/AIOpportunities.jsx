import { useApp } from '../../context/AppContext';
import { Cpu } from 'react-feather';
import InsightSection from './InsightSection';

export default function AIOpportunities() {
  const { state, actions } = useApp();
  const { aiOpportunities } = state;

  if (aiOpportunities.length === 0) return null;

  const totalLevel1 = aiOpportunities.filter(a => a.levels.some(l => l.level === 1)).length;
  const totalLevel2 = aiOpportunities.filter(a => a.levels.some(l => l.level === 2)).length;
  const totalLevel3 = aiOpportunities.filter(a => a.levels.some(l => l.level === 3)).length;

  return (
    <InsightSection
      title="AI Opportunities"
      icon={<Cpu size={14} />}
      count={aiOpportunities.length}
      defaultOpen={true}
    >
      <div className="summary-grid" style={{ marginBottom: 'var(--space-md)' }}>
        <div className="summary-card">
          <div className="summary-value" style={{ color: 'var(--accent-emerald)' }}>{totalLevel1}</div>
          <div className="summary-label">Prompts</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: 'var(--accent-amber)' }}>{totalLevel2}</div>
          <div className="summary-label">Workflows</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: 'var(--accent-rose)' }}>{totalLevel3}</div>
          <div className="summary-label">Agents</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {aiOpportunities.slice(0, 6).map((opp, i) => (
          <div
            key={i}
            className="insight-card"
            onClick={() => actions.openSlidePanel('ai', opp)}
          >
            <div className="insight-card-header">
              <span className="insight-card-title">{opp.capabilityName}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                {opp.estimatedImpact ? `Impact: ${opp.estimatedImpact}` : `AI Value: ${opp.maturityGap}`}
              </span>
            </div>
            <div className="insight-card-chips">
              {opp.levels.map(l => (
                <span
                  key={l.level}
                  className={`chip ${l.level === 1 ? 'chip-emerald' : l.level === 2 ? 'chip-amber' : 'chip-rose'}`}
                  style={{ fontSize: '9px' }}
                >
                  L{l.level} {l.type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </InsightSection>
  );
}
