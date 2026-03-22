import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Target, Zap, Settings } from 'react-feather';
import OnboardingForm from './OnboardingForm';
import StrategyInput from './StrategyInput';
import PainPointInput from './PainPointInput';
import ActionTriggers from './ActionTriggers';
import './LeftPanel.css';

const icons = { onboarding: Briefcase, strategy: Target, painpoints: Zap, actions: Settings };

export default function LeftPanel() {
  const { state } = useApp();
  const [activeSection, setActiveSection] = useState('onboarding');

  const sections = [
    { id: 'onboarding', label: 'Company', component: OnboardingForm },
    { id: 'strategy', label: 'Strategy', component: StrategyInput, requiresOnboard: true },
    { id: 'painpoints', label: 'Pain Points', component: PainPointInput, requiresOnboard: true },
    { id: 'actions', label: 'Actions', component: ActionTriggers, requiresOnboard: true },
  ];

  return (
    <aside className="left-panel">
      <nav className="panel-tabs">
        {sections.map(s => {
          const Icon = icons[s.id];
          return (
            <button
              key={s.id}
              className={`panel-tab ${activeSection === s.id ? 'active' : ''} ${s.requiresOnboard && !state.isOnboarded ? 'disabled' : ''}`}
              onClick={() => (!s.requiresOnboard || state.isOnboarded) && setActiveSection(s.id)}
              disabled={s.requiresOnboard && !state.isOnboarded}
            >
              <Icon size={14} />
              {s.label}
              {s.id === 'painpoints' && state.painPoints.length > 0 && (
                <span className="tab-count">{state.painPoints.length}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="panel-content">
        {sections.map(s => (
          activeSection === s.id && <s.component key={s.id} />
        ))}
      </div>
    </aside>
  );
}
