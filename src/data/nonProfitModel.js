// Stratigen AI — Non-Profit Organisation Industry Model
// Complete L0–L2 capability hierarchy with benchmarks and KPIs

export const INDUSTRY_ID = 'non-profit';
export const INDUSTRY_NAME = 'Non-Profit Organisation';

// ─── Capability Model (L0 → L1 → L2) ─────────────────────────────
export const capabilityModel = [
  {
    id: 'fundraising-development',
    name: 'Fundraising & Development',
    icon: '💝',
    l1: [
      {
        id: 'donor-acquisition', name: 'Donor Acquisition',
        l2: [
          { id: 'prospect-research', name: 'Prospect Research & Identification' },
          { id: 'donor-outreach', name: 'Donor Outreach & Cultivation' },
          { id: 'campaign-management', name: 'Campaign Management' },
        ]
      },
      {
        id: 'donor-retention', name: 'Donor Retention',
        l2: [
          { id: 'donor-stewardship', name: 'Donor Stewardship' },
          { id: 'donor-communications', name: 'Donor Communications' },
          { id: 'major-gifts', name: 'Major Gifts Management' },
        ]
      },
      {
        id: 'grant-management', name: 'Grant Management',
        l2: [
          { id: 'grant-research', name: 'Grant Research & Identification' },
          { id: 'grant-writing', name: 'Grant Writing & Submission' },
          { id: 'grant-reporting', name: 'Grant Reporting & Compliance' },
        ]
      },
    ]
  },
  {
    id: 'programme-delivery',
    name: 'Programme Delivery',
    icon: '🎯',
    l1: [
      {
        id: 'programme-design', name: 'Programme Design',
        l2: [
          { id: 'needs-assessment', name: 'Needs Assessment' },
          { id: 'programme-planning', name: 'Programme Planning' },
          { id: 'impact-framework', name: 'Impact Framework Design' },
        ]
      },
      {
        id: 'programme-operations', name: 'Programme Operations',
        l2: [
          { id: 'service-delivery', name: 'Service Delivery' },
          { id: 'case-management', name: 'Case Management' },
          { id: 'resource-allocation', name: 'Resource Allocation' },
        ]
      },
      {
        id: 'impact-measurement', name: 'Impact Measurement',
        l2: [
          { id: 'data-collection', name: 'Data Collection & Monitoring' },
          { id: 'evaluation', name: 'Programme Evaluation' },
          { id: 'impact-reporting', name: 'Impact Reporting' },
        ]
      },
    ]
  },
  {
    id: 'volunteer-management',
    name: 'Volunteer Management',
    icon: '🤝',
    l1: [
      {
        id: 'volunteer-recruitment', name: 'Volunteer Recruitment',
        l2: [
          { id: 'volunteer-sourcing', name: 'Volunteer Sourcing & Advertising' },
          { id: 'volunteer-screening', name: 'Volunteer Screening & Vetting' },
          { id: 'volunteer-onboarding', name: 'Volunteer Onboarding' },
        ]
      },
      {
        id: 'volunteer-engagement', name: 'Volunteer Engagement',
        l2: [
          { id: 'scheduling-coordination', name: 'Scheduling & Coordination' },
          { id: 'volunteer-training', name: 'Volunteer Training' },
          { id: 'volunteer-recognition', name: 'Recognition & Retention' },
        ]
      },
      {
        id: 'volunteer-reporting', name: 'Volunteer Reporting',
        l2: [
          { id: 'hours-tracking', name: 'Hours Tracking' },
          { id: 'volunteer-impact', name: 'Volunteer Impact Measurement' },
          { id: 'compliance-checks', name: 'Compliance & DBS Checks' },
        ]
      },
    ]
  },
  {
    id: 'beneficiary-management',
    name: 'Beneficiary Management',
    icon: '👥',
    l1: [
      {
        id: 'beneficiary-intake', name: 'Beneficiary Intake',
        l2: [
          { id: 'referral-management', name: 'Referral Management' },
          { id: 'eligibility-assessment', name: 'Eligibility Assessment' },
          { id: 'beneficiary-registration', name: 'Beneficiary Registration' },
        ]
      },
      {
        id: 'support-services', name: 'Support Services',
        l2: [
          { id: 'needs-planning', name: 'Individual Needs Planning' },
          { id: 'service-coordination', name: 'Service Coordination' },
          { id: 'progress-tracking', name: 'Progress Tracking' },
        ]
      },
      {
        id: 'beneficiary-outcomes', name: 'Beneficiary Outcomes',
        l2: [
          { id: 'outcome-measurement', name: 'Outcome Measurement' },
          { id: 'beneficiary-feedback', name: 'Beneficiary Feedback Collection' },
          { id: 'longitudinal-tracking', name: 'Longitudinal Tracking' },
        ]
      },
    ]
  },
  {
    id: 'partnerships-advocacy',
    name: 'Partnerships & Advocacy',
    icon: '🌐',
    l1: [
      {
        id: 'partnership-development', name: 'Partnership Development',
        l2: [
          { id: 'partner-identification', name: 'Partner Identification' },
          { id: 'mou-management', name: 'MoU & Agreement Management' },
          { id: 'collaboration-delivery', name: 'Collaborative Delivery' },
        ]
      },
      {
        id: 'policy-advocacy', name: 'Policy & Advocacy',
        l2: [
          { id: 'policy-research', name: 'Policy Research' },
          { id: 'stakeholder-engagement', name: 'Stakeholder Engagement' },
          { id: 'campaign-advocacy', name: 'Campaign & Advocacy Activities' },
        ]
      },
      {
        id: 'community-engagement', name: 'Community Engagement',
        l2: [
          { id: 'community-outreach', name: 'Community Outreach' },
          { id: 'events-management', name: 'Events Management' },
          { id: 'co-design', name: 'Co-Design & Consultation' },
        ]
      },
    ]
  },
  {
    id: 'finance-grants',
    name: 'Finance & Grants Management',
    icon: '💰',
    l1: [
      {
        id: 'financial-planning', name: 'Financial Planning',
        l2: [
          { id: 'budgeting', name: 'Budgeting & Forecasting' },
          { id: 'cost-allocation', name: 'Cost Allocation' },
          { id: 'financial-modelling', name: 'Financial Modelling' },
        ]
      },
      {
        id: 'financial-operations', name: 'Financial Operations',
        l2: [
          { id: 'accounts-payable', name: 'Accounts Payable' },
          { id: 'accounts-receivable', name: 'Accounts Receivable' },
          { id: 'payroll', name: 'Payroll Management' },
        ]
      },
      {
        id: 'financial-reporting', name: 'Financial Reporting',
        l2: [
          { id: 'management-accounts', name: 'Management Accounts' },
          { id: 'statutory-reporting', name: 'Statutory Reporting' },
          { id: 'funder-reporting', name: 'Funder Financial Reporting' },
        ]
      },
    ]
  },
  {
    id: 'communications-marketing',
    name: 'Communications & Marketing',
    icon: '📢',
    l1: [
      {
        id: 'brand-marketing', name: 'Brand & Marketing',
        l2: [
          { id: 'brand-management', name: 'Brand Management' },
          { id: 'content-creation', name: 'Content Creation' },
          { id: 'digital-marketing', name: 'Digital Marketing' },
        ]
      },
      {
        id: 'media-pr', name: 'Media & PR',
        l2: [
          { id: 'media-relations', name: 'Media Relations' },
          { id: 'press-management', name: 'Press Release Management' },
          { id: 'crisis-comms', name: 'Crisis Communications' },
        ]
      },
      {
        id: 'digital-channels', name: 'Digital Channels',
        l2: [
          { id: 'social-media', name: 'Social Media Management' },
          { id: 'email-comms', name: 'Email Communications' },
          { id: 'website-management', name: 'Website Management' },
        ]
      },
    ]
  },
  {
    id: 'governance-compliance',
    name: 'Governance & Compliance',
    icon: '🛡️',
    l1: [
      {
        id: 'board-governance', name: 'Board Governance',
        l2: [
          { id: 'board-management', name: 'Board Management' },
          { id: 'trustee-reporting', name: 'Trustee Reporting' },
          { id: 'strategic-planning-gov', name: 'Strategic Planning' },
        ]
      },
      {
        id: 'legal-compliance', name: 'Legal & Regulatory Compliance',
        l2: [
          { id: 'charity-law', name: 'Charity Law Compliance' },
          { id: 'data-protection', name: 'Data Protection & GDPR' },
          { id: 'safeguarding', name: 'Safeguarding' },
        ]
      },
      {
        id: 'risk-assurance', name: 'Risk & Assurance',
        l2: [
          { id: 'risk-register', name: 'Risk Register Management' },
          { id: 'internal-audit-np', name: 'Internal Audit' },
          { id: 'insurance-np', name: 'Insurance & Indemnity' },
        ]
      },
    ]
  },
  {
    id: 'people-culture',
    name: 'People & Culture',
    icon: '🌱',
    l1: [
      {
        id: 'talent-management', name: 'Talent Management',
        l2: [
          { id: 'staff-recruitment-np', name: 'Staff Recruitment' },
          { id: 'onboarding-np', name: 'Staff Onboarding' },
          { id: 'performance-np', name: 'Performance Management' },
        ]
      },
      {
        id: 'learning-development', name: 'Learning & Development',
        l2: [
          { id: 'training-delivery', name: 'Training Delivery' },
          { id: 'leadership-dev', name: 'Leadership Development' },
          { id: 'wellbeing', name: 'Staff Wellbeing' },
        ]
      },
      {
        id: 'culture-dei', name: 'Culture & DEI',
        l2: [
          { id: 'dei-strategy', name: 'Diversity, Equity & Inclusion' },
          { id: 'employee-engagement', name: 'Employee Engagement' },
          { id: 'culture-change', name: 'Culture Change' },
        ]
      },
    ]
  },
  {
    id: 'technology-data',
    name: 'Technology & Data',
    icon: '⚙️',
    l1: [
      {
        id: 'crm-systems', name: 'CRM & Donor Systems',
        l2: [
          { id: 'crm-management-np', name: 'CRM Configuration & Management' },
          { id: 'donation-platform', name: 'Donation Platform' },
          { id: 'data-integration-np', name: 'Data Integration' },
        ]
      },
      {
        id: 'programme-technology', name: 'Programme Technology',
        l2: [
          { id: 'case-mgmt-system', name: 'Case Management System' },
          { id: 'impact-tools', name: 'Impact Measurement Tools' },
          { id: 'volunteer-platform', name: 'Volunteer Management Platform' },
        ]
      },
      {
        id: 'data-analytics-np', name: 'Data & Analytics',
        l2: [
          { id: 'reporting-np', name: 'Operational Reporting' },
          { id: 'data-quality-np', name: 'Data Quality & Governance' },
          { id: 'predictive-insights', name: 'Predictive Insights' },
        ]
      },
    ]
  },
];

