import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Cpu, Shield, ChevronDown, ChevronRight } from 'react-feather';
import './CapabilityMap.css';

export default function CapabilityMap() {
  const { state, actions } = useApp();
  const { capabilities, maturityScores, impactedCapabilities, fixes, showAILayer, showRegulatoryLayer, aiOpportunities, regulations } = state;

  // All L0 groups start collapsed
  const [expandedL0, setExpandedL0] = useState(new Set());

  const toggleL0 = (l0Id) => {
    setExpandedL0(prev => {
      const next = new Set(prev);
      if (next.has(l0Id)) next.delete(l0Id);
      else next.add(l0Id);
      return next;
    });
  };

  const hasFix = (l2Id) => fixes.some(f => f.capabilityId === l2Id);
  const hasAI = (l2Id) => aiOpportunities.some(a => a.capabilityId === l2Id);
  const hasReg = (l2Id) => regulations.some(r => r.capabilityId === l2Id);

  const handleCapClick = (e, l0, l1, l2) => {
    e.stopPropagation(); // Don't collapse/expand the L0 when clicking a tile
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
        allL2.push({ l0, l1, l2, painCount });
      });
    });

    allL2.sort((a, b) => b.painCount - a.painCount);

    // Thresholds: aligned to tile-level heatmap
    const critical = allL2.filter(c => c.painCount >= 8).length;
    const high     = allL2.filter(c => c.painCount >= 5 && c.painCount < 8).length;
    const moderate = allL2.filter(c => c.painCount >= 1 && c.painCount < 5).length;

    const impactCount = allL2.filter(c => c.painCount > 0).length;
    const fixCount    = allL2.filter(c => hasFix(c.l2.id)).length;
    const aiCount     = allL2.filter(c => hasAI(c.l2.id)).length;

    return { l0, allL2, impactCount, fixCount, aiCount, totalPainCount, critical, high, moderate, total: allL2.length };
  });

  // Sort L0s by total pain count descending — highest-impact processes bubble to the top
  l0Data.sort((a, b) => b.totalPainCount - a.totalPainCount);

  return (
    <div className="capability-map">
      <div className="l0-accordion">
        {l0Data.map(({ l0, allL2, impactCount, fixCount, aiCount, totalPainCount, critical, high, moderate, total }, idx) => {
          const isExpanded = expandedL0.has(l0.id);

          return (
            <div key={l0.id} className="l0-section animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
              {/* L0 Accordion Header */}
              <div
                className="l0-header"
                onClick={() => toggleL0(l0.id)}
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="l0-header-left">
                  <span className="l0-chevron">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  <span className="l0-name">{l0.name}</span>
                  <span className="l0-count">{total}</span>
                </div>

                <div className="l0-header-right">
                  {/* Impact threshold summary pills */}
                  {critical > 0 && (
                    <span className="l0-threshold-pill l0-critical">{critical} Critical</span>
                  )}
                  {high > 0 && (
                    <span className="l0-threshold-pill l0-high">{high} High</span>
                  )}
                  {moderate > 0 && (
                    <span className="l0-threshold-pill l0-moderate">{moderate} Moderate</span>
                  )}
                  {fixCount > 0 && (
                    <span className="l0-threshold-pill l0-fixed">
                      <CheckCircle size={10} /> {fixCount} Fixed
                    </span>
                  )}
                  {aiCount > 0 && showAILayer && (
                    <span className="l0-threshold-pill l0-ai">
                      <Cpu size={10} /> {aiCount} AI
                    </span>
                  )}
                </div>
              </div>

              {/* L2 Tile Grid — only rendered when expanded */}
              {isExpanded && (
                <div className="l2-tile-grid animate-fade-in">
                  {allL2.map(({ l1, l2, painCount }) => {
                    const impacted = painCount > 0;
                    const fixed    = hasFix(l2.id);
                    const ai       = showAILayer && hasAI(l2.id);
                    const reg      = showRegulatoryLayer && hasReg(l2.id);

                    let heatmapLevel = 0;
                    if (painCount >= 8)      heatmapLevel = 3; // Critical
                    else if (painCount >= 5) heatmapLevel = 2; // High
                    else if (painCount >= 1) heatmapLevel = 1; // Moderate

                    const heatmapClass = `heatmap-${heatmapLevel}`;

                    return (
                      <div
                        key={l2.id}
                        className={`l2-card ${heatmapClass} ${fixed ? 'l2-card-fixed' : ''}`}
                        onClick={(e) => handleCapClick(e, l0, l1, l2)}
                        title={l2.name}
                      >
                        <div className="l2-card-body">
                          <div className="l2-card-top">
                            <span className="l2-card-name">{l2.name}</span>
                            <div className="l2-card-badges">
                              {impacted && <AlertTriangle size={10} className="badge-warning" />}
                              {fixed    && <CheckCircle  size={10} className="badge-success" />}
                              {ai       && <Cpu          size={10} className="badge-info" />}
                              {reg      && <Shield       size={10} className="badge-warning" />}
                            </div>
                          </div>
                          <div className="l2-card-breadcrumb">{l1.name}</div>
                          {impacted && (
                            <div className="l2-pain-summary">
                              <span className="pain-dot" />
                              {painCount} issue{painCount > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
