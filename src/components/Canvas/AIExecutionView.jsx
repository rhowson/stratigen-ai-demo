import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Download, 
  Shield, 
  CheckSquare, 
  Server, 
  Database, 
  ChevronRight, 
  Info,
  Layers,
  Zap,
  Lock,
  Heart,
  DollarSign,
  Target,
  Cpu,
  Terminal,
  Activity,
  UserCheck,
  List,
  ExternalLink,
  Clipboard,
  Search,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  Maximize,
  Minimize,
  X
} from 'react-feather';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './AIExecutionView.css';

export default function AIExecutionView() {
  const { state, actions } = useApp();
  const { aiExecutionPlan, execLoading, execProgress, selectedSpec, specLoading } = state;
  const [activeIndex, setActiveIndex] = useState(0);
  const pdfExportRef = useRef();

  if (execLoading) {
    return (
      <div className="ai-exec-loading">
        <div className="loading-content">
          <div className="loading-icon-wrap">
            <Zap size={32} className="pulsing-icon" />
          </div>
          <h3>Synthesising AI Execution Plan</h3>
          <p>{execProgress.status}</p>
          <div className="loading-progress-container">
            <div 
              className="loading-progress-fill" 
              style={{ width: `${(execProgress.current / execProgress.total) * 100}%` }}
            />
          </div>
          <span className="loading-counter">{execProgress.current} / {execProgress.total} Work Packages Analysed</span>
        </div>
      </div>
    );
  }

  if (!aiExecutionPlan || aiExecutionPlan.length === 0) {
    return (
      <div className="ai-exec-empty">
        <FileText size={40} className="empty-icon" />
        <h3>No AI Execution Plan Yet</h3>
        <p>Go to the Actions panel and click <strong>"Build AI Execution Plan"</strong> to generate a strategic implementation document for your work packages.</p>
      </div>
    );
  }

  // Safely determine the active plan to prevent out-of-bounds crashes
  const safeIndex = activeIndex >= aiExecutionPlan.length ? 0 : activeIndex;
  const activePlan = aiExecutionPlan[safeIndex];

  if (!activePlan) return null;

  const handleExportPDF = async () => {
    const input = pdfExportRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20;

      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(`Stratigen AI — Strategic Implementation Document: ${activePlan.workPackageName}`, 20, 10);
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`AI-Execution-Plan-${activePlan.workPackageName.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF Export failed:', err);
    }
  };

  return (
    <div className="ai-exec-container animate-fade-in">
      {/* Sidebar Navigation */}
      <div className="ai-exec-sidebar">
        <div className="sidebar-header">
          <Layers size={14} />
          Selected Packages
        </div>
        <div className="sidebar-nav">
          {aiExecutionPlan.map((plan, idx) => (
            <div 
              key={plan.workPackageId}
              className={`sidebar-nav-item ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="nav-item-icon">
                {activeIndex === idx ? <ChevronRight size={14} /> : <div className="dot" />}
              </div>
              <span className="nav-item-text">{plan.workPackageName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ai-exec-main">
        <div className="main-header">
          <div className="header-info">
            <h1>{activePlan.workPackageName}</h1>
            <p className="strategic-context">
              <Info size={14} />
              {activePlan.strategicContext}
            </p>
          </div>
          <button className="export-btn" onClick={handleExportPDF}>
            <Download size={15} />
            Export to PDF
          </button>
        </div>

        <div className="main-scroll-area" ref={pdfExportRef}>
          {/* Implementation Roadmap (The "How-To") */}
          {activePlan.implementationRoadmap && (
            <div className="implementation-roadmap animate-fade-in">
              <div className="roadmap-header">
                <Activity size={20} />
                <h2>AI Implementation Blueprint</h2>
              </div>

              <div className="roadmap-grid">
                {/* Level 1: Copilot / ChatGPT Prompt */}
                <div className="roadmap-card level-1">
                  <div className="level-badge">Level 1</div>
                  <div className="card-top">
                    <Terminal size={18} />
                    <h3>Copilot / ChatGPT Prompt</h3>
                  </div>
                  <div className="card-description">
                    A structured, copy-paste prompt for MS Copilot or ChatGPT — ready to use immediately.
                  </div>
                  <div className="card-actions">
                    <button
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(1, activePlan.implementationRoadmap.level1.prompt || activePlan.implementationRoadmap.level1.title, activePlan.workPackageName, activePlan.strategicContext)}
                    >
                      Generate Prompt
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Level 2: Workflow Agent */}
                <div className="roadmap-card level-2">
                  <div className="level-badge">Level 2</div>
                  <div className="card-top">
                    <List size={18} />
                    <h3>Copilot Studio Workflow Agent</h3>
                  </div>
                  <div className="card-description">
                    A saveable multi-step workflow agent definition for MS Copilot Studio or Power Automate.
                  </div>
                  <div className="card-actions">
                    <button
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(2, activePlan.implementationRoadmap.level2.title, activePlan.workPackageName, activePlan.strategicContext)}
                    >
                      Generate Workflow
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Level 3: Autonomous Agent Builder */}
                <div className="roadmap-card level-3">
                  <div className="level-badge">Level 3</div>
                  <div className="card-top">
                    <Cpu size={18} />
                    <h3>Autonomous Agent Builder</h3>
                  </div>
                  <div className="card-description">
                    Full build instructions for Claude Desktop or OpenClaw to construct and deploy an autonomous agent.
                  </div>
                  <div className="card-actions">
                    <button
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(3, activePlan.implementationRoadmap.level3.agentRole || activePlan.implementationRoadmap.level3.title, activePlan.workPackageName, activePlan.strategicContext)}
                    >
                      Generate Agent Spec
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4-Dimensional Analysis Grid */}
          <div className="analysis-grid">
            <DimensionCard 
              title="Strategic" 
              icon={<Target size={18} />} 
              iconColor="#3ECF8E"
              data={activePlan.analysis.strategic} 
            />
            <DimensionCard 
              title="Legal" 
              icon={<Shield size={18} />} 
              iconColor="#3B82F6"
              data={activePlan.analysis.legal} 
            />
            <DimensionCard 
              title="Ethical" 
              icon={<Heart size={18} />} 
              iconColor="#EC4899"
              data={activePlan.analysis.ethical} 
            />
            <DimensionCard 
              title="Financial" 
              icon={<DollarSign size={18} />} 
              iconColor="#F59E0B"
              data={activePlan.analysis.financial} 
            />
          </div>

          {/* Execution Outlines */}
          <div className="execution-outlines">
            <OutlineSection 
              title="Strategic Decisions" 
              icon={<CheckSquare size={18} />} 
              items={activePlan.executionOutline.decisions} 
            />
            <OutlineSection 
              title="Technical Artefacts" 
              icon={<FileText size={18} />} 
              items={activePlan.executionOutline.artefacts} 
            />
            <OutlineSection 
              title="Enabling Technologies" 
              icon={<Server size={18} />} 
              items={activePlan.executionOutline.technologies} 
            />
            <OutlineSection 
              title="Data & Lineage" 
              icon={<Database size={18} />} 
              items={activePlan.executionOutline.dataRequirements} 
            />
          </div>
        </div>
      </div>

      {/* AI Spec Workspace Overlay */}
      {selectedSpec && <AISpecWorkspace spec={selectedSpec} onClose={actions.closeSpecWorkspace} />}
      {specLoading && (
        <div className="spec-loading-overlay">
          <div className="loading-content">
            <Cpu size={24} className="spin" />
            <p>Architecting Detailed AI Specification...</p>
          </div>
        </div>
      )}
    </div>
  );
}

