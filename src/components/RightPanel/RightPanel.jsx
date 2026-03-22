import { useApp } from '../../context/AppContext';
import { Sidebar, ChevronRight, Activity, TrendingUp, AlertTriangle, Shield, Compass } from 'react-feather';
import KPIImpact from './KPIImpact';
import MaturityBenchmark from './MaturityBenchmark';
import AIOpportunities from './AIOpportunities';
import RiskIndicators from './RiskIndicators';
import CompetitorInsights from './CompetitorInsights';
import './RightPanel.css';

export default function RightPanel() {
  const { state, actions } = useApp();
  const { rightPanelOpen, competitorLoading, competitors, fixes, aiOpportunities } = state;

  if (!state.isOnboarded) return null;

  // Calculate if there are new insights to show
  const hasInsights = competitors || fixes.length > 0 || aiOpportunities.length > 0;
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
          <Compass size={16} />
          <span className="section-title" style={{ margin: 0 }}>Insight Engine</span>
        </div>
        <button className="collapse-btn" onClick={() => actions.toggleRightPanel(false)} title="Close Panel">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="rp-content">
        <CompetitorInsights />
        <MaturityBenchmark />
        <KPIImpact />
        <AIOpportunities />
        <RiskIndicators />
      </div>
    </aside>
  );
}
