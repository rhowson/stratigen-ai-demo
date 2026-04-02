// Stratigen AI — Recruitment Industry Model
// Complete L0–L2 capability hierarchy with benchmarks, KPIs, and AI patterns

export const INDUSTRY_ID = 'recruitment-services';
export const INDUSTRY_NAME = 'Recruitment Services';

// ─── Capability Model (L0 → L1 → L2) ─────────────────────────────
export const capabilityModel = [
  {
    id: 'client-acquisition',
    name: 'Client Acquisition & Sales',
    icon: '🎯',
    l1: [
      {
        id: 'lead-generation', name: 'Lead Generation',
        l2: [
          { id: 'market-research', name: 'Market Research & Targeting' },
          { id: 'lead-qualification', name: 'Lead Qualification' },
          { id: 'pipeline-management', name: 'Pipeline Management' },
        ]
      },
      {
        id: 'client-outreach', name: 'Client Outreach',
        l2: [
          { id: 'cold-outreach', name: 'Cold Outreach Campaigns' },
          { id: 'relationship-building', name: 'Relationship Building' },
          { id: 'networking', name: 'Networking & Events' },
        ]
      },
      {
        id: 'proposal-management', name: 'Proposal Management',
        l2: [
          { id: 'rfp-response', name: 'RFP/RFI Response' },
          { id: 'pricing-strategy', name: 'Pricing Strategy' },
          { id: 'contract-negotiation', name: 'Contract Negotiation' },
        ]
      },
    ]
  },
  {
    id: 'candidate-sourcing',
    name: 'Candidate Sourcing & Management',
    icon: '👥',
    l1: [
      {
        id: 'cv-screening', name: 'CV Screening',
        l2: [
          { id: 'resume-parsing', name: 'Resume Parsing & Extraction' },
          { id: 'skills-matching', name: 'Skills Matching' },
          { id: 'shortlisting', name: 'Shortlisting' },
        ]
      },
      {
        id: 'talent-pooling', name: 'Talent Pooling',
        l2: [
          { id: 'database-management', name: 'Candidate Database Management' },
          { id: 'talent-pipelining', name: 'Talent Pipelining' },
          { id: 'alumni-tracking', name: 'Alumni & Redeployment Tracking' },
        ]
      },
      {
        id: 'candidate-engagement', name: 'Candidate Engagement',
        l2: [
          { id: 'communication-mgmt', name: 'Communication Management' },
          { id: 'experience-design', name: 'Candidate Experience Design' },
          { id: 'feedback-loops', name: 'Feedback Loops' },
        ]
      },
    ]
  },
  {
    id: 'matching-placement',
    name: 'Matching & Placement',
    icon: '🔗',
    l1: [
      {
        id: 'job-matching', name: 'Job Matching',
        l2: [
          { id: 'requirement-analysis', name: 'Requirement Analysis' },
          { id: 'candidate-ranking', name: 'Candidate Ranking' },
          { id: 'culture-fit', name: 'Culture Fit Assessment' },
        ]
      },
      {
        id: 'interview-coordination', name: 'Interview Coordination',
        l2: [
          { id: 'scheduling', name: 'Interview Scheduling' },
          { id: 'panel-management', name: 'Panel Management' },
          { id: 'interview-feedback', name: 'Interview Feedback Collection' },
        ]
      },
      {
        id: 'offer-management', name: 'Offer Management',
        l2: [
          { id: 'offer-generation', name: 'Offer Generation' },
          { id: 'negotiation-support', name: 'Negotiation Support' },
          { id: 'acceptance-tracking', name: 'Acceptance Tracking' },
        ]
      },
    ]
  },
  {
    id: 'delivery-fulfilment',
    name: 'Delivery & Fulfilment',
    icon: '📦',
    l1: [
      {
        id: 'onboarding', name: 'Candidate Onboarding',
        l2: [
          { id: 'documentation', name: 'Documentation & Compliance Checks' },
          { id: 'induction', name: 'Induction Planning' },
          { id: 'first-day-readiness', name: 'First Day Readiness' },
        ]
      },
      {
        id: 'placement-tracking', name: 'Placement Tracking',
        l2: [
          { id: 'start-confirmation', name: 'Start Date Confirmation' },
          { id: 'retention-monitoring', name: 'Retention Monitoring' },
          { id: 'replacement-guarantee', name: 'Replacement Guarantee Tracking' },
        ]
      },
      {
        id: 'client-satisfaction', name: 'Client Satisfaction',
        l2: [
          { id: 'quality-reviews', name: 'Quality Reviews' },
          { id: 'nps-tracking', name: 'NPS & Satisfaction Scoring' },
          { id: 'account-reviews', name: 'Account Reviews' },
        ]
      },
    ]
  },
  {
    id: 'contractor-management',
    name: 'Contractor / Temp Management',
    icon: '⏱️',
    l1: [
      {
        id: 'contractor-onboarding', name: 'Contractor Onboarding',
        l2: [
          { id: 'ir35-assessment', name: 'IR35 / Employment Status Assessment' },
          { id: 'contract-issuance', name: 'Contract Issuance' },
          { id: 'right-to-work', name: 'Right to Work Verification' },
        ]
      },
      {
        id: 'assignment-management', name: 'Assignment Management',
        l2: [
          { id: 'extension-management', name: 'Extension Management' },
          { id: 'performance-monitoring', name: 'Performance Monitoring' },
          { id: 'issue-resolution', name: 'Issue Resolution' },
        ]
      },
      {
        id: 'offboarding', name: 'Offboarding',
        l2: [
          { id: 'exit-process', name: 'Exit Process Management' },
          { id: 'equipment-return', name: 'Equipment Return' },
          { id: 'reference-collection', name: 'Reference Collection' },
        ]
      },
    ]
  },
  {
    id: 'finance-billing',
    name: 'Finance & Billing',
    icon: '💰',
    l1: [
      {
        id: 'timesheet-processing', name: 'Timesheet Processing',
        l2: [
          { id: 'timesheet-capture', name: 'Timesheet Capture & Approval' },
          { id: 'timesheet-validation', name: 'Timesheet Validation' },
          { id: 'overtime-management', name: 'Overtime & Adjustment Management' },
        ]
      },
      {
        id: 'invoice-generation', name: 'Invoice Generation',
        l2: [
          { id: 'billing-rules', name: 'Billing Rules Engine' },
          { id: 'invoice-creation', name: 'Invoice Creation & Dispatch' },
          { id: 'credit-notes', name: 'Credit Note Management' },
        ]
      },
      {
        id: 'revenue-recognition', name: 'Revenue Recognition',
        l2: [
          { id: 'fee-calculation', name: 'Fee Calculation' },
          { id: 'accruals', name: 'Accruals & Deferrals' },
          { id: 'margin-analysis', name: 'Margin Analysis' },
        ]
      },
    ]
  },
  {
    id: 'compliance-risk',
    name: 'Compliance & Risk',
    icon: '🛡️',
    l1: [
      {
        id: 'regulatory-compliance', name: 'Regulatory Compliance',
        l2: [
          { id: 'gdpr-data', name: 'GDPR & Data Protection' },
          { id: 'employment-law', name: 'Employment Law Compliance' },
          { id: 'industry-regulations', name: 'Industry-Specific Regulations' },
        ]
      },
      {
        id: 'risk-management', name: 'Risk Management',
        l2: [
          { id: 'client-risk', name: 'Client Credit Risk' },
          { id: 'operational-risk', name: 'Operational Risk Assessment' },
          { id: 'insurance-mgmt', name: 'Insurance Management' },
        ]
      },
      {
        id: 'audit-governance', name: 'Audit & Governance',
        l2: [
          { id: 'internal-audit', name: 'Internal Audit' },
          { id: 'policy-management', name: 'Policy Management' },
          { id: 'reporting-obligations', name: 'Reporting Obligations' },
        ]
      },
    ]
  },
  {
    id: 'back-office',
    name: 'Back Office Operations',
    icon: '🏢',
    l1: [
      {
        id: 'hr-internal', name: 'Internal HR',
        l2: [
          { id: 'staff-recruitment', name: 'Staff Recruitment' },
          { id: 'training-dev', name: 'Training & Development' },
          { id: 'performance-mgmt', name: 'Performance Management' },
        ]
      },
      {
        id: 'facilities-admin', name: 'Facilities & Administration',
        l2: [
          { id: 'office-management', name: 'Office Management' },
          { id: 'procurement', name: 'Procurement' },
          { id: 'vendor-management', name: 'Vendor Management' },
        ]
      },
      {
        id: 'it-support', name: 'IT Support',
        l2: [
          { id: 'helpdesk', name: 'Helpdesk & Support' },
          { id: 'infrastructure', name: 'Infrastructure Management' },
          { id: 'security', name: 'Cybersecurity' },
        ]
      },
    ]
  },
  {
    id: 'data-analytics',
    name: 'Data & Analytics',
    icon: '📊',
    l1: [
      {
        id: 'reporting', name: 'Reporting',
        l2: [
          { id: 'operational-reporting', name: 'Operational Reporting' },
          { id: 'financial-reporting', name: 'Financial Reporting' },
          { id: 'client-reporting', name: 'Client Reporting' },
        ]
      },
      {
        id: 'analytics', name: 'Advanced Analytics',
        l2: [
          { id: 'predictive-analytics', name: 'Predictive Analytics' },
          { id: 'market-intelligence', name: 'Market Intelligence' },
          { id: 'performance-analytics', name: 'Performance Analytics' },
        ]
      },
      {
        id: 'data-management', name: 'Data Management',
        l2: [
          { id: 'data-quality', name: 'Data Quality & Cleansing' },
          { id: 'data-integration', name: 'Data Integration' },
          { id: 'master-data', name: 'Master Data Management' },
        ]
      },
    ]
  },
  {
    id: 'technology-platforms',
    name: 'Technology Platforms',
    icon: '⚙️',
    l1: [
      {
        id: 'ats-crm', name: 'ATS / CRM',
        l2: [
          { id: 'ats-management', name: 'ATS Configuration & Management' },
          { id: 'crm-management', name: 'CRM Configuration & Management' },
          { id: 'system-integration', name: 'System Integration' },
        ]
      },
      {
        id: 'digital-channels', name: 'Digital Channels',
        l2: [
          { id: 'website-portal', name: 'Website & Portal Management' },
          { id: 'job-boards', name: 'Job Board Integration' },
          { id: 'social-media', name: 'Social Media Integration' },
        ]
      },
      {
        id: 'automation-tools', name: 'Automation Tools',
        l2: [
          { id: 'workflow-automation', name: 'Workflow Automation' },
          { id: 'rpa', name: 'RPA Implementation' },
          { id: 'ai-tools', name: 'AI/ML Tools' },
        ]
      },
    ]
  },
];

