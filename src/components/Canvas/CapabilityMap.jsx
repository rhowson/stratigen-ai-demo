import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Cpu, Shield } from 'react-feather';
import { benchmarkProfiles } from '../../data/recruitmentModel';
import './CapabilityMap.css';

export default function CapabilityMap() {
  const { state, actions } = useApp();
  const { capabilities, maturityScores, impactedCapabilities, fixes, showAILayer, showRegulatoryLayer, aiOpportunities, regulations } = state;

  const isImpacted = (l2Id) => (impactedCapabilities[l2Id] || []).length > 0;
  const hasFix = (l2Id) => fixes.some(f => f.capabilityId === l2Id);
  const hasAI = (l2Id) => aiOpportunities.some(a => a.capabilityId === l2Id);
  const hasReg = (l2Id) => regulations.some(r => r.capabilityId === l2Id);

  const getMaturityLevel = (score) => {
    if (score === 0) return 'neutral';
    if (score <= 1.5) return '1';
    if (score <= 2.5) return '2';
    if (score <= 3.5) return '3';
    if (score <= 4.5) return '4';
    return '5';
  };

  const getMaturityLabel = (score) => {
    if (score === 0) return 'Unscored';
    if (score <= 1) return 'Initial';
    if (score <= 2) return 'Developing';
    if (score <= 3) return 'Defined';
    if (score <= 4) return 'Managed';
    return 'Optimised';
  };

  const handleCapClick = (l0, l1, l2) => {
    actions.openSlidePanel('capability', {
      l0Id: l0.id, l0Name: l0.name,
      l1Id: l1.id, l1Name: l1.name,
      l2Id: l2.id, l2Name: l2.name,
    });
  };

  const l0Data = capabilities.map(l0 => {
    let allL2 = [];
    let totalPainCount = 0;
    
    l0.l1.forEach(l1 => {
      l1.l2.forEach(l2 => {
        const painCount = (impactedCapabilities[l2.id] || []).length;
        totalPainCount += painCount;
        allL2.push({ l0, l1, l2, painCount, score: maturityScores[l2.id] || 0 });
      });
    });

    allL2.sort((a, b) => {
      if (a.painCount !== b.painCount) return b.painCount - a.painCount; // Highest pain first
      return a.score - b.score;
    });

    const impactCount = allL2.filter(c => c.painCount > 0).length;
    const fixCount = allL2.filter(c => hasFix(c.l2.id)).length;
    const aiCount = allL2.filter(c => hasAI(c.l2.id)).length;

    return { l0, allL2, impactCount, fixCount, aiCount, totalPainCount, total: allL2.length };
  });

  l0Data.sort((a, b) => b.totalPainCount - a.totalPainCount);

  return (
    <div className="capability-map">
      {l0Data.map(({ l0, allL2, impactCount, fixCount, aiCount, totalPainCount, total }, idx) => {
        return (
          <div key={l0.id} className="l0-section animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
            <div className={`l0-summary-card ${impactCount > 0 ? 'l0-impacted' : ''}`}>
              <div className="l0-summary-top">
                <div className="l0-identity">
                  <span className="l0-name">{l0.name}</span>
                </div>
                {totalPainCount > 0 && (
                  <div className="l0-impact-pill">
                    {totalPainCount} Impact{totalPainCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="l0-summary-stats">
                <span className="l0-stat">{total} capabilities</span>
                {impactCount > 0 && (
                  <span className="l0-stat l0-stat-impact">
                    <AlertTriangle size={11} />
                    {impactCount} impacted
                  </span>
                )}
                {fixCount > 0 && (
                  <span className="l0-stat l0-stat-fix">
                    <CheckCircle size={11} />
                    {fixCount} fixes
                  </span>
                )}
                {aiCount > 0 && showAILayer && (
                  <span className="l0-stat l0-stat-ai">
                    <Cpu size={11} />
                    {aiCount} AI
                  </span>
                )}
              </div>
            </div>

              <div className="l2-tile-grid">
              {allL2.map(({ l1, l2, painCount }) => {
                const impacted = painCount > 0;
                const fixed = hasFix(l2.id);
                const ai = showAILayer && hasAI(l2.id);
                const reg = showRegulatoryLayer && hasReg(l2.id);
                const fix = fixes.find(f => f.capabilityId === l2.id);
                
                let heatmapLevel = 0;
                if (painCount >= 5) heatmapLevel = 3;
                else if (painCount >= 3) heatmapLevel = 2;
                else if (painCount >= 1) heatmapLevel = 1;
                
                const heatmapClass = `heatmap-${heatmapLevel}`;

                return (
                  <div
                    key={l2.id}
                    className={`l2-card ${heatmapClass} ${fixed ? 'l2-card-fixed' : ''}`}
                    onClick={() => handleCapClick(l0, l1, l2)}
                  >
                    <div className="l2-card-body">
                      <div className="l2-card-top">
                        <span className="l2-card-name">{l2.name}</span>
                        <div className="l2-card-badges">
                          {impacted && <AlertTriangle size={12} className="badge-warning" title={`${painCount} pain point${painCount > 1 ? 's' : ''}`} />}
                          {fixed && <CheckCircle size={12} className="badge-success" title="Has fix" />}
                          {ai && <Cpu size={12} className="badge-info" title="AI Opportunity" />}
                          {reg && <Shield size={12} className="badge-warning" title="Regulatory" />}
                        </div>
                      </div>

                      <div className="l2-card-breadcrumb">{l1.name}</div>

                      {impacted && (
                        <div className="l2-card-pains">
                          {state.painPoints
                            .filter(pp => pp.mappedCapabilities.some(mc => mc.l2Id === l2.id))
                            .slice(0, 2)
                            .map(pp => (
                              <div key={pp.id} className="l2-pain-tag">
                                <span className="pain-dot" />
                                <span className="pain-text">{pp.text.length > 40 ? pp.text.slice(0, 40) + '…' : pp.text}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
