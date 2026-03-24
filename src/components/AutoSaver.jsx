import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { createProject, updateProject } from '../services/projectService';

export default function AutoSaver() {
  const { state, actions } = useApp();
  const lastSavedState = useRef(null);
  const saveTimeout = useRef(null);
  const pendingSaveJson = useRef(null); // Tracks the state we are currently debouncing

  useEffect(() => {
    // Only save if onboarded and company exists
    if (!state.isOnboarded || !state.company) return;

    // Filter out UI states we don't need to persist
    const { 
      rightPanelOpen, 
      slidePanel, 
      isSaving, 
      profileLoading, 
      competitorLoading, 
      fixesLoading,
      aiLoading,
      ...persistentState 
    } = state;
    
    const currentStateJson = JSON.stringify(persistentState);

    // Skip if nothing changed from what is saved OR what is already queued to be saved
    if (lastSavedState.current === currentStateJson) return;
    if (pendingSaveJson.current === currentStateJson) return;
    
    console.log('[AutoSaver] Change detected, queuing save...');
    pendingSaveJson.current = currentStateJson;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      actions.setIsSaving(true);
      try {
        if (!state.projectId) {
          // Create new project
          const newId = await createProject(state.company.name, persistentState);
          // Pre-emptively update lastSavedState so the incoming setProjectId doesn't trigger a duplicate save
          lastSavedState.current = JSON.stringify({ ...persistentState, projectId: newId });
          actions.setProjectId(newId);
        } else {
          // Update existing
          await updateProject(state.projectId, state.company.name, persistentState);
          lastSavedState.current = currentStateJson;
        }
      } catch (err) {
        console.error('Autosave failed:', err);
      } finally {
        actions.setIsSaving(false);
        pendingSaveJson.current = null;
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(saveTimeout.current);
  }, [state, actions]);

  return null; // Invisible logic component
}