// ─── Benchmark Profiles ─────────────────────────────────────────
// maturity scale: 1 = Initial, 2 = Developing, 3 = Defined, 4 = Managed, 5 = Optimised
export const benchmarkProfiles = {};
capabilityModel.forEach(l0 => {
  l0.l1.forEach(l1 => {
    l1.l2.forEach(l2 => {
      benchmarkProfiles[l2.id] = {
        industryBaseline: Math.floor(Math.random() * 2) + 2, // 2–3
        bestInClass: Math.floor(Math.random() * 1) + 4, // 4–5
      };
    });
  });
});

// Fix seed for consistency
const benchmarkSeeds = {
  'market-research': { industryBaseline: 3, bestInClass: 5 },
  'lead-qualification': { industryBaseline: 2, bestInClass: 4 },
  'pipeline-management': { industryBaseline: 2, bestInClass: 5 },
  'cold-outreach': { industryBaseline: 3, bestInClass: 5 },
  'relationship-building': { industryBaseline: 3, bestInClass: 5 },
  'networking': { industryBaseline: 3, bestInClass: 4 },
  'rfp-response': { industryBaseline: 2, bestInClass: 4 },
  'pricing-strategy': { industryBaseline: 2, bestInClass: 5 },
  'contract-negotiation': { industryBaseline: 3, bestInClass: 4 },
  'resume-parsing': { industryBaseline: 2, bestInClass: 5 },
  'skills-matching': { industryBaseline: 2, bestInClass: 5 },
  'shortlisting': { industryBaseline: 2, bestInClass: 4 },
  'database-management': { industryBaseline: 2, bestInClass: 4 },
  'talent-pipelining': { industryBaseline: 2, bestInClass: 5 },
  'alumni-tracking': { industryBaseline: 1, bestInClass: 4 },
  'communication-mgmt': { industryBaseline: 3, bestInClass: 5 },
  'experience-design': { industryBaseline: 2, bestInClass: 5 },
  'feedback-loops': { industryBaseline: 2, bestInClass: 4 },
  'requirement-analysis': { industryBaseline: 3, bestInClass: 5 },
  'candidate-ranking': { industryBaseline: 2, bestInClass: 5 },
  'culture-fit': { industryBaseline: 1, bestInClass: 4 },
  'scheduling': { industryBaseline: 3, bestInClass: 5 },
  'panel-management': { industryBaseline: 2, bestInClass: 4 },
  'interview-feedback': { industryBaseline: 2, bestInClass: 4 },
  'offer-generation': { industryBaseline: 2, bestInClass: 5 },
  'negotiation-support': { industryBaseline: 2, bestInClass: 4 },
  'acceptance-tracking': { industryBaseline: 2, bestInClass: 4 },
  'timesheet-capture': { industryBaseline: 3, bestInClass: 5 },
  'timesheet-validation': { industryBaseline: 2, bestInClass: 5 },
  'overtime-management': { industryBaseline: 2, bestInClass: 4 },
  'billing-rules': { industryBaseline: 2, bestInClass: 5 },
  'invoice-creation': { industryBaseline: 3, bestInClass: 5 },
  'credit-notes': { industryBaseline: 2, bestInClass: 4 },
  'fee-calculation': { industryBaseline: 3, bestInClass: 5 },
  'accruals': { industryBaseline: 2, bestInClass: 4 },
  'margin-analysis': { industryBaseline: 2, bestInClass: 5 },
  'gdpr-data': { industryBaseline: 3, bestInClass: 5 },
  'employment-law': { industryBaseline: 3, bestInClass: 5 },
  'industry-regulations': { industryBaseline: 2, bestInClass: 4 },
  'ir35-assessment': { industryBaseline: 2, bestInClass: 5 },
  'contract-issuance': { industryBaseline: 3, bestInClass: 5 },
  'right-to-work': { industryBaseline: 3, bestInClass: 5 },
};
Object.entries(benchmarkSeeds).forEach(([id, val]) => {
  benchmarkProfiles[id] = val;
});

