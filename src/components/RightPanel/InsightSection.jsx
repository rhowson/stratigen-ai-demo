import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'react-feather';

/**
 * Reusable collapsible wrapper for all right-panel insight sections.
 * Usage:
 *   <InsightSection title="Competitor Analysis" icon={<Target size={14} />} count={3} defaultOpen={false}>
 *     ...content...
 *   </InsightSection>
 */
export default function InsightSection({ title, icon, count, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`insight-section${open ? '' : ' insight-section-collapsed'}`}>
      <div className="insight-section-toggle" onClick={() => setOpen(o => !o)}>
        <div className="insight-section-toggle-left">
          <span className="insight-section-chevron">
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </span>
          {icon && <span className="insight-section-icon">{icon}</span>}
          <span className="insight-section-title">{title}</span>
        </div>
        <div className="insight-section-toggle-right">
          {badge && <span className="insight-section-badge">{badge}</span>}
          {count !== undefined && count > 0 && (
            <span className="insight-count">{count}</span>
          )}
        </div>
      </div>
      {open && <div className="insight-section-body">{children}</div>}
    </div>
  );
}
