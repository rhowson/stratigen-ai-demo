import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
                {/* Level 1: Prompting */}
                <div className="roadmap-card">
                  <div className="level-badge">PHASE 01</div>
                  <div className="card-top">
                    <Terminal size={18} />
                    <h3>{activePlan.implementationRoadmap.level1.title}</h3>
                  </div>
                  <div className="card-description">
                    Ready-to-use prompt for immediate task execution. Optimized for direct LLM interaction.
                  </div>
                  <div className="card-actions">
                    <button 
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(1, activePlan.implementationRoadmap.level1.prompt, activePlan.workPackageName, activePlan.strategicContext, activePlan.workPackageId)}
                    >
                      <Zap size={13} />
                      Explore Blueprint
                    </button>
                    <button className="copy-mini-btn" onClick={() => navigator.clipboard.writeText(activePlan.implementationRoadmap.level1.prompt)} title="Copy Quick Prompt">
                      <Clipboard size={14} />
                    </button>
                  </div>
                </div>

                {/* Level 2: Workflow */}
                <div className="roadmap-card">
                  <div className="level-badge">PHASE 02</div>
                  <div className="card-top">
                    <List size={18} />
                    <h3>{activePlan.implementationRoadmap.level2.title}</h3>
                  </div>
                  <div className="card-description">
                    Multi-step workflow with human-in-the-loop governance and process controls.
                  </div>
                  <div className="card-actions">
                    <button 
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(2, activePlan.implementationRoadmap.level2.title, activePlan.workPackageName, activePlan.strategicContext, activePlan.workPackageId)}
                    >
                      <Zap size={13} />
                      Explore Blueprint
                    </button>
                  </div>
                </div>

                {/* Level 3: Agent */}
                <div className="roadmap-card">
                  <div className="level-badge">PHASE 03</div>
                  <div className="card-top">
                    <Cpu size={18} />
                    <h3>{activePlan.implementationRoadmap.level3.title}</h3>
                  </div>
                  <div className="card-description">
                    Autonomous agent with defined persona, resource access, and guardrail alignment.
                  </div>
                  <div className="card-actions">
                    <button 
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(3, activePlan.implementationRoadmap.level3.agentRole, activePlan.workPackageName, activePlan.strategicContext, activePlan.workPackageId)}
                    >
                      <Zap size={13} />
                      Explore Blueprint
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
              icon={<Shield size={18} />} 
              iconColor="#64748b"
              data={activePlan.analysis.ethical} 
            />
            <DimensionCard 
              title="Financial" 
              icon={<DollarSign size={18} />} 
              iconColor="#64748b"
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

function ObjectRenderer({ data }) {
  if (!data || typeof data !== 'object') return <p>{String(data)}</p>;
  return (
    <div className="spec-context-object">
      {Object.entries(data).map(([key, val]) => (
        <div key={key} className="context-entry">
          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> 
          <p>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</p>
        </div>
      ))}
    </div>
  );
}

function AISpecWorkspace({ spec, onClose }) {
  const [isFullScreen, setIsFullScreen] = useState(false);  const handleExportMD = () => {
    const content = `# AI Tactical Specification: ${spec.wpName} (Level ${spec.level})
    
## Role (Persona)
${spec.role}

## Context (Background)
${spec.context}

## Task (Goal)
${spec.task}

## Constraints (Limits)
${spec.constraints}

## Output Format (Style)
${spec.outputFormat}

## Examples (Few-Shot)
${typeof spec.examples === 'string' ? spec.examples : JSON.stringify(spec.examples, null, 2)}

---
*Generated by Stratigen AI Strategic Engine*`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Spec-${spec.wpName.replace(/\s+/g, '-')}.md`;
    a.click();
  };

  return createPortal(
    <div className={`spec-workspace-overlay ${isFullScreen ? 'full-screen' : ''}`}>
      <div className="spec-workspace-content animate-slide-up">
        <div className="workspace-header">
          <div className="header-left">
            {!isFullScreen && <span className={`level-badge-mini level-${spec.level}`}>Level {spec.level}</span>}
            {isFullScreen && (
              <button className="back-nav-btn" onClick={() => setIsFullScreen(false)}>
                <ChevronLeft size={16} />
                Back to Dashboard
              </button>
            )}
            <div className="header-titles">
              <h2>{isFullScreen ? spec.wpName : 'AI Tactical Specification'}</h2>
              <div className="platform-target">
                {spec.level === 1 && <span>Target: LLM Execution (e.g. MS Copilot)</span>}
                {spec.level === 2 && <span>Target: Workflow Builder (e.g. Copilot Agent)</span>}
                {spec.level === 3 && <span>Target: Agent Builder (e.g. OpenClaw)</span>}
              </div>
            </div>
          </div>
          <div className="header-actions">
            {!isFullScreen && (
              <button className="fs-btn" onClick={() => setIsFullScreen(true)}>
                <Maximize size={16} />
                Full Screen
              </button>
            )}
            <button className="close-btn" onClick={onClose} title="Close Specification">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="workspace-scroll-area">
          <div className="spec-grid">
            <div className="spec-section">
              <label><UserCheck size={12} /> Role (Persona)</label>
              <div className="spec-text-content">
                {typeof spec.role === 'string' ? <p>{spec.role}</p> : <ObjectRenderer data={spec.role} />}
              </div>
            </div>
            <div className="spec-section">
              <label><Target size={12} /> Task (Goal)</label>
              <div className="spec-text-content">
                {typeof spec.task === 'string' ? <p>{spec.task}</p> : <ObjectRenderer data={spec.task} />}
              </div>
            </div>
            <div className="spec-section large">
              <label><Info size={12} /> Context (Background)</label>
              <div className="spec-text-content">
                {typeof spec.context === 'string' ? <p>{spec.context}</p> : <ObjectRenderer data={spec.context} />}
              </div>
            </div>
            <div className="spec-section large">
              <label><Shield size={12} /> Constraints (Limits)</label>
              <div className="spec-text-content">
                {typeof spec.constraints === 'string' ? <p>{spec.constraints}</p> : <ObjectRenderer data={spec.constraints} />}
              </div>
            </div>
            <div className="spec-section">
              <label><FileText size={12} /> Output Format (Style)</label>
              <div className="spec-text-content">
                {typeof spec.outputFormat === 'string' ? <p>{spec.outputFormat}</p> : <ObjectRenderer data={spec.outputFormat} />}
              </div>
            </div>
            <div className="spec-section">
              <label><Zap size={12} /> Examples (Few-Shot)</label>
              <div className="spec-text-content">
                {typeof spec.examples === 'string' ? (
                  <div className="example-box">{spec.examples}</div>
                ) : (
                  <div className="example-box">{JSON.stringify(spec.examples, null, 2)}</div>
                )}
              </div>
            </div>

            <div className="spec-action-section">
              <button className="export-md-btn" onClick={handleExportMD}>
                <Download size={14} />
                Export Markdown Spec (.md)
              </button>
              <p className="export-hint">Optimised for LLMs, Workflow Builders, and Agent Platforms</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
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
