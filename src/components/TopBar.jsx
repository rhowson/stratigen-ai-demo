import { useApp } from '../context/AppContext';
import { Hexagon, Target, AlertCircle, Tool, Layers, Cpu, Shield, ChevronRight } from 'react-feather';
import './TopBar.css';

export default function TopBar() {
  const { state, actions } = useApp();
  const { company, objectives, maturityScores, painPoints, fixes, workPackages, showAILayer, showRegulatoryLayer, isOnboarded } = state;

  const scored = Object.values(maturityScores).filter(s => s > 0);
  const avgMaturity = scored.length > 0 ? (scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(1) : '—';

  const steps = [isOnboarded, objectives.length > 0, painPoints.length > 0, fixes.length > 0, workPackages.length > 0];
  const progress = Math.round((steps.filter(Boolean).length / steps.length) * 100);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <Hexagon size={20} className="logo-icon" />
          <span className="logo-text">Stratigen<span className="logo-ai">AI</span></span>
        </div>
        {company && (
          <div className="topbar-company animate-fade-in">
            <ChevronRight size={14} className="topbar-sep" />
            <span className="company-name">{company.name}</span>
          </div>
        )}
      </div>

      <div className="topbar-centre">
        {isOnboarded && (
          <>
            <div className="topbar-stats">
              <div className="stat-item">
                <Target size={13} className="stat-icon" />
                <span className="stat-value">{objectives.length}</span>
                <span className="stat-label">Objectives</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <AlertCircle size={13} className="stat-icon" />
                <span className="stat-value">{painPoints.length}</span>
                <span className="stat-label">Pain Points</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <Tool size={13} className="stat-icon" />
                <span className="stat-value">{fixes.length}</span>
                <span className="stat-label">Fixes</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <Layers size={13} className="stat-icon" />
                <span className="stat-value">{workPackages.length}</span>
                <span className="stat-label">Workstreams</span>
              </div>
            </div>
            <div className="topbar-progress">
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-label">{progress}%</span>
            </div>
          </>
        )}
      </div>

      <div className="topbar-right">
        {isOnboarded && (
          <div className="topbar-toggles">
            <button
              className={`btn btn-sm toggle-btn ${showAILayer ? 'toggle-active toggle-ai' : ''}`}
              onClick={actions.toggleAILayer}
            >
              <Cpu size={13} />
              AI Layer
            </button>
            <button
              className={`btn btn-sm toggle-btn ${showRegulatoryLayer ? 'toggle-active toggle-reg' : ''}`}
              onClick={actions.toggleRegulatoryLayer}
            >
              <Shield size={13} />
              Regulatory
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
