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
  Clipboard
} from 'react-feather';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './AIExecutionView.css';

export default function AIExecutionView() {
  const { state } = useApp();
  const { aiExecutionPlan, execLoading, execProgress } = state;
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
                <div className="roadmap-card level-1">
                  <div className="level-badge">Level 1</div>
                  <div className="card-top">
                    <Terminal size={18} />
                    <h3>{activePlan.implementationRoadmap.level1.title}</h3>
                  </div>
                  <div className="prompt-container">
                    <div className="prompt-label">Engine Prompt</div>
                    <pre className="prompt-text">{activePlan.implementationRoadmap.level1.prompt}</pre>
                    <button className="copy-prompt-btn" onClick={() => navigator.clipboard.writeText(activePlan.implementationRoadmap.level1.prompt)}>
                      <Clipboard size={12} />
                      Copy Prompt
                    </button>
                  </div>
                </div>

                {/* Level 2: Workflow */}
                <div className="roadmap-card level-2">
                  <div className="level-badge">Level 2</div>
                  <div className="card-top">
                    <List size={18} />
                    <h3>{activePlan.implementationRoadmap.level2.title}</h3>
                  </div>
                  <div className="workflow-steps">
                    {activePlan.implementationRoadmap.level2.steps.map((step, i) => (
                      <div key={i} className="workflow-step">
                        <div className="step-num">{i + 1}</div>
                        <div className="step-info">
                          <div className="step-task">{step.task}</div>
                          <div className="step-hitl">
                            <UserCheck size={10} />
                            Governance: {step.hitl}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level 3: Agent */}
                <div className="roadmap-card level-3">
                  <div className="level-badge">Level 3</div>
                  <div className="card-top">
                    <Cpu size={18} />
                    <h3>{activePlan.implementationRoadmap.level3.title}</h3>
                  </div>
                  <div className="agent-details">
                    <div className="agent-persona">
                      <label>Autonomous Role</label>
                      <p>{activePlan.implementationRoadmap.level3.agentRole}</p>
                    </div>
                    <div className="agent-tasks">
                      <label>Key Responsibilities</label>
                      <ul>
                        {activePlan.implementationRoadmap.level3.keyTasks.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    <div className="agent-intervention">
                      <label>Human Intervention</label>
                      <p>{activePlan.implementationRoadmap.level3.intervention}</p>
                    </div>
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