// ─── KPI Library ────────────────────────────────────────────────
export const kpiLibrary = [
  { id: 'time-to-fill', name: 'Time to Fill', unit: 'days', target: 25, category: 'Efficiency', capabilityIds: ['lead-generation', 'cv-screening', 'job-matching'] },
  { id: 'time-to-hire', name: 'Time to Hire', unit: 'days', target: 30, category: 'Efficiency', capabilityIds: ['interview-coordination', 'offer-management', 'onboarding'] },
  { id: 'fill-rate', name: 'Fill Rate', unit: '%', target: 85, category: 'Effectiveness', capabilityIds: ['job-matching', 'candidate-engagement'] },
  { id: 'candidate-satisfaction', name: 'Candidate Satisfaction', unit: 'NPS', target: 60, category: 'Quality', capabilityIds: ['candidate-engagement', 'interview-coordination'] },
  { id: 'client-satisfaction', name: 'Client Satisfaction', unit: 'NPS', target: 70, category: 'Quality', capabilityIds: ['client-satisfaction', 'placement-tracking'] },
  { id: 'gross-margin', name: 'Gross Margin', unit: '%', target: 35, category: 'Financial', capabilityIds: ['revenue-recognition', 'pricing-strategy'] },
  { id: 'revenue-per-consultant', name: 'Revenue per Consultant', unit: '£k', target: 250, category: 'Financial', capabilityIds: ['lead-generation', 'client-outreach'] },
  { id: 'contractor-retention', name: 'Contractor Retention Rate', unit: '%', target: 90, category: 'Quality', capabilityIds: ['assignment-management', 'contractor-onboarding'] },
  { id: 'invoice-accuracy', name: 'Invoice Accuracy', unit: '%', target: 99, category: 'Financial', capabilityIds: ['invoice-generation', 'timesheet-processing'] },
  { id: 'compliance-score', name: 'Compliance Score', unit: '%', target: 95, category: 'Risk', capabilityIds: ['regulatory-compliance', 'audit-governance'] },
  { id: 'cost-per-hire', name: 'Cost per Hire', unit: '£', target: 3000, category: 'Efficiency', capabilityIds: ['cv-screening', 'job-matching', 'lead-generation'] },
  { id: 'offer-acceptance-rate', name: 'Offer Acceptance Rate', unit: '%', target: 90, category: 'Effectiveness', capabilityIds: ['offer-management', 'negotiation-support'] },
];

