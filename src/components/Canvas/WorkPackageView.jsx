import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Cpu, Tool } from 'react-feather';

const PRIORITY_COLOR = { High: '#EF4444', Medium: '#F59E0B', Low: '#6B7280' };

export default function WorkPackageView() {
  const { state, actions } = useApp();
  const { workPackages, fixes } = state;
  const [expandedWS, setExpandedWS] = useState(new Set());
  const [expandedPkg, setExpandedPkg] = useState(new Set());

  const toggleWS = (id) => setExpandedWS(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const togglePkg = (id) => setExpandedPkg(prev => {
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
                  <span className="ws-fix-count"><Tool size={11} /> {ws.totalFixes} actions</span>
                </div>
              </div>

              {/* Work packages */}
              {wsExpanded && (
                <div className="pkg-list animate-fade-in">
                  {ws.packages.map(pkg => {
                    const pkgExpanded = expandedPkg.has(pkg.id);
                    return (
                      <div key={pkg.id} className={`pkg-card priority-${pkg.priority.toLowerCase()}`}>
                        {/* Package header row */}
                        <div className="pkg-header" onClick={() => togglePkg(pkg.id)}>
                          <div className="pkg-header-left">
                            <span className="pkg-chevron">{pkgExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
                            <span className="pkg-name">{pkg.name}</span>
                          </div>
                          <div className="pkg-header-right">
                            <span className="pkg-priority" style={{ color: PRIORITY_COLOR[pkg.priority] }}>
                              {pkg.priority}
                            </span>
                            <span className="pkg-fix-count">{pkg.fixes.length} capabilities</span>
                          </div>
                        </div>

                        {/* Capability + fix rows */}
                        {pkgExpanded && (
                          <div className="pkg-fixes animate-fade-in">
                            {pkg.fixes.map((fix, fi) => (
                              <div key={fi} className="fix-row">
                                <div className="fix-row-header">
                                  <AlertTriangle size={11} className="badge-warning" />
                                  <span className="fix-cap-name">{fix.capabilityName}</span>
                                  <span className="fix-pain-count">{fix.painPoints.length} issue{fix.painPoints.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="fix-dimensions">
                                  {Object.entries(fix.dimensions).map(([dim, items]) => items.length > 0 && (
                                    <div key={dim} className="fix-dim-group">
                                      <span className="fix-dim-label">{dim.charAt(0).toUpperCase() + dim.slice(1)}</span>
                                      <ul className="fix-dim-items">
                                        {items.map((item, ii) => (
                                          <li key={ii}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
