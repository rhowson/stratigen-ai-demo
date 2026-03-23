import { createContext, useContext, useReducer, useCallback } from 'react';
import { capabilityModel, benchmarkProfiles, kpiLibrary, INDUSTRY_NAME } from '../data/recruitmentModel';
import { generateAllFixes } from '../engines/fixEngine';
import { generateWorkPackages } from '../engines/workPackageEngine';
import { generateAIOpportunities } from '../engines/aiEngine';
import { assessRegulations } from '../engines/regulatoryEngine';

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

  // Work packages
  workPackages: [],

  // AI layer
  aiOpportunities: [],
  aiLoading: false,
  showAILayer: false,

  // Regulatory
  regulations: [],
  showRegulatoryLayer: false,

  // Slide-in panel
  slidePanel: null,   // { type, data }

  // View state
  expandedL0: null,
  rightPanelOpen: false, // Start closed for cleaner UI
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_PROJECT':
      return { 
        ...action.payload, 
        rightPanelOpen: state.rightPanelOpen, 
        slidePanel: null,
        isSaving: false 
      };
    case 'SET_PROJECT_ID':
      return { ...state, projectId: action.payload };
    case 'SET_IS_SAVING':
      return { ...state, isSaving: action.payload };
    case 'TOGGLE_RIGHT_PANEL':
      return { ...state, rightPanelOpen: action.payload !== undefined ? action.payload : !state.rightPanelOpen };
    case 'SET_COMPANY': {
      // Clone capability model with neutral maturity (0 = unscored)
      const caps = JSON.parse(JSON.stringify(capabilityModel));
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
        company: action.payload,
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
        id: `pp-${Date.now()}`,
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

    case 'GENERATE_FIXES': {
      // Collect all impacted capabilities
      const allImpactedCaps = [];
      const painsByCapability = {};

      state.painPoints.forEach(pp => {
        pp.mappedCapabilities.forEach(cap => {
          if (!painsByCapability[cap.l2Id]) {
            painsByCapability[cap.l2Id] = [];
            allImpactedCaps.push(cap);
          }
          painsByCapability[cap.l2Id].push(pp);
        });
      });

      const fixes = generateAllFixes(allImpactedCaps, painsByCapability, state.maturityScores);
      return { 
        ...state, 
        fixes,
        workPackages: [],
        aiOpportunities: [],
        regulations: [],
      };
    }

    case 'CREATE_WORK_PACKAGES': {
      const fixes = state.fixes.length > 0 ? state.fixes : (() => {
        // Auto-generate fixes if not yet generated
        const allImpactedCaps = [];
        const painsByCapability = {};
        state.painPoints.forEach(pp => {
          pp.mappedCapabilities.forEach(cap => {
            if (!painsByCapability[cap.l2Id]) {
              painsByCapability[cap.l2Id] = [];
              allImpactedCaps.push(cap);
            }
            painsByCapability[cap.l2Id].push(pp);
          });
        });
        return generateAllFixes(allImpactedCaps, painsByCapability, state.maturityScores);
      })();

      const workPackages = generateWorkPackages(fixes);
      return { 
        ...state, 
        fixes, 
        workPackages,
        aiOpportunities: [],
        regulations: [],
      };
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

    case 'UPDATE_MATURITY':
      return {
        ...state,
        maturityScores: {
          ...state.maturityScores,
          [action.payload.capabilityId]: action.payload.score,
        },
      };

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
    setCompany: useCallback((data) => dispatch({ type: 'SET_COMPANY', payload: data }), []),
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
    generateFixes: useCallback(() => dispatch({ type: 'GENERATE_FIXES' }), []),
    createWorkPackages: useCallback(() => dispatch({ type: 'CREATE_WORK_PACKAGES' }), []),
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

        const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';
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
  };

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