// ─── AI Opportunity Patterns ────────────────────────────────────
export const aiPatterns = {
  'resume-parsing': {
    level1: { name: 'AI-Powered CV Summary', type: 'Prompt', value: 'High', complexity: 'Low' },
    level2: { name: 'Automated CV Screening Pipeline', type: 'Workflow', value: 'Very High', complexity: 'Medium' },
    level3: { name: 'Autonomous Screening Agent', type: 'Agent', value: 'Transformative', complexity: 'High' },
  },
  'skills-matching': {
    level1: { name: 'Skill Extraction Prompt', type: 'Prompt', value: 'High', complexity: 'Low' },
    level2: { name: 'Semantic Matching Workflow', type: 'Workflow', value: 'Very High', complexity: 'Medium' },
    level3: { name: 'Intelligent Matching Agent', type: 'Agent', value: 'Transformative', complexity: 'High' },
  },
  'candidate-ranking': {
    level1: { name: 'Ranking Criteria Prompt', type: 'Prompt', value: 'Medium', complexity: 'Low' },
    level2: { name: 'Multi-Factor Ranking Workflow', type: 'Workflow', value: 'High', complexity: 'Medium' },
    level3: { name: 'Predictive Ranking Agent', type: 'Agent', value: 'Very High', complexity: 'High' },
  },
  'cold-outreach': {
    level1: { name: 'Personalised Email Generator', type: 'Prompt', value: 'High', complexity: 'Low' },
    level2: { name: 'Multi-Channel Outreach Workflow', type: 'Workflow', value: 'Very High', complexity: 'Medium' },
    level3: { name: 'Autonomous Outreach Agent', type: 'Agent', value: 'Transformative', complexity: 'High' },
  },
  'scheduling': {
    level1: { name: 'Schedule Suggestion Prompt', type: 'Prompt', value: 'Medium', complexity: 'Low' },
    level2: { name: 'Automated Scheduling Workflow', type: 'Workflow', value: 'High', complexity: 'Medium' },
    level3: { name: 'Self-Scheduling Agent', type: 'Agent', value: 'Very High', complexity: 'Medium' },
  },
  'market-research': {
    level1: { name: 'Market Trend Summary', type: 'Prompt', value: 'Medium', complexity: 'Low' },
    level2: { name: 'Competitive Intelligence Workflow', type: 'Workflow', value: 'High', complexity: 'Medium' },
    level3: { name: 'Market Intelligence Agent', type: 'Agent', value: 'Very High', complexity: 'High' },
  },
  'communication-mgmt': {
    level1: { name: 'Message Drafting Prompt', type: 'Prompt', value: 'Medium', complexity: 'Low' },
    level2: { name: 'Automated Nurture Workflow', type: 'Workflow', value: 'High', complexity: 'Medium' },
    level3: { name: 'Communication Agent', type: 'Agent', value: 'High', complexity: 'High' },
  },
  'timesheet-capture': {
    level1: { name: 'Timesheet Reminder Prompt', type: 'Prompt', value: 'Low', complexity: 'Low' },
    level2: { name: 'Auto-Capture Workflow', type: 'Workflow', value: 'High', complexity: 'Medium' },
    level3: { name: 'Timesheet Agent', type: 'Agent', value: 'High', complexity: 'Medium' },
  },
  'operational-reporting': {
    level1: { name: 'Report Summary Prompt', type: 'Prompt', value: 'Medium', complexity: 'Low' },
    level2: { name: 'Automated Report Generation', type: 'Workflow', value: 'High', complexity: 'Medium' },
    level3: { name: 'Reporting Intelligence Agent', type: 'Agent', value: 'Very High', complexity: 'High' },
  },
  'predictive-analytics': {
    level1: { name: 'Trend Analysis Prompt', type: 'Prompt', value: 'Medium', complexity: 'Low' },
    level2: { name: 'Forecasting Workflow', type: 'Workflow', value: 'Very High', complexity: 'High' },
    level3: { name: 'Predictive Analytics Agent', type: 'Agent', value: 'Transformative', complexity: 'High' },
  },
  'gdpr-data': {
    level1: { name: 'GDPR Compliance Check Prompt', type: 'Prompt', value: 'Medium', complexity: 'Low' },
    level2: { name: 'Data Audit Workflow', type: 'Workflow', value: 'High', complexity: 'Medium' },
    level3: { name: 'Compliance Monitoring Agent', type: 'Agent', value: 'High', complexity: 'High' },
  },
  'ir35-assessment': {
    level1: { name: 'IR35 Status Check Prompt', type: 'Prompt', value: 'High', complexity: 'Low' },
    level2: { name: 'IR35 Assessment Workflow', type: 'Workflow', value: 'Very High', complexity: 'Medium' },
    level3: { name: 'IR35 Compliance Agent', type: 'Agent', value: 'Transformative', complexity: 'High' },
  },
};

