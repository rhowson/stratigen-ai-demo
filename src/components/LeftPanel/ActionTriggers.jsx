import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tool, Package, Cpu, CheckCircle, Settings, Loader, RefreshCw, AlertTriangle } from 'react-feather';

export default function ActionTriggers() {
  const { state, actions } = useApp();
  const [confirmAction, setConfirmAction] = useState(null);

  const hasPainPoints = state.painPoints.length > 0;
  const hasFixes = state.fixes.length > 0;
  const hasWorkPackages = state.workPackages.length > 0;
  const hasAI = state.aiOpportunities.length > 0;
  const aiLoading = state.aiLoading;

  const actionCards = [
    {
      icon: Tool,
      title: 'Generate Fixes',
      desc: 'Analyse pain points and generate fixes across Process, People, Technology, and Data.',
      action: actions.generateFixes,
      enabled: hasPainPoints,
      done: hasFixes,
      doneLabel: `${state.fixes.length} fixes generated`,
      warning: 'Regenerating fixes will overwrite your existing fixes. Continue?',
    },
    {
      icon: Package,
      title: 'Package Work',
      desc: 'Group fixes into work packages with priority scoring and dependency mapping.',
      action: actions.createWorkPackages,
      enabled: hasPainPoints,
      done: hasWorkPackages,
      doneLabel: `${state.workPackages.length} workstreams created`,
      warning: 'Regenerating work packages will overwrite your existing packages. Continue?',
    },
    {
      icon: Cpu,
      title: 'Accelerate with AI',
      desc: 'Use GPT-4o to identify AI opportunities at Prompt, Workflow, and Agent levels.',
      action: actions.generateAI,
      enabled: hasFixes && !aiLoading,
      done: hasAI && !aiLoading,
      loading: aiLoading,
      doneLabel: `${state.aiOpportunities.length} AI opportunities`,
      warning: 'Regenerating AI Analysis will overwrite your existing AI uses cases. Continue?',
    },
  ];

  const handleAction = (card) => {
    if (!card.enabled || card.loading) return;
    
    if (card.done) {
      setConfirmAction(card);
    } else {
      card.action();
    }
  };

  const confirmRegenerate = () => {
    if (confirmAction) {
      confirmAction.action();
      setConfirmAction(null);
    }
  };

  return (
    <div className="input-section">
      <div className="input-section-title">
        <Settings size={15} />
        Actions
      </div>
      {!hasPainPoints && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)', lineHeight: 1.6 }}>
          Add pain points first to enable action triggers.
        </p>
      )}

      <div className="action-cards">
        {actionCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`action-card ${!card.enabled ? 'disabled' : ''} ${card.loading ? 'loading' : ''} ${card.done ? 'has-done' : ''}`}
              onClick={() => handleAction(card)}
            >
              <div className="action-card-top">
                <div className="action-card-icon-wrap">
                  {card.loading ? <Loader size={18} className="spin" /> : <Icon size={18} />}
                </div>
                <div>
                  <div className="action-card-title">{card.title}</div>
                  <div className="action-card-desc">{card.desc}</div>
                </div>
              </div>
              {card.loading && (
                <div className="action-card-status" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="loading-dot pulsing" style={{ background: 'var(--accent-green)' }} />
                  Analysing with GPT-4o...
                </div>
              )}
              {card.done && (
                <div className="action-card-status action-done" style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={13} />
                    {card.doneLabel}
                  </div>
                  <div className="regenerate-btn">
                    <RefreshCw size={12} />
                    Regenerate
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <AlertTriangle size={18} className="icon-warning" />
              Confirm Regeneration
            </div>
            <div className="modal-body">
              {confirmAction.warning}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmAction(null)}>Cancel</button>
              <button className="btn-primary" onClick={confirmRegenerate}>Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