const LEVEL_PLATFORM = {
  1: 'MS Copilot / ChatGPT',
  2: 'MS Copilot Studio',
  3: 'Claude Desktop / OpenClaw',
};

const LEVEL_TITLE = {
  1: 'Copilot / ChatGPT Prompt',
  2: 'Copilot Studio Workflow Agent',
  3: 'Autonomous Agent Builder Spec',
};

function AISpecWorkspace({ spec, onClose }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullPrompt = spec.fullPrompt || [
    `## Role\n${spec.role}`,
    `## Context\n${spec.context}`,
    `## Task\n${spec.task}`,
    `## Constraints\n${spec.constraints || spec.context}`,
    `## Output Format\n${spec.outputFormat || spec.formatStyle}`,
    `## Examples\n${spec.examples}`,
  ].join('\n\n');

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportMD = () => {
    const content = `# AI Prompt Spec: ${spec.wpName} — Level ${spec.level} (${LEVEL_TITLE[spec.level]})\n\n${fullPrompt}\n\n---\n*Generated by Stratigen AI Strategic Engine*`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Prompt-L${spec.level}-${spec.wpName.replace(/\s+/g, '-')}.md`;
    a.click();
  };

  return (
    <div className={`spec-workspace-overlay ${isFullScreen ? 'full-screen' : ''}`}>
      <div className="spec-workspace-content animate-slide-up">
        <div className="workspace-header">
          <div className="header-left">
            <span className={`level-badge-mini level-${spec.level}`}>Level {spec.level}</span>
            <div>
              <h2>{LEVEL_TITLE[spec.level]}</h2>
              <p className="workspace-platform">Target platform: <strong>{LEVEL_PLATFORM[spec.level]}</strong></p>
            </div>
          </div>
          <div className="header-actions">
            <button className="fs-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
              {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
              {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="workspace-scroll-area">
          {/* Prompt Structure Sections */}
          <div className="spec-grid">
            <div className="spec-section">
              <label><UserCheck size={12} /> Role (Persona)</label>
              <p>{spec.role}</p>
            </div>
            <div className="spec-section">
              <label><Info size={12} /> Context (Background)</label>
              <p>{spec.context}</p>
            </div>
            <div className="spec-section">
              <label><Target size={12} /> Task (Goal)</label>
              <p>{spec.task}</p>
            </div>
            <div className="spec-section">
              <label><Lock size={12} /> Constraints (Limits)</label>
              <p>{spec.constraints || spec.context}</p>
            </div>
            <div className="spec-section">
              <label><FileText size={12} /> Output Format (Style)</label>
              <p>{spec.outputFormat || spec.formatStyle}</p>
            </div>
            <div className="spec-section large">
              <label><Zap size={12} /> Examples (Few-Shot)</label>
              <div className="example-box">{spec.examples}</div>
            </div>
          </div>

          {/* Level 2: Workflow Steps */}
          {spec.level === 2 && spec.workflowSteps && spec.workflowSteps.length > 0 && (
            <div className="extra-section">
              <h3><List size={14} /> Workflow Steps — Save as Agent in {LEVEL_PLATFORM[2]}</h3>
              <div className="chain-list">
                {spec.workflowSteps.map((step, i) => (
                  <div key={i} className="chain-step">
                    <div className="step-tag">Step {step.stepNumber || i + 1}: {step.stepName}</div>
                    <pre>{step.stepPrompt}</pre>
                    {step.humanCheckpoint && (
                      <div className="hitl-badge">
                        <UserCheck size={11} /> Human checkpoint: {step.humanCheckpoint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 3: Agent Build Instructions */}
          {spec.level === 3 && (
            <div className="extra-section">
              <h3><Cpu size={14} /> Agent Build Instructions — {LEVEL_PLATFORM[3]}</h3>
              <div className="agent-config-card">
                {spec.tools && spec.tools.length > 0 && (
                  <div className="config-item">
                    <label>Required Tools &amp; Integrations</label>
                    <ul>{spec.tools.map((t, i) => <li key={i}>{t}</li>)}</ul>
                  </div>
                )}
                {spec.memoryStrategy && (
                  <div className="config-item">
                    <label>Memory Strategy</label>
                    <p>{spec.memoryStrategy}</p>
                  </div>
                )}
                {spec.escalationRules && spec.escalationRules.length > 0 && (
                  <div className="config-item">
                    <label>Escalation Rules (Human-in-the-Loop Triggers)</label>
                    <ul>{spec.escalationRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
                  </div>
                )}
                {spec.agentBuildInstructions && (
                  <div className="config-item">
                    <label>Step-by-Step Build Guide</label>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{spec.agentBuildInstructions}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Prompt Copy Box */}
          <div className="full-prompt-section">
            <div className="full-prompt-header">
              <h3><Clipboard size={14} /> Complete Prompt — ready to paste into {LEVEL_PLATFORM[spec.level]}</h3>
              <div className="prompt-actions">
                <button className="copy-prompt-btn" onClick={handleCopyPrompt}>
                  {copied ? <><CheckSquare size={14} /> Copied!</> : <><Clipboard size={14} /> Copy Full Prompt</>}
                </button>
                <button className="export-md-btn" onClick={handleExportMD}>
                  <Download size={14} /> Export .md
                </button>
              </div>
            </div>
            <pre className="full-prompt-box">{fullPrompt}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function DimensionCard({ title, icon, iconColor, data }) {
  return (
    <div className="dimension-card">
      <div className="dimension-header" style={{ color: iconColor }}>
        {icon}
        <h3>{title} Analysis</h3>
      </div>
      <div className="dimension-content">
        <div className="perspective">
          <label>Process</label>
          <p>{data.process}</p>
        </div>
        <div className="perspective">
          <label>People</label>
          <p>{data.people}</p>
        </div>
        <div className="perspective">
          <label>Technology</label>
          <p>{data.technology}</p>
        </div>
      </div>
    </div>
  );
}

function OutlineSection({ title, icon, items }) {
  return (
    <div className="outline-section">
      <div className="outline-header">
        {icon}
        <h3>{title}</h3>
      </div>
      <ul className="outline-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