// ─── Regulatory Framework ───────────────────────────────────────
export const regulatoryFramework = [
  { id: 'gdpr', name: 'GDPR', geography: 'EU/UK', scope: 'Data Protection', applicableTo: ['resume-parsing', 'database-management', 'communication-mgmt', 'gdpr-data'] },
  { id: 'uk-employment', name: 'UK Employment Act', geography: 'UK', scope: 'Employment', applicableTo: ['contract-issuance', 'right-to-work', 'employment-law'] },
  { id: 'ir35', name: 'IR35 / Off-Payroll Rules', geography: 'UK', scope: 'Tax/Employment', applicableTo: ['ir35-assessment', 'contractor-onboarding'] },
  { id: 'eu-ai-act', name: 'EU AI Act', geography: 'EU', scope: 'AI Governance', applicableTo: ['resume-parsing', 'skills-matching', 'candidate-ranking', 'predictive-analytics'] },
  { id: 'equality-act', name: 'Equality Act 2010', geography: 'UK', scope: 'Anti-Discrimination', applicableTo: ['shortlisting', 'candidate-ranking', 'culture-fit'] },
  { id: 'awe-regs', name: 'Agency Workers Regulations', geography: 'UK', scope: 'Temp/Contractor', applicableTo: ['assignment-management', 'contractor-onboarding', 'offboarding'] },
  { id: 'conduct-regs', name: 'Conduct of Employment Agencies Regulations', geography: 'UK', scope: 'Conduct', applicableTo: ['client-outreach', 'contract-negotiation', 'offer-management'] },
];

