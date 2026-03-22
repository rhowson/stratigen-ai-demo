import { useApp } from '../../context/AppContext';
import { Hexagon, Target, ChevronRight } from 'react-feather';
import CapabilityMap from './CapabilityMap';
import './CentreCanvas.css';

export default function CentreCanvas() {
  const { state, actions } = useApp();
  const { isOnboarded, company, objectives, workPackages } = state;

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

  return (
    <div className="canvas">
      {/* Objectives Row */}
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

      {/* Capability Map */}
      <div className="canvas-body">
        <CapabilityMap />
      </div>

      {/* Workstreams */}
      {workPackages.length > 0 && (
        <div className="canvas-workstreams animate-fade-in">
          <div className="ws-header">
            <span className="section-title" style={{ margin: 0 }}>Workstreams</span>
            <span className="ws-count">{workPackages.length}</span>
          </div>
          <div className="ws-list">
            {workPackages.map(ws => (
              <div key={ws.id} className="ws-card glass-card" onClick={() => actions.openSlidePanel('workpackage', ws.packages[0])}>
                <div className="ws-name">{ws.name}</div>
                <div className="ws-meta">
                  <span>{ws.packages.length} packages</span>
                  <span>·</span>
                  <span>{ws.totalFixes} fixes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
