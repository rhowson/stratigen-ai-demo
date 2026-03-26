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
  X,
  Hexagon
} from 'react-feather';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  BorderStyle,
  PageBreak,
  TableOfContents,
  ShadingType,
  VerticalAlign,
  Header,
  Footer,
  ExternalHyperlink
} from 'docx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import './AIExecutionView.css';

export default function AIExecutionView() {
  const { state, actions } = useApp();
  const { aiExecutionPlan, execLoading, execProgress, selectedSpec, specLoading } = state;
  const [activeIndex, setActiveIndex] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const pdfExportRef = useRef();

  if (execLoading) {
    return (
      <div className="ai-exec-loading">
        <div className="loading-content">
          <div className="loading-icon-wrap">
            <Hexagon size={32} className="pulsing-icon" />
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

  const safeIndex = activeIndex >= aiExecutionPlan.length ? 0 : activeIndex;
  const activePlan = aiExecutionPlan[safeIndex];

  if (!activePlan) return null;

  const handleExportWord = async () => {
    setExportLoading(true);
    try {
      // 1. Get the AI-rebuilt blueprint
      const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';
      const res = await fetch(`${API_BASE}/api/generate-export-blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: state.company?.name,
          companyProfile: state.companyProfile,
          aiExecutionPlan,
          objectives: state.objectives
        }),
      });
      const { success, blueprint } = await res.json();
      if (!success) throw new Error('Failed to synthesize blueprint');

      const sections = [];

      // Cover Page
      sections.push({
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 4000 }, children: [
            new TextRun({ text: "STRATIGEN ", bold: true, color: "0f172a", size: 28 }),
            new TextRun({ text: "AI", bold: true, color: "10b981", size: 28 })
          ]}),
          new Paragraph({ text: blueprint.docTitle, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 400, after: 800 } }),
          new Paragraph({ text: state.company?.name || "Refining Excellence", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER, spacing: { after: 2000 } }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: `Generated on ${new Date().toLocaleDateString('en-GB')}`, color: "64748b" }),
            new TextRun({ text: "\nProprietary & Confidential", italics: true, color: "64748b" })
          ]}),
          new Paragraph({ children: [new PageBreak()] })
        ]
      });

      // Executive Summary
      sections.push({
        children: [
          new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 400 } }),
          new Paragraph({ text: blueprint.executiveSummary, spacing: { bottom: 800 } }),
          new Paragraph({ children: [new PageBreak()] })
        ]
      });

      // Chapters
      blueprint.chapters.forEach((chapter) => {
        const children = [
          new Paragraph({ text: chapter.title, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 400 } }),
          new Paragraph({ text: chapter.summary, italics: true, spacing: { bottom: 400 } }),
        ];

        chapter.sections.forEach(section => {
          children.push(new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }));
          
          if (section.type === 'specification') {
            children.push(new Paragraph({ children: [new TextRun({ text: "AI Agent Specification", bold: true, color: "10b981" })] }));
            children.push(new Paragraph({
              children: [new TextRun({ text: section.specContent.fullPrompt, size: 18, font: "Courier New", color: "1e293b" })],
              shading: { fill: "f1f5f9", type: ShadingType.SOLID },
              border: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" }
              },
              spacing: { before: 200, after: 400 }
            }));
          } else {
            children.push(new Paragraph({ text: section.content, spacing: { bottom: 400 } }));
          }
        });

        children.push(new Paragraph({ children: [new PageBreak()] }));
        sections.push({ children });
      });

      const doc = new Document({
        styles: { paragraphStyles: [{ id: "Normal", name: "Normal", run: { font: "Calibri", size: 22, color: "334155" } }] },
        sections
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Stratigen-Blueprint-${state.company?.name || 'Solution'}.docx`);
    } catch (err) {
      console.error('Word Export failed:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExportLoading(true);
    try {
      const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';
      const res = await fetch(`${API_BASE}/api/generate-export-blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: state.company?.name,
          companyProfile: state.companyProfile,
          aiExecutionPlan,
          objectives: state.objectives
        }),
      });
      const { success, blueprint } = await res.json();
      if (!success) throw new Error('Failed to synthesize blueprint');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let cursorY = 40;

      const addPageIfNeeded = (heightNeeded) => {
        if (cursorY + heightNeeded > pageHeight - margin) {
          pdf.addPage();
          cursorY = margin;
          return true;
        }
        return false;
      };

      // 1. Cover Page
      pdf.setFillColor(15, 23, 42); // #0f172a
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text("STRATIGEN AI", pageWidth / 2, 80, { align: 'center' });
      pdf.setFontSize(28);
      pdf.text(blueprint.docTitle, pageWidth / 2, 100, { align: 'center', maxWidth: contentWidth });
      pdf.setFontSize(18);
      pdf.text(state.company?.name || "Refining Excellence", pageWidth / 2, 130, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184); // #94a3b8
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 250, { align: 'center' });
      pdf.text("Proprietary & Confidential", pageWidth / 2, 260, { align: 'center' });

      // 2. Content Pages
      pdf.addPage();
      pdf.setFillColor(255, 255, 255); // Reset fill color to white for content pages
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setTextColor(15, 23, 42);
      cursorY = margin;

      // Executive Summary
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Executive Summary", margin, cursorY);
      cursorY += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const summaryLines = pdf.splitTextToSize(blueprint.executiveSummary, contentWidth);
      pdf.text(summaryLines, margin, cursorY);
      cursorY += (summaryLines.length * 5) + 15;

      // Chapters
      blueprint.chapters.forEach(chapter => {
        addPageIfNeeded(20);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(chapter.title, margin, cursorY);
        cursorY += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 116, 139);
        pdf.text(chapter.summary, margin, cursorY);
        cursorY += 12;
        pdf.setTextColor(15, 23, 42);

        chapter.sections.forEach(section => {
          addPageIfNeeded(15);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(section.heading, margin, cursorY);
          cursorY += 8;

          if (section.type === 'specification') {
            pdf.setFontSize(10);
            pdf.setFont('courier', 'normal');
            pdf.setFillColor(241, 245, 249); // #f1f5f9
            
            const promptLines = pdf.splitTextToSize(section.specContent.fullPrompt, contentWidth - 10);
            const promptHeight = (promptLines.length * 4) + 10;
            
            // Handle cross-page prompt blocks
            let lineIdx = 0;
            while (lineIdx < promptLines.length) {
              const linesLeft = promptLines.length - lineIdx;
              const spaceLeft = (pageHeight - margin - cursorY) / 4;
              const linesToPrint = Math.max(1, Math.min(linesLeft, Math.floor(spaceLeft - 2)));
              
              const blockHeight = (linesToPrint * 4) + 6;
              pdf.rect(margin - 2, cursorY - 4, contentWidth + 4, blockHeight, 'F');
              pdf.text(promptLines.slice(lineIdx, lineIdx + linesToPrint), margin + 1, cursorY);
              
              lineIdx += linesToPrint;
              cursorY += blockHeight + 2;
              
              if (lineIdx < promptLines.length) {
                pdf.addPage();
                cursorY = margin + 10;
              }
            }
            cursorY += 10;
          } else {
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            const lines = pdf.splitTextToSize(section.content, contentWidth);
            
            // Handle cross-page text
            let lineIdx = 0;
            while (lineIdx < lines.length) {
              const linesLeft = lines.length - lineIdx;
              const spaceLeft = (pageHeight - margin - cursorY) / 5;
              const linesToPrint = Math.max(1, Math.min(linesLeft, Math.floor(spaceLeft)));
              
              pdf.text(lines.slice(lineIdx, lineIdx + linesToPrint), margin, cursorY);
              lineIdx += linesToPrint;
              cursorY += (linesToPrint * 5);
              
              if (lineIdx < lines.length) {
                pdf.addPage();
                cursorY = margin;
              }
            }
            cursorY += 10;
          }
        });
      });

      pdf.save(`Stratigen-Blueprint-${state.company?.name || 'Solution'}.pdf`);
    } catch (err) {
      console.error('PDF Export failed:', err);
    } finally {
      setExportLoading(false);
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
            <div className="header-actions">
              <button 
                className={`action-btn secondary ${exportLoading ? 'loading' : ''}`}
                onClick={handleExportWord}
                disabled={exportLoading}
              >
                {exportLoading ? <Zap className="animate-pulse" size={14} /> : <FileText size={14} />}
                {exportLoading ? 'Refining...' : 'Export Word'}
              </button>
              <button 
                className={`action-btn primary ${exportLoading ? 'loading' : ''}`}
                onClick={handleExportPDF}
                disabled={exportLoading}
              >
                {exportLoading ? <Zap className="animate-pulse" size={14} /> : <Download size={14} />}
                {exportLoading ? 'Blueprint...' : 'Export PDF'}
              </button>
            </div>
        </div>

        <div className="main-scroll-area" ref={pdfExportRef}>
          {/* Implementation Roadmap (The "How-To") */}
          {activePlan.implementationRoadmap && (
            <div className="implementation-roadmap animate-fade-in">
              <div className="roadmap-header">
                <Hexagon size={20} />
                <h2>AI Implementation Blueprint</h2>
              </div>

              <div className="roadmap-grid">
                {/* Level 1: Copilot / ChatGPT Prompt */}
                <div className="roadmap-card level-1">
                  <div className="level-badge">Level 1</div>
                  <div className="card-top">
                    <Hexagon size={18} />
                    <h3>Copilot / ChatGPT Prompt</h3>
                  </div>
                  <div className="card-description">
                    A structured, copy-paste prompt for MS Copilot or ChatGPT — ready to use immediately.
                  </div>
                  <div className="card-actions">
                    <button
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(1, activePlan.implementationRoadmap.level1.prompt || activePlan.implementationRoadmap.level1.title, activePlan.workPackageName, activePlan.strategicContext, activePlan.workPackageId)}
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
                    <Hexagon size={18} />
                    <h3>Copilot Studio Workflow Agent</h3>
                  </div>
                  <div className="card-description">
                    A saveable multi-step workflow agent definition for MS Copilot Studio or Power Automate.
                  </div>
                  <div className="card-actions">
                    <button
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(2, activePlan.implementationRoadmap.level2.title, activePlan.workPackageName, activePlan.strategicContext, activePlan.workPackageId)}
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
                    <Hexagon size={18} />
                    <h3>Autonomous Agent Builder</h3>
                  </div>
                  <div className="card-description">
                    Full build instructions for Claude Desktop or OpenClaw to construct and deploy an autonomous agent.
                  </div>
                  <div className="card-actions">
                    <button
                      className="explore-btn"
                      onClick={() => actions.generateAISpec(3, activePlan.implementationRoadmap.level3.agentRole || activePlan.implementationRoadmap.level3.title, activePlan.workPackageName, activePlan.strategicContext, activePlan.workPackageId)}
                    >
                      Generate Agent Spec
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Spec Workspace Overlay */}
      {selectedSpec && <AISpecWorkspace spec={selectedSpec} onClose={actions.closeSpecWorkspace} actions={actions} />}
      {specLoading && (
        <div className="spec-loading-overlay">
          <div className="loading-content">
            <Cpu size={24} className="spin" />
            <p>Architecting Detailed AI Specification...</p>
          </div>
        </div>
      )}

      {exportLoading && (
        <div className="export-overlay">
          <div className="export-status-card">
            <Hexagon className="animate-spin-slow" size={32} color="#10b981" />
            <h2>Synthesizing Strategic Blueprint</h2>
            <p>Our AI is rebuilding your plan into a professional boardroom-ready document.</p>
            <div className="export-progress-bar">
              <div className="progress-fill animate-shimmer"></div>
            </div>
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

function AISpecWorkspace({ spec, onClose, actions }) {
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

  const handleExportWordSpec = async () => {
    try {
      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "Normal",
              name: "Normal",
              run: { font: "Calibri", size: 22, color: "334155" }
            }
          ]
        },
        sections: [{
          children: [
            new Paragraph({ 
              children: [
                new TextRun({ text: "STRATIGEN ", bold: true, color: "0f172a", size: 24 }),
                new TextRun({ text: "AI", bold: true, color: "10b981", size: 24 })
              ],
              spacing: { after: 400 }
            }),
            new Paragraph({ text: `${LEVEL_TITLE[spec.level]} Specification`, heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: spec.wpName, heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
            new Paragraph({ text: `Target Platform: ${LEVEL_PLATFORM[spec.level]}`, spacing: { after: 600 } }),
            
            new Paragraph({ text: "Strategic Value & Decision Logic", heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ 
                      children: [new Paragraph({ text: "Dimension", bold: true, color: "FFFFFF" })], 
                      shading: { fill: "0f172a", type: ShadingType.SOLID }
                    }),
                    new TableCell({ 
                      children: [new Paragraph({ text: "Executive Analysis", bold: true, color: "FFFFFF" })], 
                      shading: { fill: "0f172a", type: ShadingType.SOLID }
                    }),
                  ]
                }),
                ...['strategic', 'financial', 'ethical', 'legal'].map(dim => (
                  new TableRow({
                    children: [
                      new TableCell({ 
                        children: [new Paragraph({ text: dim.charAt(0).toUpperCase() + dim.slice(1), bold: true })],
                        shading: { fill: "f8fafc", type: ShadingType.SOLID }
                      }),
                      new TableCell({ children: [new Paragraph(spec.tailoredAnalysis?.[dim] || "Strategic alignment verified.")] }),
                    ]
                  })
                ))
              ]
            }),

            new Paragraph({ text: "Strategic AI Specification (Prompt)", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            new Paragraph({
              children: [new TextRun({ text: fullPrompt, size: 18, font: "Courier New", color: "1e293b" })],
              shading: { fill: "f1f5f9", type: ShadingType.SOLID },
              border: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" }
              }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 1000 },
              children: [
                new TextRun({ text: "Generated by Stratigen AI Engine — Confidential Document", size: 16, italics: true, color: "64748b" })
              ]
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI-Prompt-L${spec.level}-${spec.wpName.replace(/\s+/g, '-')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Spec Word Export failed:', err);
    }
  };

  return createPortal(
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
            <button 
              className="regen-btn" 
              onClick={() => actions.generateAISpec(spec.level, spec.suggestion, spec.wpName, spec.context, spec.wpId, true)}
              title="Regenerate this specification with a fresh AI analysis"
            >
              <Hexagon size={15} />
              Regenerate
            </button>
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
          <div className="strategic-doc-container animate-fade-in">
            <div className="strategic-doc-paper" id="strategic-doc-paper-capture">
              {/* Document Header */}
              <div className="doc-section doc-header-info">
                <div className="doc-label">Strategic implementation Document</div>
                <h1>{LEVEL_TITLE[spec.level]}</h1>
                <p className="doc-wp-name">{spec.wpName}</p>
              </div>

              {/* Context & Objective */}
              <div className="doc-section doc-context">
                <h3><Hexagon size={16} /> Objective & Problem Resolution</h3>
                <p>{spec.context}</p>
              </div>

              {/* Tailored Strategic Analysis (Level-Specific) */}
              {spec.tailoredAnalysis && (
                <div className="doc-section doc-tailored-analysis">
                  <h3><Shield size={16} /> Strategic Compliance & Value Logic</h3>
                  <div className="analysis-card-row">
                    <div className="analysis-mini-card">
                      <div className="mini-card-header"><Target size={14} /> Strategic</div>
                      <p>{spec.tailoredAnalysis.strategic}</p>
                    </div>
                    <div className="analysis-mini-card">
                      <div className="mini-card-header"><DollarSign size={14} /> Financial</div>
                      <p>{spec.tailoredAnalysis.financial}</p>
                    </div>
                    <div className="analysis-mini-card">
                      <div className="mini-card-header"><Hexagon size={14} /> Ethical</div>
                      <p>{spec.tailoredAnalysis.ethical}</p>
                    </div>
                    <div className="analysis-mini-card">
                      <div className="mini-card-header"><Shield size={14} /> Legal</div>
                      <p>{spec.tailoredAnalysis.legal}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* The Core Specification */}
              <div className="doc-section doc-content-main">
                <div className="doc-content-header">
                  <h3><Hexagon size={16} /> Strategic AI Guardrails & Prompt</h3>
                  <div className="doc-actions-inline">
                    <button className="copy-doc-btn" onClick={handleCopyPrompt}>
                      {copied ? <CheckSquare size={14} /> : <Clipboard size={14} />}
                      {copied ? 'Copied' : 'Copy Prompt'}
                    </button>
                    <button className="export-doc-btn docx" onClick={handleExportWordSpec}>
                      <FileText size={14} />
                      .DOCX
                    </button>
                    <button className="export-doc-btn" onClick={handleExportMD}>
                      <Download size={14} />
                      .MD
                    </button>
                  </div>
                </div>
                
                <div className="prompt-display">
                  <div className="prompt-segment">
                    <label>Role & Identity</label>
                    <p>{typeof spec.role === 'object' ? JSON.stringify(spec.role, null, 2) : spec.role}</p>
                  </div>
                  <div className="prompt-segment">
                    <label>Primary Task & Goal</label>
                    <p>{typeof spec.task === 'object' ? JSON.stringify(spec.task, null, 2) : spec.task}</p>
                  </div>
                  <div className="prompt-segment">
                    <label>Guardrails & Constraints</label>
                    <p>{typeof (spec.constraints || spec.context) === 'object' 
                      ? JSON.stringify(spec.constraints || spec.context, null, 2) 
                      : (spec.constraints || spec.context)}</p>
                  </div>
                  <div className="prompt-segment">
                    <label>Structural Output Format</label>
                    <p>{typeof (spec.outputFormat || spec.formatStyle) === 'object'
                      ? JSON.stringify(spec.outputFormat || spec.formatStyle, null, 2)
                      : (spec.outputFormat || spec.formatStyle)}</p>
                  </div>
                </div>
              </div>

              {/* Level 2: Workflow Steps */}
              {spec.level === 2 && spec.workflowSteps && spec.workflowSteps.length > 0 && (
                <div className="doc-section doc-extra">
                  <h3><Hexagon size={16} /> Multi-Step Process Logic</h3>
                  <div className="doc-chain-list">
                    {spec.workflowSteps.map((step, i) => (
                      <div key={i} className="doc-chain-step">
                        <div className="step-count">Step {step.stepNumber || i + 1}</div>
                        <div className="step-name">{step.stepName}</div>
                        <p>{step.stepPrompt}</p>
                        {step.humanCheckpoint && (
                          <div className="doc-hitl">
                            <strong>Human Checkpoint:</strong> {step.humanCheckpoint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Level 3: Agent Build Instructions */}
              {spec.level === 3 && (
                <div className="doc-section doc-extra">
                  <h3><Hexagon size={16} /> Agent Configuration Logic</h3>
                  <div className="agent-config-grid">
                    <div className="config-box">
                      <label>Required Integrations</label>
                      <ul>{spec.tools?.map((t, i) => <li key={i}>{t}</li>)}</ul>
                    </div>
                    <div className="config-box">
                      <label>Knowledge Retention</label>
                      <p>{spec.memoryStrategy}</p>
                    </div>
                  </div>
                  <div className="agent-build-guide">
                    <label>Step-by-Step Deployment</label>
                    <pre>{spec.agentBuildInstructions}</pre>
                  </div>
                </div>
              )}

              {/* Examples Section */}
              {spec.examples && (
                <div className="doc-section doc-examples">
                  <h3><Hexagon size={16} /> Strategic Examples</h3>
                  <div className="prompt-segment">
                    <p>{typeof spec.examples === 'object' ? JSON.stringify(spec.examples, null, 2) : spec.examples}</p>
                  </div>
                </div>
              )}

              {/* Raw Prompt Section */}
              <div className="doc-section doc-raw-prompt">
                <div className="doc-content-header">
                  <h3><Hexagon size={16} /> Complete Prompt (Raw)</h3>
                </div>
                <pre className="doc-raw-box">{fullPrompt}</pre>
              </div>
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