// ─── Benchmark Profiles (l2Id → { industryBaseline, bestInClass }) ─
export const benchmarkProfiles = {
  'prospect-research': { industryBaseline: 2.5, bestInClass: 4.5 },
  'donor-outreach': { industryBaseline: 2.5, bestInClass: 4.5 },
  'campaign-management': { industryBaseline: 3.0, bestInClass: 5.0 },
  'donor-stewardship': { industryBaseline: 2.5, bestInClass: 4.5 },
  'donor-communications': { industryBaseline: 3.0, bestInClass: 5.0 },
  'major-gifts': { industryBaseline: 2.0, bestInClass: 4.5 },
  'grant-research': { industryBaseline: 2.5, bestInClass: 4.5 },
  'grant-writing': { industryBaseline: 2.5, bestInClass: 4.5 },
  'grant-reporting': { industryBaseline: 3.0, bestInClass: 5.0 },
  'service-delivery': { industryBaseline: 3.0, bestInClass: 5.0 },
  'case-management': { industryBaseline: 2.5, bestInClass: 4.5 },
  'impact-reporting': { industryBaseline: 2.0, bestInClass: 4.5 },
  'volunteer-screening': { industryBaseline: 3.0, bestInClass: 5.0 },
  'volunteer-onboarding': { industryBaseline: 2.5, bestInClass: 4.5 },
  'hours-tracking': { industryBaseline: 3.0, bestInClass: 5.0 },
  'data-protection': { industryBaseline: 3.0, bestInClass: 5.0 },
  'safeguarding': { industryBaseline: 3.5, bestInClass: 5.0 },
  'charity-law': { industryBaseline: 3.0, bestInClass: 5.0 },
  'budgeting': { industryBaseline: 3.0, bestInClass: 5.0 },
  'funder-reporting': { industryBaseline: 3.0, bestInClass: 5.0 },
  'social-media': { industryBaseline: 2.5, bestInClass: 5.0 },
  'reporting-np': { industryBaseline: 2.5, bestInClass: 4.5 },
};

