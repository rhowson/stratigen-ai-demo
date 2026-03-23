import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, ChevronRight, ChevronDown } from 'react-feather';

const LEVEL_LABELS = { 1: 'Prompts', 2: 'Workflows', 3: 'Agents' };
const LEVEL_COLORS = { 1: '#059669', 2: '#D97706', 3: '#DC2626' };
const LEVEL_BG    = { 1: '#ECFDF5', 2: '#FEF3C7', 3: '#FEF2F2' };

export default function AIUseCaseView() {
  const { state, actions } = useApp();
  const { aiOpportunities } = state;
  const [expandedId, setExpandedId] = useState(null);

  if (!aiOpportunities.length) {
    return (
      <div className="view-empty">
        <Cpu size={36} className="view-empty-icon" />
        <h3>No AI Use Cases Yet</h3>
        <p>Toggle the AI Layer and generate fixes to surface AI opportunities.</p>
      </div>
    );
  }

  const totalLevel1 = aiOpportunities.filter(a => a.levels.some(l => l.level === 1)).length;
  const totalLevel2 = aiOpportunities.filter(a => a.levels.some(l => l.level === 2)).length;
  const totalLevel3 = aiOpportunities.filter(a => a.levels.some(l => l.level === 3)).length;

  return (
    <div className="ai-view">
      {/* Summary bar */}
      <div className="wp-summary-bar">
        <div className="wp-summary-stat">
          <span className="wp-stat-value" style={{ color: '#059669' }}>{totalLevel1}</span>
          <span className="wp-stat-label">Prompt Use Cases</span>
        </div>
        <div className="wp-summary-stat">
          <span className="wp-stat-value" style={{ color: '#D97706' }}>{totalLevel2}</span>
          <span className="wp-stat-label">Workflow Automation</span>
        </div>
        <div className="wp-summary-stat">
          <span className="wp-stat-value" style={{ color: '#DC2626' }}>{totalLevel3}</span>
          <span className="wp-stat-label">Agentic Use Cases</span>
        </div>
        <div className="wp-summary-stat">
          <span className="wp-stat-value">{aiOpportunities.length}</span>
          <span className="wp-stat-label">Total Capabilities</span>
        </div>
      </div>

      {/* Use case grid */}
      <div className="ai-grid">
        {aiOpportunities.map((opp, i) => {
          const isExpanded = expandedId === i;
          return (
            <div key={i} className={`ai-card ${isExpanded ? 'ai-card-expanded' : ''}`}>
              {/* Card header */}
              <div className="ai-card-header" onClick={() => setExpandedId(isExpanded ? null : i)}>
                <div className="ai-card-title-row">
                  <span className="ai-card-chevron">{isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
                  <span className="ai-card-name">{opp.capabilityName}</span>
                </div>
                <div className="ai-card-chips">
                  {opp.levels.map(l => (
                    <span
                      key={l.level}
                      className="ai-level-chip"
                      style={{ background: LEVEL_BG[l.level], color: LEVEL_COLORS[l.level] }}
                    >
                      L{l.level} {l.type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="ai-card-detail animate-fade-in">
                  <div className="ai-breadcrumb">{opp.l0Name} → {opp.l1Name}</div>
                  {opp.levels.map(l => (
                    <div key={l.level} className="ai-level-block">
                      <div
                        className="ai-level-title"
                        style={{ color: LEVEL_COLORS[l.level], borderLeft: `3px solid ${LEVEL_COLORS[l.level]}` }}
                      >
                        Level {l.level} — {LEVEL_LABELS[l.level]}
                        <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.8 }}>{l.type}</span>
                      </div>
                      <p className="ai-level-desc">{l.description}</p>
                      
                      {l.valueAndBenefits && (
                        <div style={{ marginTop: '8px' }}>
                          <span className="ai-tools-label" style={{ display: 'block', marginBottom: '4px' }}>Value & Benefits:</span>
                          <p className="ai-level-desc" style={{ paddingLeft: '0' }}>{l.valueAndBenefits}</p>
                        </div>
                      )}

                      {l.processImpact && (
                        <div style={{ marginTop: '8px' }}>
                          <span className="ai-tools-label" style={{ display: 'block', marginBottom: '4px' }}>Process Impact:</span>
                          <p className="ai-level-desc" style={{ paddingLeft: '0' }}>{l.processImpact}</p>
                        </div>
                      )}

                      {l.nextSteps && l.nextSteps.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <span className="ai-tools-label" style={{ display: 'block', marginBottom: '4px' }}>Key Next Steps:</span>
                          <ol style={{ margin: 0, paddingLeft: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                            {l.nextSteps.map((step, idx) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {l.tools && l.tools.length > 0 && (
                        <div className="ai-tools" style={{ marginTop: '12px' }}>
                          <span className="ai-tools-label">Suggested tools:</span>
                          <div className="ai-tool-chips">
                            {l.tools.map((t, ti) => (
                              <span key={ti} className="ai-tool-chip">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
