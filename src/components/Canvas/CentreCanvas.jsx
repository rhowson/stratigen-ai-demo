import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hexagon, Target, Map, Layers, Cpu } from 'react-feather';
import CapabilityMap from './CapabilityMap';
import WorkPackageView from './WorkPackageView';
import AIUseCaseView from './AIUseCaseView';
import './CentreCanvas.css';

const VIEWS = [
  { id: 'capabilities', label: 'Capability Map', icon: Map },
  { id: 'workpackages', label: 'Work Packages',  icon: Layers },
  { id: 'ai',          label: 'AI Use Cases',    icon: Cpu },
];

export default function CentreCanvas() {
  const { state } = useApp();
  const { isOnboarded, objectives, workPackages, aiOpportunities } = state;
  const [view, setView] = useState('capabilities');

  if (!isOnboarded) {
    return (
      <div className="canvas">
        <div className="canvas-empty">
          <Hexagon size={40} className="canvas-empty-icon" />
          <h2>Welcome to Stratigen AI</h2>
          <p>Enter company details in the left panel to load the<br />Recruitment Services industry model</p>
        </div>
      </div>
    );
  }

  const viewCounts = {
    workpackages: workPackages.length,
    ai: aiOpportunities.length,
  };

  return (
    <div className="canvas">
      {/* Objectives row */}
      {objectives.length > 0 && (
        <div className="canvas-objectives animate-fade-in">
          <div className="objectives-nodes">
            {objectives.map(obj => (
              <div key={obj.id} className="objective-node">
                <Target size={12} className="obj-icon" />
                <span className="obj-name">{obj.name}</span>
                <span className="obj-type">{obj.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View tabs bar */}
      <div className="canvas-tabs">
        {VIEWS.map(v => {
          const Icon = v.icon;
          const count = viewCounts[v.id];
          return (
            <button
              key={v.id}
              className={`canvas-tab ${view === v.id ? 'canvas-tab-active' : ''}`}
              onClick={() => setView(v.id)}
            >
              <Icon size={13} />
              {v.label}
              {count > 0 && <span className="canvas-tab-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Active view */}
      <div className="canvas-body">
        {view === 'capabilities' && <CapabilityMap />}
        {view === 'workpackages' && <WorkPackageView />}
        {view === 'ai'           && <AIUseCaseView />}
      </div>
    </div>
  );
}
