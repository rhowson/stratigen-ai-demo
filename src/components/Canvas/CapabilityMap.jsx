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
    const allL2 = [];
    l0.l1.forEach(l1 => {
      l1.l2.forEach(l2 => {
        allL2.push({ l0, l1, l2, score: maturityScores[l2.id] || 0 });
      });
    });

    allL2.sort((a, b) => {
      const aImp = isImpacted(a.l2.id) ? 0 : 1;
      const bImp = isImpacted(b.l2.id) ? 0 : 1;
      if (aImp !== bImp) return aImp - bImp;
      return a.score - b.score;
    });

    const impactCount = allL2.filter(c => isImpacted(c.l2.id)).length;
    const fixCount = allL2.filter(c => hasFix(c.l2.id)).length;
    const aiCount = allL2.filter(c => hasAI(c.l2.id)).length;
    const scored = allL2.filter(c => c.score > 0);
    const avgMaturity = scored.length > 0 ? scored.reduce((s, c) => s + c.score, 0) / scored.length : 0;

    return { l0, allL2, impactCount, fixCount, aiCount, avgMaturity, total: allL2.length };
  });

  l0Data.sort((a, b) => {
    if (a.impactCount > 0 && b.impactCount === 0) return -1;
    if (b.impactCount > 0 && a.impactCount === 0) return 1;
    return a.avgMaturity - b.avgMaturity;
  });

  return (
    <div className="capability-map">
      {l0Data.map(({ l0, allL2, impactCount, fixCount, aiCount, avgMaturity, total }, idx) => {
        const matLevel = getMaturityLevel(avgMaturity);

        return (
          <div key={l0.id} className="l0-section animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
            <div className={`l0-summary-card ${impactCount > 0 ? 'l0-impacted' : ''}`}>
              <div className="l0-summary-top">
                <div className="l0-identity">
                  <span className="l0-name">{l0.name}</span>
                </div>
                <div className={`l0-maturity-pill maturity-${matLevel}`}>
                  {avgMaturity > 0 ? avgMaturity.toFixed(1) : '—'}
                </div>
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
              {allL2.map(({ l1, l2, score }) => {
                const impacted = isImpacted(l2.id);
                const fixed = hasFix(l2.id);
                const ai = showAILayer && hasAI(l2.id);
                const reg = showRegulatoryLayer && hasReg(l2.id);
                const bench = benchmarkProfiles[l2.id];
                const fix = fixes.find(f => f.capabilityId === l2.id);
                const level = getMaturityLevel(score);
                const painCount = (impactedCapabilities[l2.id] || []).length;
                
                let heatmapLevel = 0;
                if (painCount >= 5) heatmapLevel = 3;
                else if (painCount >= 3) heatmapLevel = 2;
                else if (painCount >= 1) heatmapLevel = 1;
                
                const heatmapClass = `heatmap-${heatmapLevel}`;

                return (
                  <div
                    key={l2.id}
                    className={`l2-card maturity-border-${level} ${heatmapClass} ${fixed ? 'l2-card-fixed' : ''}`}
                    onClick={() => handleCapClick(l0, l1, l2)}
                  >
                    <div className={`l2-card-indicator maturity-bg-${level}`} />
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

                      <div className="l2-card-maturity">
                        <div className="l2-card-matbar">
                          <div className={`l2-card-matfill maturity-bg-${level}`} style={{ width: score > 0 ? `${(score / 5) * 100}%` : '0%' }} />
                          {bench && <div className="l2-card-benchmark" style={{ left: `${(bench.industryBaseline / 5) * 100}%` }} />}
                          {fix && <div className="l2-card-target" style={{ left: `${(fix.targetMaturity / 5) * 100}%` }} />}
                        </div>
                        <div className="l2-card-score">
                          <span className={`score-value maturity-text-${level}`}>
                            {score > 0 ? score.toFixed(1) : '—'}
                          </span>
                          <span className="score-label">{getMaturityLabel(score)}</span>
                        </div>
                      </div>

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
