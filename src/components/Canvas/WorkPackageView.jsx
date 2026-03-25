import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, ChevronDown, ChevronRight, Tool, ExternalLink } from 'react-feather';
import './WorkPackageView.css';

export default function WorkPackageView() {
  const { state, actions } = useApp();
  const { workPackages, fixes } = state;
  const [expandedWS, setExpandedWS] = useState(new Set());

  const toggleWS = (id) => setExpandedWS(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  if (!workPackages.length) {
    return (
      <div className="view-empty">
        <Layers size={36} className="view-empty-icon" />
        <h3>No Work Packages Yet</h3>
        <p>Generate fixes from the Actions panel to build work packages.</p>
      </div>
    );
  }

  return (
    <div className="wp-view">
      {/* Summary header */}
      <div className="wp-summary-bar">
        <div className="wp-summary-stat">
          <span className="wp-stat-value">{workPackages.length}</span>
          <span className="wp-stat-label">Workstreams</span>
        </div>
        <div className="wp-summary-stat">
          <span className="wp-stat-value">{workPackages.reduce((a, ws) => a + ws.packages.length, 0)}</span>
          <span className="wp-stat-label">Packages</span>
        </div>
        <div className="wp-summary-stat">
          <span className="wp-stat-value">{fixes.length}</span>
          <span className="wp-stat-label">Fixes</span>
        </div>
        <div className="wp-summary-stat">
          <span className="wp-stat-value">{workPackages.reduce((a, ws) => a + ws.totalFixes, 0)}</span>
          <span className="wp-stat-label">Actions</span>
        </div>
      </div>

      {/* Workstream accordion list */}
      <div className="wp-list">
        {workPackages.map(ws => {
          const wsExpanded = expandedWS.has(ws.id);
          const highPkgs = ws.packages.filter(p => p.priority === 'High').length;

          return (
            <div key={ws.id} className="ws-section">
              {/* Workstream header */}
              <div className="ws-header" onClick={() => toggleWS(ws.id)}>
                <div className="ws-header-left">
                  <span className="ws-chevron">{wsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                  <span className="ws-name">{ws.name}</span>
                  <span className="ws-badge">{ws.packages.length} packages</span>
                  {highPkgs > 0 && <span className="ws-badge ws-badge-high">{highPkgs} High Priority</span>}
                </div>
                <div className="ws-header-right">
                  <span className="ws-fix-count" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                    <Tool size={11} /> {ws.totalFixes} actions
                  </span>
                </div>
              </div>

              {/* Work packages simplified grid */}
              {wsExpanded && (
                <div className="pkg-list animate-fade-in">
                  {ws.packages.map(pkg => (
                    <div key={pkg.id} className="pkg-card-simple">
                      <div className="pkg-header-simple">
                        <span className="pkg-name-small">{pkg.name}</span>
                        <span className={`priority-badge ${pkg.priority?.toLowerCase()}`}>
                          {pkg.priority}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {pkg.description}
                      </p>
                      <button 
                        className="pkg-explore-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.setSelectedWorkPackage(pkg);
                        }}
                      >
                        <ExternalLink size={12} />
                        Explore Detailed Briefing
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
