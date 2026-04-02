// Server-side industry model definitions for DB seeding
// These mirror the frontend src/data/ models

const recruitmentCapabilities = [
  { id: 'client-acquisition', name: 'Client Acquisition & Sales', icon: '🎯', l1: [
    { id: 'lead-generation', name: 'Lead Generation', l2: [
      { id: 'market-research', name: 'Market Research & Targeting' },
      { id: 'lead-qualification', name: 'Lead Qualification' },
      { id: 'pipeline-management', name: 'Pipeline Management' },
    ]},
    { id: 'client-outreach', name: 'Client Outreach', l2: [
      { id: 'cold-outreach', name: 'Cold Outreach Campaigns' },
      { id: 'relationship-building', name: 'Relationship Building' },
      { id: 'networking', name: 'Networking & Events' },
    ]},
    { id: 'proposal-management', name: 'Proposal Management', l2: [
      { id: 'rfp-response', name: 'RFP/RFI Response' },
      { id: 'pricing-strategy', name: 'Pricing Strategy' },
      { id: 'contract-negotiation', name: 'Contract Negotiation' },
    ]},
  ]},
  { id: 'candidate-sourcing', name: 'Candidate Sourcing & Management', icon: '👥', l1: [
    { id: 'cv-screening', name: 'CV Screening', l2: [
      { id: 'resume-parsing', name: 'Resume Parsing & Extraction' },
      { id: 'skills-matching', name: 'Skills Matching' },
      { id: 'shortlisting', name: 'Shortlisting' },
    ]},
    { id: 'talent-pooling', name: 'Talent Pooling', l2: [
      { id: 'database-management', name: 'Candidate Database Management' },
      { id: 'talent-pipelining', name: 'Talent Pipelining' },
      { id: 'alumni-tracking', name: 'Alumni & Redeployment Tracking' },
    ]},
    { id: 'candidate-engagement', name: 'Candidate Engagement', l2: [
      { id: 'communication-mgmt', name: 'Communication Management' },
      { id: 'experience-design', name: 'Candidate Experience Design' },
      { id: 'feedback-loops', name: 'Feedback Loops' },
    ]},
  ]},
  { id: 'matching-placement', name: 'Matching & Placement', icon: '🔗', l1: [
    { id: 'job-matching', name: 'Job Matching', l2: [
      { id: 'requirement-analysis', name: 'Requirement Analysis' },
      { id: 'candidate-ranking', name: 'Candidate Ranking' },
      { id: 'culture-fit', name: 'Culture Fit Assessment' },
    ]},
    { id: 'interview-coordination', name: 'Interview Coordination', l2: [
      { id: 'scheduling', name: 'Interview Scheduling' },
      { id: 'panel-management', name: 'Panel Management' },
      { id: 'interview-feedback', name: 'Interview Feedback Collection' },
    ]},
    { id: 'offer-management', name: 'Offer Management', l2: [
      { id: 'offer-generation', name: 'Offer Generation' },
      { id: 'negotiation-support', name: 'Negotiation Support' },
      { id: 'acceptance-tracking', name: 'Acceptance Tracking' },
    ]},
  ]},
  { id: 'delivery-fulfilment', name: 'Delivery & Fulfilment', icon: '📦', l1: [
    { id: 'onboarding', name: 'Candidate Onboarding', l2: [
      { id: 'documentation', name: 'Documentation & Compliance Checks' },
      { id: 'induction', name: 'Induction Planning' },
      { id: 'first-day-readiness', name: 'First Day Readiness' },
    ]},
    { id: 'placement-tracking', name: 'Placement Tracking', l2: [
      { id: 'start-confirmation', name: 'Start Date Confirmation' },
      { id: 'retention-monitoring', name: 'Retention Monitoring' },
      { id: 'replacement-guarantee', name: 'Replacement Guarantee Tracking' },
    ]},
    { id: 'client-satisfaction', name: 'Client Satisfaction', l2: [
      { id: 'quality-reviews', name: 'Quality Reviews' },
      { id: 'nps-tracking', name: 'NPS & Satisfaction Scoring' },
      { id: 'account-reviews', name: 'Account Reviews' },
    ]},
  ]},
  { id: 'contractor-management', name: 'Contractor / Temp Management', icon: '⏱️', l1: [
    { id: 'contractor-onboarding', name: 'Contractor Onboarding', l2: [
      { id: 'ir35-assessment', name: 'IR35 / Employment Status Assessment' },
      { id: 'contract-issuance', name: 'Contract Issuance' },
      { id: 'right-to-work', name: 'Right to Work Verification' },
    ]},
    { id: 'assignment-management', name: 'Assignment Management', l2: [
      { id: 'extension-management', name: 'Extension Management' },
      { id: 'performance-monitoring', name: 'Performance Monitoring' },
      { id: 'issue-resolution', name: 'Issue Resolution' },
    ]},
    { id: 'offboarding', name: 'Offboarding', l2: [
      { id: 'exit-process', name: 'Exit Process Management' },
      { id: 'equipment-return', name: 'Equipment Return' },
      { id: 'reference-collection', name: 'Reference Collection' },
    ]},
  ]},
  { id: 'finance-billing', name: 'Finance & Billing', icon: '💰', l1: [
    { id: 'timesheet-processing', name: 'Timesheet Processing', l2: [
      { id: 'timesheet-capture', name: 'Timesheet Capture & Approval' },
      { id: 'timesheet-validation', name: 'Timesheet Validation' },
      { id: 'overtime-management', name: 'Overtime & Adjustment Management' },
    ]},
    { id: 'invoice-generation', name: 'Invoice Generation', l2: [
      { id: 'billing-rules', name: 'Billing Rules Engine' },
      { id: 'invoice-creation', name: 'Invoice Creation & Dispatch' },
      { id: 'credit-notes', name: 'Credit Note Management' },
    ]},
    { id: 'revenue-recognition', name: 'Revenue Recognition', l2: [
      { id: 'fee-calculation', name: 'Fee Calculation' },
      { id: 'accruals', name: 'Accruals & Deferrals' },
      { id: 'margin-analysis', name: 'Margin Analysis' },
    ]},
  ]},
  { id: 'compliance-risk', name: 'Compliance & Risk', icon: '🛡️', l1: [
    { id: 'regulatory-compliance', name: 'Regulatory Compliance', l2: [
      { id: 'gdpr-data', name: 'GDPR & Data Protection' },
      { id: 'employment-law', name: 'Employment Law Compliance' },
      { id: 'industry-regulations', name: 'Industry-Specific Regulations' },
    ]},
    { id: 'risk-management', name: 'Risk Management', l2: [
      { id: 'client-risk', name: 'Client Credit Risk' },
      { id: 'operational-risk', name: 'Operational Risk Assessment' },
      { id: 'insurance-mgmt', name: 'Insurance Management' },
    ]},
    { id: 'audit-governance', name: 'Audit & Governance', l2: [
      { id: 'internal-audit', name: 'Internal Audit' },
      { id: 'policy-management', name: 'Policy Management' },
      { id: 'reporting-obligations', name: 'Reporting Obligations' },
    ]},
  ]},
  { id: 'back-office', name: 'Back Office Operations', icon: '🏢', l1: [
    { id: 'hr-internal', name: 'Internal HR', l2: [
      { id: 'staff-recruitment', name: 'Staff Recruitment' },
      { id: 'training-dev', name: 'Training & Development' },
      { id: 'performance-mgmt', name: 'Performance Management' },
    ]},
    { id: 'facilities-admin', name: 'Facilities & Administration', l2: [
      { id: 'office-management', name: 'Office Management' },
      { id: 'procurement', name: 'Procurement' },
      { id: 'vendor-management', name: 'Vendor Management' },
    ]},
    { id: 'it-support', name: 'IT Support', l2: [
      { id: 'helpdesk', name: 'Helpdesk & Support' },
      { id: 'infrastructure', name: 'Infrastructure Management' },
      { id: 'security', name: 'Cybersecurity' },
    ]},
  ]},
  { id: 'data-analytics', name: 'Data & Analytics', icon: '📊', l1: [
    { id: 'reporting', name: 'Reporting', l2: [
      { id: 'operational-reporting', name: 'Operational Reporting' },
      { id: 'financial-reporting', name: 'Financial Reporting' },
      { id: 'client-reporting', name: 'Client Reporting' },
    ]},
    { id: 'analytics', name: 'Advanced Analytics', l2: [
      { id: 'predictive-analytics', name: 'Predictive Analytics' },
      { id: 'market-intelligence', name: 'Market Intelligence' },
      { id: 'performance-analytics', name: 'Performance Analytics' },
    ]},
    { id: 'data-management', name: 'Data Management', l2: [
      { id: 'data-quality', name: 'Data Quality & Cleansing' },
      { id: 'data-integration', name: 'Data Integration' },
      { id: 'master-data', name: 'Master Data Management' },
    ]},
  ]},
  { id: 'technology-platforms', name: 'Technology Platforms', icon: '⚙️', l1: [
    { id: 'ats-crm', name: 'ATS / CRM', l2: [
      { id: 'ats-management', name: 'ATS Configuration & Management' },
      { id: 'crm-management', name: 'CRM Configuration & Management' },
      { id: 'system-integration', name: 'System Integration' },
    ]},
    { id: 'digital-channels', name: 'Digital Channels', l2: [
      { id: 'website-portal', name: 'Website & Portal Management' },
      { id: 'job-boards', name: 'Job Board Integration' },
      { id: 'social-media', name: 'Social Media Integration' },
    ]},
    { id: 'automation-tools', name: 'Automation Tools', l2: [
      { id: 'workflow-automation', name: 'Workflow Automation' },
      { id: 'rpa', name: 'RPA Implementation' },
      { id: 'ai-tools', name: 'AI/ML Tools' },
    ]},
  ]},
];

