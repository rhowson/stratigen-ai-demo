import { useApp } from '../../context/AppContext';
import { Target } from 'react-feather';
import InsightSection from './InsightSection';

export default function CompetitorInsights() {
  const { state } = useApp();
  const { competitors, competitorLoading, competitorError } = state;

  if (competitorLoading) {
    return (
      <InsightSection title="Competitor Analysis" icon={<Target size={14} />} defaultOpen={true}>
        <div className="competitor-loading">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="competitor-loading-label">
            <span className="loading-dot pulsing" style={{ background: 'var(--accent-green)' }} />
            Running competitor analysis...
          </div>
        </div>
      </InsightSection>
    );
  }

  if (competitorError) {
    return (
      <InsightSection title="Competitor Analysis" icon={<Target size={14} />} defaultOpen={true}>
        <div className="insight-empty">⚠️ {competitorError}</div>
      </InsightSection>
    );
  }

  if (!competitors) return null;

  const threatColors = { High: 'chip-rose', Medium: 'chip-amber', Low: 'chip-emerald' };
  const positionColors = { Leader: 'chip-dark', Challenger: 'chip-cyan', Niche: 'chip-amber', Emerging: 'chip-emerald' };

  return (
    <InsightSection
      title="Competitor Analysis"
      icon={<Target size={14} />}
      count={competitors.competitors?.length || 0}
      defaultOpen={false}
    >
      {competitors.marketInsights && (
        <div className="market-insights-card">
          <p>{competitors.marketInsights}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
        {competitors.competitors?.map((comp, i) => (
          <div key={i} className="competitor-card">
            <div className="competitor-header">
              <div>
                <div className="competitor-name">{comp.name}</div>
                {comp.website && <div className="competitor-website">{comp.website}</div>}
              </div>
              <div className="competitor-badges">
                <span className={`chip ${positionColors[comp.marketPosition] || 'chip'}`} style={{ fontSize: '9px' }}>
                  {comp.marketPosition}
                </span>
                <span className={`chip ${threatColors[comp.threatLevel] || 'chip-amber'}`} style={{ fontSize: '9px' }}>
                  {comp.threatLevel} Threat
                </span>
              </div>
            </div>

            {comp.description && <div className="competitor-desc">{comp.description}</div>}

            <div className="competitor-details">
              {comp.strengths?.length > 0 && (
                <div className="competitor-detail-group">
                  <span className="detail-label">Strengths:</span>
                  <div className="detail-tags">
                    {comp.strengths.map((s, j) => (
                      <span key={j} className="chip chip-emerald" style={{ fontSize: '9px' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {comp.weaknesses?.length > 0 && (
                <div className="competitor-detail-group">
                  <span className="detail-label">Weaknesses:</span>
                  <div className="detail-tags">
                    {comp.weaknesses.map((w, j) => (
                      <span key={j} className="chip chip-rose" style={{ fontSize: '9px' }}>{w}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {competitors.strategicRecommendations?.length > 0 && (
        <div className="strategic-recs">
          <div className="recs-label">Strategic Recommendations</div>
          {competitors.strategicRecommendations.map((rec, i) => (
            <div key={i} className="rec-item">
              <span className="rec-number">{i + 1}</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </InsightSection>
  );
}
