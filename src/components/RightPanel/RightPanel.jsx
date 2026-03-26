import { useApp } from '../../context/AppContext';
import { Sidebar, ChevronRight, Hexagon } from 'react-feather';
import KPIImpact from './KPIImpact';
import ImpactOverview from './ImpactOverview';
import RiskIndicators from './RiskIndicators';
import CompetitorInsights from './CompetitorInsights';
import GuardrailsRepository from './GuardrailsRepository';
import './RightPanel.css';

export default function RightPanel() {
  const { state, actions } = useApp();
  const { rightPanelOpen, competitorLoading, competitors, fixes, regulations } = state;

  if (!state.isOnboarded) return null;

  const hasInsights = competitors || fixes.length > 0 || regulations.length > 0;
  const isGenerating = competitorLoading;

  if (!rightPanelOpen) {
    return (
      <div className="right-panel-collapsed" onClick={() => actions.toggleRightPanel(true)}>
        <button className="collapse-toggle-btn" title="Open Insights">
          <Sidebar size={18} />
          {(hasInsights || isGenerating) && <span className={`insight-dot ${isGenerating ? 'pulsing' : ''}`} />}
        </button>
      </div>
    );
  }

  return (
    <aside className="right-panel">
      <div className="rp-header">
        <div className="rp-header-title">
          <Hexagon size={16} />
          <span className="section-title" style={{ margin: 0 }}>Insight Engine</span>
        </div>
        <button className="collapse-btn" onClick={() => actions.toggleRightPanel(false)} title="Close Panel">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="rp-content">
        <GuardrailsRepository />
        <CompetitorInsights />
        <ImpactOverview />
        <KPIImpact />
        <RiskIndicators />
      </div>
    </aside>
  );
}