const nonProfitCapabilities = [
  { id: 'fundraising-development', name: 'Fundraising & Development', icon: '💝', l1: [
    { id: 'donor-acquisition', name: 'Donor Acquisition', l2: [
      { id: 'prospect-research', name: 'Prospect Research & Identification' },
      { id: 'donor-outreach', name: 'Donor Outreach & Cultivation' },
      { id: 'campaign-management', name: 'Campaign Management' },
    ]},
    { id: 'donor-retention', name: 'Donor Retention', l2: [
      { id: 'donor-stewardship', name: 'Donor Stewardship' },
      { id: 'donor-communications', name: 'Donor Communications' },
      { id: 'major-gifts', name: 'Major Gifts Management' },
    ]},
    { id: 'grant-management', name: 'Grant Management', l2: [
      { id: 'grant-research', name: 'Grant Research & Identification' },
      { id: 'grant-writing', name: 'Grant Writing & Submission' },
      { id: 'grant-reporting', name: 'Grant Reporting & Compliance' },
    ]},
  ]},
  { id: 'programme-delivery', name: 'Programme Delivery', icon: '🎯', l1: [
    { id: 'programme-design', name: 'Programme Design', l2: [
      { id: 'needs-assessment', name: 'Needs Assessment' },
      { id: 'programme-planning', name: 'Programme Planning' },
      { id: 'impact-framework', name: 'Impact Framework Design' },
    ]},
    { id: 'programme-operations', name: 'Programme Operations', l2: [
      { id: 'service-delivery', name: 'Service Delivery' },
      { id: 'case-management', name: 'Case Management' },
      { id: 'resource-allocation', name: 'Resource Allocation' },
    ]},
    { id: 'impact-measurement', name: 'Impact Measurement', l2: [
      { id: 'data-collection', name: 'Data Collection & Monitoring' },
      { id: 'evaluation', name: 'Programme Evaluation' },
      { id: 'impact-reporting', name: 'Impact Reporting' },
    ]},
  ]},
  { id: 'volunteer-management', name: 'Volunteer Management', icon: '🤝', l1: [
    { id: 'volunteer-recruitment', name: 'Volunteer Recruitment', l2: [
      { id: 'volunteer-sourcing', name: 'Volunteer Sourcing & Advertising' },
      { id: 'volunteer-screening', name: 'Volunteer Screening & Vetting' },
      { id: 'volunteer-onboarding', name: 'Volunteer Onboarding' },
    ]},
    { id: 'volunteer-engagement', name: 'Volunteer Engagement', l2: [
      { id: 'scheduling-coordination', name: 'Scheduling & Coordination' },
      { id: 'volunteer-training', name: 'Volunteer Training' },
      { id: 'volunteer-recognition', name: 'Recognition & Retention' },
    ]},
    { id: 'volunteer-reporting', name: 'Volunteer Reporting', l2: [
      { id: 'hours-tracking', name: 'Hours Tracking' },
      { id: 'volunteer-impact', name: 'Volunteer Impact Measurement' },
      { id: 'compliance-checks', name: 'Compliance & DBS Checks' },
    ]},
  ]},
  { id: 'beneficiary-management', name: 'Beneficiary Management', icon: '👥', l1: [
    { id: 'beneficiary-intake', name: 'Beneficiary Intake', l2: [
      { id: 'referral-management', name: 'Referral Management' },
      { id: 'eligibility-assessment', name: 'Eligibility Assessment' },
      { id: 'beneficiary-registration', name: 'Beneficiary Registration' },
    ]},
    { id: 'support-services', name: 'Support Services', l2: [
      { id: 'needs-planning', name: 'Individual Needs Planning' },
      { id: 'service-coordination', name: 'Service Coordination' },
      { id: 'progress-tracking', name: 'Progress Tracking' },
    ]},
    { id: 'beneficiary-outcomes', name: 'Beneficiary Outcomes', l2: [
      { id: 'outcome-measurement', name: 'Outcome Measurement' },
      { id: 'beneficiary-feedback', name: 'Beneficiary Feedback Collection' },
      { id: 'longitudinal-tracking', name: 'Longitudinal Tracking' },
    ]},
  ]},
  { id: 'partnerships-advocacy', name: 'Partnerships & Advocacy', icon: '🌐', l1: [
    { id: 'partnership-development', name: 'Partnership Development', l2: [
      { id: 'partner-identification', name: 'Partner Identification' },
      { id: 'mou-management', name: 'MoU & Agreement Management' },
      { id: 'collaboration-delivery', name: 'Collaborative Delivery' },
    ]},
    { id: 'policy-advocacy', name: 'Policy & Advocacy', l2: [
      { id: 'policy-research', name: 'Policy Research' },
      { id: 'stakeholder-engagement', name: 'Stakeholder Engagement' },
      { id: 'campaign-advocacy', name: 'Campaign & Advocacy Activities' },
    ]},
    { id: 'community-engagement', name: 'Community Engagement', l2: [
      { id: 'community-outreach', name: 'Community Outreach' },
      { id: 'events-management', name: 'Events Management' },
      { id: 'co-design', name: 'Co-Design & Consultation' },
    ]},
  ]},
  { id: 'finance-grants', name: 'Finance & Grants Management', icon: '💰', l1: [
    { id: 'financial-planning', name: 'Financial Planning', l2: [
      { id: 'budgeting', name: 'Budgeting & Forecasting' },
      { id: 'cost-allocation', name: 'Cost Allocation' },
      { id: 'financial-modelling', name: 'Financial Modelling' },
    ]},
    { id: 'financial-operations', name: 'Financial Operations', l2: [
      { id: 'accounts-payable', name: 'Accounts Payable' },
      { id: 'accounts-receivable', name: 'Accounts Receivable' },
      { id: 'payroll', name: 'Payroll Management' },
    ]},
    { id: 'financial-reporting', name: 'Financial Reporting', l2: [
      { id: 'management-accounts', name: 'Management Accounts' },
      { id: 'statutory-reporting', name: 'Statutory Reporting' },
      { id: 'funder-reporting', name: 'Funder Financial Reporting' },
    ]},
  ]},
  { id: 'communications-marketing', name: 'Communications & Marketing', icon: '📢', l1: [
    { id: 'brand-marketing', name: 'Brand & Marketing', l2: [
      { id: 'brand-management', name: 'Brand Management' },
      { id: 'content-creation', name: 'Content Creation' },
      { id: 'digital-marketing', name: 'Digital Marketing' },
    ]},
    { id: 'media-pr', name: 'Media & PR', l2: [
      { id: 'media-relations', name: 'Media Relations' },
      { id: 'press-management', name: 'Press Release Management' },
      { id: 'crisis-comms', name: 'Crisis Communications' },
    ]},
    { id: 'digital-channels', name: 'Digital Channels', l2: [
      { id: 'social-media', name: 'Social Media Management' },
      { id: 'email-comms', name: 'Email Communications' },
      { id: 'website-management', name: 'Website Management' },
    ]},
  ]},
  { id: 'governance-compliance', name: 'Governance & Compliance', icon: '🛡️', l1: [
    { id: 'board-governance', name: 'Board Governance', l2: [
      { id: 'board-management', name: 'Board Management' },
      { id: 'trustee-reporting', name: 'Trustee Reporting' },
      { id: 'strategic-planning-gov', name: 'Strategic Planning' },
    ]},
    { id: 'legal-compliance', name: 'Legal & Regulatory Compliance', l2: [
      { id: 'charity-law', name: 'Charity Law Compliance' },
      { id: 'data-protection', name: 'Data Protection & GDPR' },
      { id: 'safeguarding', name: 'Safeguarding' },
    ]},
    { id: 'risk-assurance', name: 'Risk & Assurance', l2: [
      { id: 'risk-register', name: 'Risk Register Management' },
      { id: 'internal-audit-np', name: 'Internal Audit' },
      { id: 'insurance-np', name: 'Insurance & Indemnity' },
    ]},
  ]},
  { id: 'people-culture', name: 'People & Culture', icon: '🌱', l1: [
    { id: 'talent-management', name: 'Talent Management', l2: [
      { id: 'staff-recruitment-np', name: 'Staff Recruitment' },
      { id: 'onboarding-np', name: 'Staff Onboarding' },
      { id: 'performance-np', name: 'Performance Management' },
    ]},
    { id: 'learning-development', name: 'Learning & Development', l2: [
      { id: 'training-delivery', name: 'Training Delivery' },
      { id: 'leadership-dev', name: 'Leadership Development' },
      { id: 'wellbeing', name: 'Staff Wellbeing' },
    ]},
    { id: 'culture-dei', name: 'Culture & DEI', l2: [
      { id: 'dei-strategy', name: 'Diversity, Equity & Inclusion' },
      { id: 'employee-engagement', name: 'Employee Engagement' },
      { id: 'culture-change', name: 'Culture Change' },
    ]},
  ]},
  { id: 'technology-data', name: 'Technology & Data', icon: '⚙️', l1: [
    { id: 'crm-systems', name: 'CRM & Donor Systems', l2: [
      { id: 'crm-management-np', name: 'CRM Configuration & Management' },
      { id: 'donation-platform', name: 'Donation Platform' },
      { id: 'data-integration-np', name: 'Data Integration' },
    ]},
    { id: 'programme-technology', name: 'Programme Technology', l2: [
      { id: 'case-mgmt-system', name: 'Case Management System' },
      { id: 'impact-tools', name: 'Impact Measurement Tools' },
      { id: 'volunteer-platform', name: 'Volunteer Management Platform' },
    ]},
    { id: 'data-analytics-np', name: 'Data & Analytics', l2: [
      { id: 'reporting-np', name: 'Operational Reporting' },
      { id: 'data-quality-np', name: 'Data Quality & Governance' },
      { id: 'predictive-insights', name: 'Predictive Insights' },
    ]},
  ]},
];

export const INDUSTRY_MODELS = [
  {
    id: 'recruitment-services',
    name: 'Recruitment Services',
    description: 'End-to-end recruitment and staffing capability model covering candidate sourcing, placement, contractor management, and finance.',
    capabilities: recruitmentCapabilities,
  },
  {
    id: 'non-profit',
    name: 'Non-Profit Organisation',
    description: 'Comprehensive non-profit capability model covering fundraising, programme delivery, volunteer management, and beneficiary outcomes.',
    capabilities: nonProfitCapabilities,
  },
];
