import React from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { X, Layers, Tool, Target, Cpu, Activity, Package, CheckCircle } from 'react-feather';
import './WorkPackageView.css';

export default function WorkPackageWorkspace() {
  const { state, actions } = useApp();
  const { selectedWorkPackage } = state;

  if (!selectedWorkPackage) return null;

  const pkg = selectedWorkPackage;

  return createPortal(
    <div className="spec-portal-overlay animate-fade-in">
      <div className="spec-portal-container animate-slide-up">
        <div className="workspace-header">
          <div className="header-left">
            <button className="back-button" onClick={() => actions.setSelectedWorkPackage(null)}>
              <X size={16} />
              Close Briefing
            </button>
            <div className="header-titles">
              <h2>{pkg.name}</h2>
              <div className="platform-target">
                <span>Transformation Workstream: {pkg.l0Domain}</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <span className={`priority-badge ${pkg.priority?.toLowerCase()}`}>
              {pkg.priority} Priority
            </span>
          </div>
        </div>

        <div className="workspace-content">
          <div className="wp-workspace-grid">
            {/* Left: Strategic Context */}
            <div className="wp-workspace-section main">
              <label><Target size={14} /> Overview & Strategic Intent</label>
              <p className="wp-description-large">{pkg.description}</p>
              
              <div className="wp-sub-grid">
                <div className="wp-sub-section">
                  <label><Activity size={12} /> Strategic Benefits</label>
                  <ul>
                    {pkg.benefits?.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
                <div className="wp-sub-section">
                  <label><Package size={12} /> Resources Required</label>
                  <ul>
                    {pkg.resourcesRequired?.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Execution Framework */}
            <div className="wp-workspace-section sidebar">
              <label><Tool size={14} /> Key Activities</label>
              <div className="compact-list">
                {pkg.keyActivities?.map((a, i) => (
                  <div key={i} className="compact-item">
                    <CheckCircle size={12} />
                    <span>{a}</span>
                  </div>
                ))}
              </div>

              <label style={{ marginTop: '24px' }}><Cpu size={14} /> Key Outputs</label>
              <div className="compact-list">
                {pkg.keyOutputs?.map((o, i) => (
                  <div key={i} className="compact-item">
                    <div className="output-dot" />
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Capability Transformation Detail */}
            <div className="wp-workspace-section full-width">
              <label><Layers size={14} /> Capability Transformation Matrix</label>
              <div className="transformation-matrix">
                {pkg.fixes?.map((fix, idx) => (
                  <div key={idx} className="matrix-card">
                    <div className="matrix-card-header">
                      <span className="matrix-cap-name">{fix.capabilityName}</span>
                      <span className="matrix-fix-title">{fix.title}</span>
                    </div>
                    <div className="matrix-dimensions">
                      {Object.entries(fix.dimensions || {}).map(([dim, items]) => (
                        <div key={dim} className="matrix-dim">
                          <span className="dim-label">{dim}</span>
                          <ul className="dim-list">
                            {Array.isArray(items) && items.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
