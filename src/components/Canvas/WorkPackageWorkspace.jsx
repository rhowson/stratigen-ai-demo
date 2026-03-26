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
    <div className="spec-workspace-overlay animate-fade-in">
      <div className="spec-workspace-content animate-slide-up">
        <div className="workspace-header">
          <div className="header-left">
            <button className="back-nav-btn" onClick={() => actions.setSelectedWorkPackage(null)}>
              <X size={16} />
              Close Briefing
            </button>
            <div className="header-titles">
              <h2>{pkg.name}</h2>
              <div className="platform-target">
                <span>Transformation Workstream: <strong>{pkg.l0Domain}</strong></span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <span className={`priority-badge ${pkg.priority?.toLowerCase()}`}>
              {pkg.priority} Priority
            </span>
          </div>
        </div>

        <div className="workspace-scroll-area">
          <div className="strategic-doc-container animate-fade-in">
            <div className="strategic-doc-paper">
              {/* Document Header */}
              <div className="doc-section doc-header-info">
                <div className="doc-label">Strategic Implementation Briefing</div>
                <h1>{pkg.name}</h1>
                <p className="doc-wp-name">{pkg.l0Domain} • {pkg.priority} Priority</p>
              </div>

              {/* Overview & Strategic Intent */}
              <div className="doc-section">
                <h3><Target size={16} /> Strategic Intent & Objective</h3>
                <p>{pkg.description}</p>
              </div>

              {/* Benefits & Resources Grid */}
              <div className="doc-section">
                <div className="analysis-card-row">
                  <div className="analysis-mini-card">
                    <div className="mini-card-header"><Activity size={14} /> Strategic Benefits</div>
                    <ul className="dim-list" style={{ marginTop: '12px' }}>
                      {pkg.benefits?.map((b, i) => <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{b}</li>)}
                    </ul>
                  </div>
                  <div className="analysis-mini-card">
                    <div className="mini-card-header"><Package size={14} /> Resources Required</div>
                    <ul className="dim-list" style={{ marginTop: '12px' }}>
                      {pkg.resourcesRequired?.map((r, i) => <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Key Activities & Outputs */}
              <div className="doc-section">
                <h3><Activity size={16} /> Operational Execution</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <label className="pain-points-label"><Tool size={12} /> Key Activities</label>
                    <div className="compact-list">
                      {pkg.keyActivities?.map((a, i) => (
                        <div key={i} className="compact-item">
                          <CheckCircle size={12} />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="pain-points-label"><Cpu size={12} /> Key Outputs</label>
                    <div className="compact-list">
                      {pkg.keyOutputs?.map((o, i) => (
                        <div key={i} className="compact-item">
                          <div className="output-dot" />
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capability Transformation Matrix */}
              <div className="doc-section">
                <h3><Layers size={16} /> Capability Transformation Matrix</h3>
                <div className="transformation-matrix" style={{ gridTemplateColumns: '1fr', gap: '16px' }}>
                  {pkg.fixes?.map((fix, idx) => (
                    <div key={idx} className="matrix-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                      <div className="matrix-card-header" style={{ padding: '16px 20px' }}>
                        <span className="matrix-cap-name">{fix.capabilityName}</span>
                        <span className="matrix-fix-title">{fix.title}</span>
                      </div>
                      <div className="matrix-dimensions" style={{ padding: '16px 20px', background: 'white' }}>
                        {Object.entries(fix.dimensions || {}).map(([dim, items]) => (
                          <div key={dim} className="matrix-dim">
                            <span className="dim-label" style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{dim}</span>
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

              {/* Footer Stamp */}
              <div style={{ marginTop: '64px', textAlign: 'center', opacity: 0.5 }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Stratigen AI Strategic Implementation Framework
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
,
    document.body
  );
}