// ─── Suggested Objectives ───────────────────────────────────────
export const suggestedObjectives = [
  { name: 'Increase Donor Retention Rate', type: 'KPI', kpiId: 'donor-retention-rate' },
  { name: 'Improve Grant Success Rate', type: 'KPI', kpiId: 'grant-success-rate' },
  { name: 'Grow Programme Reach', type: 'OKR', kpiId: 'programme-reach' },
  { name: 'Reduce Cost Per Pound Raised', type: 'KPI', kpiId: 'cost-per-pound-raised' },
  { name: 'Improve Volunteer Retention', type: 'KPI', kpiId: 'volunteer-retention-rate' },
  { name: 'Enhance Beneficiary Satisfaction', type: 'OKR', kpiId: 'beneficiary-satisfaction' },
  { name: 'Strengthen Governance & Compliance', type: 'KPI', kpiId: 'compliance-score' },
  { name: 'Improve Impact Measurement (SROI)', type: 'OKR', kpiId: 'impact-score' },
];

// ─── Pain Point Examples ────────────────────────────────────────
export const painPointExamples = [
  'Donor retention is declining each year',
  'Grant reporting takes too long and is error-prone',
  'Volunteer scheduling and coordination is manual',
  'Beneficiary data is spread across multiple spreadsheets',
  'Impact and outcomes are difficult to measure and report',
  'Safeguarding compliance checks are inconsistent',
];

// ─── KPI Library ─────────────────────────────────────────────────
export const kpiLibrary = [
  { name: 'Donor Retention Rate', type: 'KPI', target: '70%', unit: '%' },
  { name: 'Cost Per Pound Raised', type: 'KPI', target: '£0.20', unit: '£' },
  { name: 'Grant Success Rate', type: 'KPI', target: '40%', unit: '%' },
  { name: 'Volunteer Retention Rate', type: 'KPI', target: '75%', unit: '%' },
  { name: 'Programme Reach', type: 'KPI', target: '10,000', unit: 'beneficiaries' },
  { name: 'Impact Score (SROI)', type: 'KPI', target: '3:1', unit: 'ratio' },
  { name: 'Overhead Ratio', type: 'KPI', target: '15%', unit: '%' },
  { name: 'Beneficiary Satisfaction', type: 'KPI', target: '85%', unit: '%' },
];
