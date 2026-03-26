import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Target, Zap, Settings, ChevronLeft, Hexagon, Check } from 'react-feather';
import OnboardingForm from './OnboardingForm';
import StrategyInput from './StrategyInput';
import PainPointInput from './PainPointInput';
import ActionTriggers from './ActionTriggers';
import './LeftPanel.css';

const icons = { onboarding: Hexagon, strategy: Target, painpoints: Zap, actions: Settings };

export default function LeftPanel() {
  const { state, actions } = useApp();
  const [activeSection, setActiveSection] = useState('onboarding');
  const collapsed = state.leftPanelCollapsed;

  const sections = [
    { id: 'onboarding', label: 'Company', component: OnboardingForm, isDone: state.isOnboarded },
    { id: 'strategy', label: 'Strategy', component: StrategyInput, requiresOnboard: true, isDone: state.objectives.length > 0 },
    { id: 'painpoints', label: 'Pain Points', component: PainPointInput, requiresOnboard: true, isDone: state.painPoints.length > 0 },
    { id: 'actions', label: 'Actions', component: ActionTriggers, requiresOnboard: true, isDone: state.workPackages.length > 0 },
  ];

  return (
    <aside className={`left-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="left-panel-header">
        <button className="collapse-toggle" onClick={actions.toggleLeftPanel}>
          <ChevronLeft size={16} className={collapsed ? 'rotate-180' : ''} />
        </button>
        {!collapsed && <span className="panel-title">Workspace</span>}
      </div>

      <nav className="panel-tabs">
        {sections.map(s => {
          const Icon = icons[s.id];
          return (
            <button
              key={s.id}
              className={`panel-tab ${activeSection === s.id ? 'active' : ''} ${s.requiresOnboard && !state.isOnboarded ? 'disabled' : ''} ${s.isDone ? 'is-done' : ''}`}
              onClick={() => {
                if (!s.requiresOnboard || state.isOnboarded) {
                  setActiveSection(s.id);
                  actions.setLeftPanelCollapsed(false);
                }
              }}
              disabled={s.requiresOnboard && !state.isOnboarded}
              title={collapsed ? s.label : ''}
            >
              <div className="tab-icon-wrapper">
                <Icon size={14} />
                {s.isDone && <div className="done-indicator"><Check size={8} /></div>}
              </div>
              {!collapsed && <span>{s.label}</span>}
              {!collapsed && s.id === 'painpoints' && state.painPoints.length > 0 && (
                <span className="tab-count">{state.painPoints.length}</span>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="panel-content">
          {sections.map(s => (
            activeSection === s.id && <s.component key={s.id} />
          ))}
        </div>
      )}
    </aside>
  );
}