// ─── Suggested Objectives ───────────────────────────────────────
export const suggestedObjectives = [
  { name: 'Reduce Time to Fill', type: 'KPI', kpiId: 'time-to-fill' },
  { name: 'Improve Candidate Quality', type: 'OKR', kpiId: 'fill-rate' },
  { name: 'Grow Revenue per Consultant', type: 'KPI', kpiId: 'revenue-per-consultant' },
  { name: 'Enhance Client Satisfaction', type: 'OKR', kpiId: 'client-satisfaction' },
  { name: 'Increase Gross Margin', type: 'KPI', kpiId: 'gross-margin' },
  { name: 'Improve Compliance Score', type: 'KPI', kpiId: 'compliance-score' },
  { name: 'Reduce Cost per Hire', type: 'KPI', kpiId: 'cost-per-hire' },
  { name: 'Boost Offer Acceptance Rate', type: 'KPI', kpiId: 'offer-acceptance-rate' },
];

// ─── Pain Point Examples ────────────────────────────────────────
export const painPointExamples = [
  'CV screening is too slow and manual',
  'Poor candidate experience during interviews',
  'Timesheets often contain errors',
  'Client onboarding takes too long',
  'No visibility into pipeline data',
  'IR35 compliance checks are inconsistent',
];

// ─── Pain Point Keywords → Capability Mapping ──────────────────
export const painPointKeywords = {
  'cv': ['cv-screening'],
  'resume': ['cv-screening', 'resume-parsing'],
  'screening': ['cv-screening', 'shortlisting'],
  'sourcing': ['candidate-sourcing', 'talent-pooling'],
  'candidate': ['candidate-engagement', 'candidate-sourcing'],
  'talent': ['talent-pooling', 'talent-pipelining'],
  'interview': ['interview-coordination', 'scheduling'],
  'scheduling': ['scheduling'],
  'offer': ['offer-management', 'offer-generation'],
  'client': ['client-outreach', 'client-satisfaction'],
  'sales': ['lead-generation', 'client-outreach'],
  'lead': ['lead-generation', 'lead-qualification'],
  'pipeline': ['pipeline-management', 'talent-pipelining'],
  'timesheet': ['timesheet-processing', 'timesheet-capture'],
  'invoice': ['invoice-generation', 'invoice-creation'],
  'billing': ['invoice-generation', 'billing-rules'],
  'compliance': ['regulatory-compliance', 'gdpr-data'],
  'gdpr': ['gdpr-data'],
  'ir35': ['ir35-assessment'],
  'contractor': ['contractor-onboarding', 'assignment-management'],
  'temp': ['contractor-management', 'assignment-management'],
  'onboarding': ['onboarding', 'contractor-onboarding'],
  'placement': ['matching-placement', 'placement-tracking'],
  'matching': ['job-matching', 'skills-matching'],
  'data': ['data-management', 'data-quality'],
  'reporting': ['reporting', 'operational-reporting'],
  'analytics': ['analytics', 'predictive-analytics'],
  'slow': ['cv-screening', 'timesheet-processing', 'scheduling'],
  'manual': ['workflow-automation', 'timesheet-capture', 'resume-parsing'],
  'error': ['timesheet-validation', 'invoice-creation', 'data-quality'],
  'risk': ['risk-management', 'regulatory-compliance'],
  'quality': ['data-quality', 'quality-reviews'],
  'automation': ['automation-tools', 'workflow-automation'],
  'pricing': ['pricing-strategy'],
  'margin': ['margin-analysis', 'fee-calculation'],
  'retention': ['retention-monitoring', 'contractor-retention'],
  'communication': ['communication-mgmt'],
  'feedback': ['feedback-loops', 'interview-feedback'],
};
