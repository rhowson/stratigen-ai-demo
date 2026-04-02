import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { capabilityModel, benchmarkProfiles, kpiLibrary, INDUSTRY_NAME } from '../data/recruitmentModel';
import { generateAllFixes } from '../engines/fixEngine';
import { generateWorkPackages } from '../engines/workPackageEngine';
import { generateAIOpportunities } from '../engines/aiEngine';
import { assessRegulations } from '../engines/regulatoryEngine';
import { fetchProjectById } from '../services/projectService';

const AppContext = createContext(null);

const initialState = {
  // Project
  projectId: null,
  isSaving: false,

  // Company
  company: null,
  isOnboarded: false,

  // Company profile (scraped)
  companyProfile: null,
  profileLoading: false,
  profileError: null,

  // Competitors
  competitors: null,
  competitorLoading: false,
  competitorError: null,

  // Industry model
  industryId: 'recruitment-services',
  industryName: INDUSTRY_NAME,
  capabilities: [],

  // Maturity scores (l2Id → score)
  maturityScores: {},

  // Strategy
  objectives: [],

  // Pain points
  painPoints: [],
  impactedCapabilities: {},  // l2Id → [painPointIds]

  // Fixes
  fixes: [],
  fixesLoading: false,
  fixProgress: { current: 0, total: 0, status: '' },

  // Work packages
  workPackages: [],
  wpLoading: false,
  wpProgress: { current: 0, total: 0, status: '' },

  // AI layer
  aiOpportunities: [],
  aiLoading: false,
  showAILayer: false,

  // Regulatory
  regulations: [],
  showRegulatoryLayer: false,

  // AI Execution Plan
  selectedWorkPackageIds: [],
  aiExecutionPlan: null,
  execLoading: false,
  execProgress: { current: 0, total: 0, status: '' },

  // Slide-in panel
  slidePanel: null,   // { type, data }

  // AI Implementation Spec Workspace
  selectedSpec: null,
  specLoading: false,
  selectedWorkPackage: null, // For the new immersive modal
  guardrails: [
    'Ensure all AI-generated content is reviewed by a human before external distribution.',
    'Do not include personally identifiable information (PII) in LLM prompts.',
    'All AI-generated code must pass through existing security scanning pipelines.'
  ],

  // View state
  expandedL0: null,
  rightPanelOpen: false, 
  leftPanelCollapsed: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LEFT_PANEL':
      return { ...state, leftPanelCollapsed: !state.leftPanelCollapsed };
    case 'SET_LEFT_PANEL_COLLAPSED':
      return { ...state, leftPanelCollapsed: action.payload };

    case 'LOAD_PROJECT':
      return { 
        ...initialState, // Ensure new fields like guardrails are present
        ...action.payload, 
        // Always reset transient loading states on project load to prevent hang states
        wpLoading: false,
        aiLoading: false,
        execLoading: false,
        specLoading: false,
        selectedSpec: null,
        isSaving: false,
        profileLoading: false,
        competitorLoading: false,
        fixProgress: { current: 0, total: 0, status: '' },
        wpProgress: { current: 0, total: 0, status: '' },
        execProgress: { current: 0, total: 0, status: '' },
        rightPanelOpen: state.rightPanelOpen, 
        slidePanel: null
      };
    case 'RESET_PROJECT':
      return {
        ...initialState,
        industryName: INDUSTRY_NAME,
        capabilities: [],
        maturityScores: {},
        objectives: [],
        painPoints: [],
        impactedCapabilities: {},
        fixes: [],
        workPackages: [],
        aiOpportunities: [],
        regulations: [],
        selectedWorkPackageIds: [],
        aiExecutionPlan: null,
        isOnboarded: false,
        company: null,
        projectId: null
      };

    case 'RESET_PROJECT_DATA': {
      // Re-initialise maturity scores to 0 for all loaded capabilities
      const resetMaturity = {};
      state.capabilities.forEach(l0 => {
        l0.l1.forEach(l1 => {
          l1.l2.forEach(l2 => { resetMaturity[l2.id] = 0; });
        });
      });
      return {
        ...state,
        objectives: [],
        painPoints: [],
        impactedCapabilities: {},
        maturityScores: resetMaturity,
        fixes: [],
        fixesLoading: false,
        fixProgress: { current: 0, total: 0, status: '' },
        workPackages: [],
        wpLoading: false,
        wpProgress: { current: 0, total: 0, status: '' },
        aiOpportunities: [],
        aiLoading: false,
        showAILayer: false,
        regulations: [],
        showRegulatoryLayer: false,
        selectedWorkPackageIds: [],
        aiExecutionPlan: null,
        execLoading: false,
        execProgress: { current: 0, total: 0, status: '' },
        selectedSpec: null,
        slidePanel: null,
        companyProfile: null,
        profileLoading: false,
        profileError: null,
        competitors: null,
        competitorLoading: false,
        competitorError: null,
      };
    }
    case 'RESET_LOADING':
      return {
        ...state,
        fixesLoading: false,
        wpLoading: false,
        aiLoading: false,
        execLoading: false,
        specLoading: false,
        isSaving: false,
        profileLoading: false,
        competitorLoading: false,
        fixProgress: { current: 0, total: 0, status: '' },
        wpProgress: { current: 0, total: 0, status: '' },
        execProgress: { current: 0, total: 0, status: '' },
      };
    case 'SET_PROJECT_ID':
      return { ...state, projectId: action.payload };
    case 'SET_IS_SAVING':
      return { ...state, isSaving: action.payload };
    case 'TOGGLE_RIGHT_PANEL':
      return { ...state, rightPanelOpen: action.payload !== undefined ? action.payload : !state.rightPanelOpen };
    case 'SET_COMPANY': {
      // Support both legacy call (payload = company) and new call (payload = { company, model })
      const company = action.payload?.company ?? action.payload;
      const modelCaps = action.payload?.model?.capabilities ?? capabilityModel;
      const industryName = action.payload?.model?.name ?? INDUSTRY_NAME;

      // Clone capability model with neutral maturity (0 = unscored)
      const caps = JSON.parse(JSON.stringify(modelCaps));
      const maturityScores = {};
      caps.forEach(l0 => {
        l0.l1.forEach(l1 => {
          l1.l2.forEach(l2 => {
            maturityScores[l2.id] = 0; // Neutral until input drives scoring
          });
        });
      });

      return {
        ...state,
        company,
        industryId: action.payload?.model?.id ?? 'recruitment-services',
        industryName,
        isOnboarded: true,
        capabilities: caps,
        maturityScores,
      };
    }

    case 'ADD_OBJECTIVE':
      return {
        ...state,
        objectives: [...state.objectives, { id: `obj-${Date.now()}`, ...action.payload }],
      };

    case 'REMOVE_OBJECTIVE':
      return {
        ...state,
        objectives: state.objectives.filter(o => o.id !== action.payload),
      };

    case 'ADD_PAIN_POINT': {
      const painPoint = {
        id: `pp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: action.payload.text,
        mappedCapabilities: action.payload.mappedCapabilities,
        timestamp: new Date().toISOString(),
      };

      const newImpacted = { ...state.impactedCapabilities };
      const newMaturity = { ...state.maturityScores };

      painPoint.mappedCapabilities.forEach(cap => {
        if (!newImpacted[cap.l2Id]) {
          newImpacted[cap.l2Id] = [];
        }
        newImpacted[cap.l2Id].push(painPoint.id);

        // If capability was neutral (0), initialize from benchmark then degrade
        if (newMaturity[cap.l2Id] === 0) {
          const bench = benchmarkProfiles[cap.l2Id];
          const baseline = bench ? bench.industryBaseline : 2.5;
          newMaturity[cap.l2Id] = Math.max(1, baseline - 1);
        } else if (newMaturity[cap.l2Id] > 1) {
          // Further degrade on additional pain points
          newMaturity[cap.l2Id] = Math.max(1, newMaturity[cap.l2Id] - 0.5);
        }
      });

      return {
        ...state,
        painPoints: [...state.painPoints, painPoint],
        impactedCapabilities: newImpacted,
        maturityScores: newMaturity,
        // Clear old fixes/packages when pain points change
        fixes: [],
        workPackages: [],
        aiOpportunities: [],
        regulations: [],
      };
    }

    case 'SET_FIXES_LOADING':
      if (action.payload) {
        return { 
          ...state, 
          fixesLoading: true, 
          fixes: [], 
          fixProgress: { current: 0, total: 0, status: 'Initializing...' },
          workPackages: [], 
          aiOpportunities: [], 
          regulations: [] 
        };
      }
      return { ...state, fixesLoading: false };

    case 'SET_FIX_PROGRESS':
      return { ...state, fixProgress: { ...state.fixProgress, ...action.payload } };

    case 'APPEND_FIX':
      return { ...state, fixes: [...state.fixes, action.payload] };

    case 'GENERATE_FIXES': {
      return { 
        ...state, 
        fixes: action.payload || [],
        fixesLoading: false,
        workPackages: [],
        aiOpportunities: [],
        regulations: [],
      };
    }

    case 'SET_WP_LOADING':
      if (action.payload) {
        return { 
          ...state, 
          wpLoading: true, 
          workPackages: [], 
          wpProgress: { current: 0, total: 0, status: 'Grouping capabilities...' },
          aiOpportunities: [], 
          regulations: [] 
        };
      }
      return { ...state, wpLoading: false };

    case 'SET_WP_PROGRESS':
      return { ...state, wpProgress: { ...state.wpProgress, ...action.payload } };

    case 'APPEND_WP': {
      const wp = { ...action.payload, id: action.payload.id || `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` };
      const existingWS = state.workPackages.find(ws => ws.l0Domain === wp.l0Domain);
      
      if (existingWS) {
        const updatedWS = {
          ...existingWS,
          packages: [...existingWS.packages, wp],
          totalFixes: existingWS.totalFixes + wp.fixes.length,
          avgMaturityGap: ((parseFloat(existingWS.avgMaturityGap) * existingWS.packages.length + wp.priorityScore) / (existingWS.packages.length + 1)).toFixed(1)
        };
        return {
          ...state,
          workPackages: state.workPackages.map(ws => ws.l0Domain === wp.l0Domain ? updatedWS : ws)
        };
      } else {
        const newWS = {
          id: `ws-${wp.l0Domain.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: `${wp.l0Domain} Transformation`,
          l0Domain: wp.l0Domain,
          packages: [wp],
          totalFixes: wp.fixes.length,
          avgMaturityGap: wp.priorityScore.toFixed(1)
        };
        return {
          ...state,
          workPackages: [...state.workPackages, newWS].sort((a,b) => b.avgMaturityGap - a.avgMaturityGap)
        };
      }
    }

    case 'SET_AI_LOADING':
      // If we are starting to load, clear the old AI opportunities
      if (action.payload) {
        return { ...state, aiLoading: true, aiOpportunities: [], regulations: [] };
      }
      return { ...state, aiLoading: false };

    case 'GENERATE_AI': {
      const aiOpportunities = action.payload || [];
      const regulations = assessRegulations(aiOpportunities);
      return { ...state, aiOpportunities, regulations, showAILayer: true, aiLoading: false };
    }

    case 'TOGGLE_AI_LAYER':
      return { ...state, showAILayer: !state.showAILayer };

    case 'TOGGLE_REGULATORY_LAYER':
      return { ...state, showRegulatoryLayer: !state.showRegulatoryLayer };

    case 'SET_PROFILE_LOADING':
      return { ...state, profileLoading: action.payload, profileError: null };

    case 'SET_COMPANY_PROFILE':
      return { ...state, companyProfile: action.payload, profileLoading: false, profileError: null };

    case 'SET_PROFILE_ERROR':
      return { ...state, profileLoading: false, profileError: action.payload };

    case 'SET_COMPETITOR_LOADING':
      return { ...state, competitorLoading: action.payload, competitorError: null };

    case 'SET_COMPETITORS':
      return { ...state, competitors: action.payload, competitorLoading: false, competitorError: null };

    case 'SET_COMPETITOR_ERROR':
      return { ...state, competitorLoading: false, competitorError: action.payload };

    case 'OPEN_SLIDE_PANEL':
      return { ...state, slidePanel: action.payload };

    case 'CLOSE_SLIDE_PANEL':
      return { ...state, slidePanel: null };

    case 'SET_EXPANDED_L0':
      return { ...state, expandedL0: state.expandedL0 === action.payload ? null : action.payload };

    case 'SET_SELECTED_WPS':
      return { ...state, selectedWorkPackageIds: action.payload };

    case 'SET_EXEC_LOADING':
      return { 
        ...state, 
        execLoading: action.payload,
        execProgress: action.payload ? { current: 0, total: 0, status: 'Initialising analysis...' } : state.execProgress
      };

    case 'SET_EXEC_PROGRESS':
      return { ...state, execProgress: { ...state.execProgress, ...action.payload } };

    case 'SET_EXEC_PLAN':
      return { ...state, aiExecutionPlan: action.payload, execLoading: false };

    case 'ADD_GUARDRAIL':
      return { ...state, guardrails: [...state.guardrails, action.payload] };

    case 'UPDATE_GUARDRAIL':
      return { 
        ...state, 
        guardrails: state.guardrails.map((g, i) => i === action.payload.index ? action.payload.text : g) 
      };

    case 'DELETE_GUARDRAIL':
      return { 
        ...state, 
        guardrails: state.guardrails.filter((_, i) => i !== action.payload) 
      };

    case 'SAVE_SPEC_TO_PLAN':
      return {
        ...state,
        aiExecutionPlan: state.aiExecutionPlan.map(plan => 
          plan.workPackageId === action.payload.wpId 
            ? { ...plan, cachedSpecs: { ...plan.cachedSpecs, [action.payload.level]: action.payload.spec } }
            : plan
        )
      };

    case 'SET_SELECTED_SPEC':
      return { ...state, selectedSpec: action.payload };

    case 'SET_SPEC_LOADING':
      return { ...state, specLoading: action.payload };

    case 'UPDATE_MATURITY':
      return {
        ...state,
        maturityScores: {
          ...state.maturityScores,
          [action.payload.capabilityId]: action.payload.score,
        },
      };

    case 'SET_SELECTED_WP':
      return { ...state, selectedWorkPackage: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    loadProject: useCallback((data) => dispatch({ type: 'LOAD_PROJECT', payload: data }), []),
    setProjectId: useCallback((id) => dispatch({ type: 'SET_PROJECT_ID', payload: id }), []),
    setIsSaving: useCallback((val) => dispatch({ type: 'SET_IS_SAVING', payload: val }), []),
    setCompany: useCallback((data, model) => dispatch({ type: 'SET_COMPANY', payload: model ? { company: data, model } : data }), []),
    addObjective: useCallback((obj) => dispatch({ type: 'ADD_OBJECTIVE', payload: obj }), []),
    removeObjective: useCallback((id) => dispatch({ type: 'REMOVE_OBJECTIVE', payload: id }), []),
    addPainPoint: useCallback((text, mappedIds = []) => {
      const caps = state.isOnboarded ? state.capabilities : capabilityModel;
      
      // Convert raw AI mapped IDs to the structured format expected by state
      const mapped = [];
      caps.forEach(l0 => {
        l0.l1.forEach(l1 => {
          l1.l2.forEach(l2 => {
            if (mappedIds.includes(l2.id)) {
              mapped.push({ l0Name: l0.name, l1Name: l1.name, l2Id: l2.id, l2Name: l2.name });
            }
          });
        });
      });

      dispatch({ type: 'ADD_PAIN_POINT', payload: { text, mappedCapabilities: mapped } });
    }, [state.isOnboarded, state.capabilities]),
    generateFixes: useCallback(async () => {
      dispatch({ type: 'SET_FIXES_LOADING', payload: true });
      try {
        // Collect all impacted capabilities
        const queue = [];
        const painsByCapability = {};
        state.painPoints.forEach(pp => {
          pp.mappedCapabilities.forEach(cap => {
            if (!painsByCapability[cap.l2Id]) {
              painsByCapability[cap.l2Id] = [];
              queue.push(cap);
            }
            painsByCapability[cap.l2Id].push(pp);
          });
        });

        dispatch({ type: 'SET_FIX_PROGRESS', payload: { current: 0, total: queue.length, status: 'Starting sequential analysis...' } });

        const API_BASE = '';

        let count = 0;
        for (const cap of queue) {
          count++;
          dispatch({ type: 'SET_FIX_PROGRESS', payload: {
            current: count,
            status: `Analyzing ${cap.l2Name || cap.name}...`
          }});

          const res = await fetch(`${API_BASE}/api/generate-fixes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyProfile: state.companyProfile,
              companyName: state.company?.name,
              objectives: state.objectives,
              impactedCapabilities: [cap], // Pass single capability for max focus
              painsByCapability: { [cap.l2Id]: painsByCapability[cap.l2Id] },
              maturityScores: { [cap.l2Id]: state.maturityScores[cap.l2Id] || 1 },
            }),
          });
          const data = await res.json();

          if (data.success && data.fixes?.[0]) {
            const fixWithPains = {
              ...data.fixes[0],
              painPoints: painsByCapability[cap.l2Id] || [],
              benchmark: benchmarkProfiles[cap.l2Id] || { industryBaseline: 3, bestInClass: 5 }
            };
            dispatch({ type: 'APPEND_FIX', payload: fixWithPains });
          }
        }

        dispatch({ type: 'SET_FIXES_LOADING', payload: false });
      } catch (err) {
        console.error('Fix generation error:', err);
        dispatch({ type: 'SET_FIXES_LOADING', payload: false });
      }
    }, [state.painPoints, state.company, state.companyProfile, state.maturityScores, state.objectives]),
    createWorkPackages: useCallback(async () => {
      if (state.fixes.length === 0) return;
      
      dispatch({ type: 'SET_WP_LOADING', payload: true });
      try {
        // Group fixes by L1 domain
        const l1Groups = {};
        state.fixes.forEach(fix => {
          if (!l1Groups[fix.l1Name]) {
            l1Groups[fix.l1Name] = {
              l1Name: fix.l1Name,
              l0Name: fix.l0Name,
              fixes: []
            };
          }
          l1Groups[fix.l1Name].fixes.push(fix);
        });

        const queue = Object.values(l1Groups);
        dispatch({ type: 'SET_WP_PROGRESS', payload: { current: 0, total: queue.length, status: 'Starting packaging...' } });

        const API_BASE = '';
        
        let count = 0;
        for (const group of queue) {
          count++;
          dispatch({ type: 'SET_WP_PROGRESS', payload: { 
            current: count, 
            status: `Packaging ${group.l1Name}...` 
          }});

          const res = await fetch(`${API_BASE}/api/generate-work-packages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyName: state.company?.name,
              l1Domain: group.l1Name,
              l0Domain: group.l0Name,
              fixes: group.fixes,
              objectives: state.objectives,
              companyProfile: state.companyProfile
            }),
          });
          const data = await res.json();

          if (data.success && data.workPackage) {
            // Re-attach the rich fixes from our local group to the work package
            const wpWithFixes = {
              ...data.workPackage,
              fixes: group.fixes
            };
            dispatch({ type: 'APPEND_WP', payload: wpWithFixes });
          }
        }

        dispatch({ type: 'SET_WP_LOADING', payload: false });
      } catch (err) {
        console.error('Work packaging error:', err);
        dispatch({ type: 'SET_WP_LOADING', payload: false });
      }
    }, [state.fixes, state.company, state.objectives, state.companyProfile]),
    generateAI: useCallback(async () => {
      dispatch({ type: 'SET_AI_LOADING', payload: true });
      try {
        // Build capability context from fixes
        const capabilities = state.fixes.map(f => ({
          capabilityId: f.capabilityId,
          capabilityName: f.capabilityName,
          l0Name: f.l0Name,
          l1Name: f.l1Name,
          painPoints: f.painPoints || [],
        }));

        const API_BASE = '';
        const res = await fetch(`${API_BASE}/api/generate-ai-analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: state.company?.name,
            capabilities,
          }),
        });
        const data = await res.json();

        if (data.success) {
          // Normalise GPT response into the existing opportunities shape
          const normalised = (data.opportunities || []).map(opp => ({
            capabilityId: opp.capabilityId,
            capabilityName: opp.capabilityName,
            l0Name: opp.l0Name,
            l1Name: opp.l1Name,
            maturityGap: opp.estimatedImpact === 'High' ? 3 : opp.estimatedImpact === 'Medium' ? 2 : 1,
            estimatedImpact: opp.estimatedImpact,
            implementationComplexity: opp.implementationComplexity,
            levels: [{
              level: opp.level,
              type: opp.type,
              description: opp.description,
              valueAndBenefits: opp.valueAndBenefits || '',
              processImpact: opp.processImpact || '',
              nextSteps: opp.nextSteps || [],
              tools: opp.tools || [],
            }],
          }));
          dispatch({ type: 'GENERATE_AI', payload: normalised });
        } else {
          console.error('AI analysis failed:', data.error);
          dispatch({ type: 'SET_AI_LOADING', payload: false });
        }
      } catch (err) {
        console.error('AI generate error:', err);
        dispatch({ type: 'SET_AI_LOADING', payload: false });
      }
    }, [state.fixes, state.company]),
    toggleAILayer: useCallback(() => dispatch({ type: 'TOGGLE_AI_LAYER' }), []),
    toggleRegulatoryLayer: useCallback(() => dispatch({ type: 'TOGGLE_REGULATORY_LAYER' }), []),
    setProfileLoading: useCallback((v) => dispatch({ type: 'SET_PROFILE_LOADING', payload: v }), []),
    setCompanyProfile: useCallback((p) => dispatch({ type: 'SET_COMPANY_PROFILE', payload: p }), []),
    setProfileError: useCallback((e) => dispatch({ type: 'SET_PROFILE_ERROR', payload: e }), []),
    setCompetitorLoading: useCallback((v) => dispatch({ type: 'SET_COMPETITOR_LOADING', payload: v }), []),
    setCompetitors: useCallback((c) => dispatch({ type: 'SET_COMPETITORS', payload: c }), []),
    setCompetitorError: useCallback((e) => dispatch({ type: 'SET_COMPETITOR_ERROR', payload: e }), []),
    openSlidePanel: useCallback((type, data) => dispatch({ type: 'OPEN_SLIDE_PANEL', payload: { type, data } }), []),
    closeSlidePanel: useCallback(() => dispatch({ type: 'CLOSE_SLIDE_PANEL' }), []),
    setExpandedL0: useCallback((id) => dispatch({ type: 'SET_EXPANDED_L0', payload: id }), []),
    updateMaturity: useCallback((capabilityId, score) => dispatch({ type: 'UPDATE_MATURITY', payload: { capabilityId, score } }), []),
    toggleRightPanel: useCallback((isOpen) => dispatch({ type: 'TOGGLE_RIGHT_PANEL', payload: isOpen }), []),
    resetLoadingStates: useCallback(() => dispatch({ type: 'RESET_LOADING' }), []),
    
    setSelectedWorkPackages: useCallback((ids) => dispatch({ type: 'SET_SELECTED_WPS', payload: ids }), []),
    generateExecutionPlan: useCallback(async (selectedWPs) => {
      dispatch({ type: 'SET_EXEC_LOADING', payload: true });
      try {
        if (!selectedWPs || selectedWPs.length === 0) {
          dispatch({ type: 'SET_EXEC_LOADING', payload: false });
          return;
        }

        dispatch({ type: 'SET_EXEC_PROGRESS', payload: { current: 0, total: selectedWPs.length, status: 'Starting sequential execution analysis...' } });

        const API_BASE = '';
        const results = [];

        let count = 0;
        for (const wp of selectedWPs) {
          count++;
          dispatch({ type: 'SET_EXEC_PROGRESS', payload: {
            current: count,
            status: `Analysing ${wp.name}...`
          }});

          const res = await fetch(`${API_BASE}/api/generate-ai-execution-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyName: state.company?.name,
              companyProfile: state.companyProfile,
              workPackage: wp,
              objectives: state.objectives
            }),
          });
          const data = await res.json();
          if (data.success && data.plan) {
            results.push(data.plan);
          }
        }

        dispatch({ type: 'SET_EXEC_PLAN', payload: results });
      } catch (err) {
        console.error('Execution plan error:', err);
        dispatch({ type: 'SET_EXEC_LOADING', payload: false });
      }
    }, [state.workPackages, state.company, state.companyProfile, state.objectives]),

    addGuardrail: useCallback((text) => dispatch({ type: 'ADD_GUARDRAIL', payload: text }), []),
    updateGuardrail: useCallback((index, text) => dispatch({ type: 'UPDATE_GUARDRAIL', payload: { index, text } }), []),
    deleteGuardrail: useCallback((index) => dispatch({ type: 'DELETE_GUARDRAIL', payload: index }), []),
    
    generateAISpec: useCallback(async (level, suggestion, wpName, context, wpId, force = false) => {
      // Check cache first if we have a wpId and not forcing regeneration
      if (wpId && state.aiExecutionPlan && !force) {
        const plan = state.aiExecutionPlan.find(p => p.workPackageId === wpId);
        if (plan?.cachedSpecs?.[level]) {
          dispatch({ type: 'SET_SELECTED_SPEC', payload: plan.cachedSpecs[level] });
          return;
        }
      }

      dispatch({ type: 'SET_SPEC_LOADING', payload: true });
      try {
        const API_BASE = '';
        const res = await fetch(`${API_BASE}/api/generate-ai-spec`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            suggestion,
            workPackageName: wpName,
            context,
            guardrails: state.guardrails
          }),
        });
        const data = await res.json();
        if (data.success) {
          const fullSpec = { ...data.spec, level, suggestion, wpName, wpId };
          
          if (wpId) {
            dispatch({ type: 'SAVE_SPEC_TO_PLAN', payload: { wpId, level, spec: fullSpec } });
          }
          
          dispatch({ type: 'SET_SELECTED_SPEC', payload: fullSpec });
        }
      } catch (err) {
        console.error('Spec generation error:', err);
      } finally {
        dispatch({ type: 'SET_SPEC_LOADING', payload: false });
      }
    }, [state.guardrails, state.aiExecutionPlan]),
    
    closeSpecWorkspace: useCallback(() => dispatch({ type: 'SET_SELECTED_SPEC', payload: null }), []),
    setSelectedWorkPackage: useCallback((wp) => dispatch({ type: 'SET_SELECTED_WP', payload: wp }), []),
    toggleLeftPanel: useCallback(() => dispatch({ type: 'TOGGLE_LEFT_PANEL' }), []),
    setLeftPanelCollapsed: useCallback((val) => dispatch({ type: 'SET_LEFT_PANEL_COLLAPSED', payload: val }), []),
    resetProject: useCallback(() => {
      localStorage.removeItem('stratigen_last_project_id');
      dispatch({ type: 'RESET_PROJECT' });
    }, []),
    resetProjectData: useCallback(() => dispatch({ type: 'RESET_PROJECT_DATA' }), []),
  };

  // Session Restoration (Auto-Hydration)
  useEffect(() => {
    const hydrate = async () => {
      const lastId = localStorage.getItem('stratigen_last_project_id');
      if (lastId && !state.projectId) {
        try {
          console.log(`[Hydration] Restoring session: ${lastId}`);
          const fullProject = await fetchProjectById(lastId);
          // Persist the selection for session restoration
          localStorage.setItem('stratigen_last_project_id', lastId);
          actions.loadProject(fullProject.state);
          actions.setProjectId(lastId);
        } catch (err) {
          console.error('[Hydration] Failed to restore session:', err);
          localStorage.removeItem('stratigen_last_project_id');
        }
      }
    };
    hydrate();
  }, [actions]); // Only run once on mount

  return (
    <AppContext.Provider value={{ state, actions, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export { kpiLibrary };
