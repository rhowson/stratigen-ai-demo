import { useApp } from '../../context/AppContext';
import { Tool, Package, Cpu, CheckCircle, Settings } from 'react-feather';

export default function ActionTriggers() {
  const { state, actions } = useApp();
  const hasPainPoints = state.painPoints.length > 0;
  const hasFixes = state.fixes.length > 0;
  const hasWorkPackages = state.workPackages.length > 0;
  const hasAI = state.aiOpportunities.length > 0;

  const actionCards = [
    {
      icon: Tool,
      title: 'Generate Fixes',
      desc: 'Analyse pain points and generate fixes across Process, People, Technology, and Data.',
      action: actions.generateFixes,
      enabled: hasPainPoints,
      done: hasFixes,
      doneLabel: `${state.fixes.length} fixes generated`,
    },
    {
      icon: Package,
      title: 'Package Work',
      desc: 'Group fixes into work packages with priority scoring and dependency mapping.',
      action: actions.createWorkPackages,
      enabled: hasPainPoints,
      done: hasWorkPackages,
      doneLabel: `${state.workPackages.length} workstreams created`,
    },
    {
      icon: Cpu,
      title: 'Accelerate with AI',
      desc: 'Identify AI opportunities at Prompt, Workflow, and Agent levels.',
      action: actions.generateAI,
      enabled: hasFixes,
      done: hasAI,
      doneLabel: `${state.aiOpportunities.length} AI opportunities`,
    },
  ];

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
              className={`action-card ${!card.enabled ? 'disabled' : ''}`}
              onClick={() => card.enabled && card.action()}
            >
              <div className="action-card-top">
                <div className="action-card-icon-wrap">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="action-card-title">{card.title}</div>
                  <div className="action-card-desc">{card.desc}</div>
                </div>
              </div>
              {card.done && (
                <div className="action-card-status action-done">
                  <CheckCircle size={13} />
                  {card.doneLabel}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
