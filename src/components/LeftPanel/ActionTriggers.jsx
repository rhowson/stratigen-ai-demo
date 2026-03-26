import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tool, Package, Cpu, CheckCircle, Settings, Loader, RefreshCw, AlertTriangle } from 'react-feather';
import WorkPackageSelectorModal from '../WorkPackageSelectorModal';

export default function ActionTriggers() {
  const { state, actions } = useApp();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

  const hasPainPoints = state.painPoints.length > 0;
  const hasFixes = state.fixes.length > 0;
  const hasWorkPackages = state.workPackages.length > 0;
  const hasAIPlan = !!state.aiExecutionPlan;
  
  const execLoading = state.execLoading;
  const fixesLoading = state.fixesLoading;
  const wpLoading = state.wpLoading;

  const actionCards = [
    {
      step: 1,
      icon: Tool,
      title: 'Generate Fixes',
      desc: 'Analyse pain points and generate fixes across Process, People, Technology, and Data.',
      action: actions.generateFixes,
      enabled: hasPainPoints && !fixesLoading,
      done: hasFixes && !fixesLoading,
      loading: fixesLoading,
      doneLabel: `${state.fixes.length} fixes generated`,
      warning: 'Regenerating fixes will overwrite your existing fixes. Continue?',
    },
    {
      step: 2,
      icon: Package,
      title: 'Package Work',
      desc: 'Group fixes into work packages with priority scoring and dependency mapping.',
      action: actions.createWorkPackages,
      enabled: hasFixes && !wpLoading,
      done: hasWorkPackages && !wpLoading,
      doneLabel: `${state.workPackages.reduce((a, ws) => a + ws.packages.length, 0)} packages in ${state.workPackages.length} workstreams`,
      loading: wpLoading,
      warning: 'Regenerating work packages will overwrite your existing packages. Continue?',
    },
    {
      step: 3,
      icon: Cpu,
      title: 'Build AI Execution Plan',
      desc: 'Select work packages to create a deep strategic implementation document including legal and ethical considerations.',
      action: () => setShowSelector(true),
      enabled: hasWorkPackages && !execLoading,
      done: hasAIPlan && !execLoading,
      loading: execLoading,
      doneLabel: `Execution plan ready for ${state.aiExecutionPlan?.length || 0} packages`,
      warning: 'Updating the Execution Plan will overwrite the current analysis. Continue?',
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

  const handleSelectorConfirm = (selectedIds, selectedPkgs) => {
    setShowSelector(false);
    actions.generateExecutionPlan(selectedPkgs);
  };

  const anyLoading = fixesLoading || wpLoading || execLoading;

  return (
    <div className="input-section">
      <div className="input-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={15} />
          Actions
        </div>
        {anyLoading && (
          <button 
            className="reset-ai-btn" 
            onClick={actions.resetLoadingStates}
            title="Reset stuck AI processes"
          >
            <RefreshCw size={12} />
            Reset AI
          </button>
        )}
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
              <div className="action-card-step-badge">{card.step}</div>
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
                <div className="action-card-status" style={{ color: 'var(--text-tertiary)', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="loading-dot pulsing" style={{ background: 'var(--accent-green)' }} />
                    {card.title === 'Generate Fixes' ? state.fixProgress.status : 
                     card.title === 'Package Work' ? state.wpProgress.status : 
                     state.execProgress.status}
                  </div>
                  {(card.loading && (card.title === 'Generate Fixes' || card.title === 'Package Work' || card.title === 'Build AI Execution Plan')) && (
                    <div className="progress-bar-container" style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${((
                            card.title === 'Generate Fixes' ? state.fixProgress.current / state.fixProgress.total :
                            card.title === 'Package Work' ? state.wpProgress.current / state.wpProgress.total :
                            state.execProgress.current / state.execProgress.total
                          ) || 0) * 100}%`,
                          height: '100%',
                          background: 'var(--accent-green)',
                          transition: 'width 0.4s ease'
                        }} 
                      />
                    </div>
                  )}
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

      {/* Selector Modal */}
      <WorkPackageSelectorModal
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        workPackages={state.workPackages}
        onConfirm={handleSelectorConfirm}
        loading={execLoading}
      />
    </div>
  );
}
