import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchProjects, fetchProjectById, updateProject } from '../services/projectService';
import { ChevronDown, Check, Loader } from 'react-feather';
import './ProjectSwitcher.css';

export default function ProjectSwitcher() {
  const { state, actions } = useApp();
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  // Fetch projects list when opening dropdown
  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      try {
        const list = await fetchProjects();
        setProjects(list);
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    }
  };

  const handleSelect = async (projectId) => {
    setIsOpen(false);
    if (projectId === state.projectId) return;

    try {
      const fullProject = await fetchProjectById(projectId);
      // Persist the selection for session restoration
      localStorage.setItem('stratigen_last_project_id', projectId);
      actions.loadProject(fullProject.state);
      actions.setProjectId(projectId);
    } catch (err) {
      console.error('Failed to load project state', err);
    }
  };

  const handleRename = async (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditing(false);
      const newName = editName.trim();
      if (!newName || newName === state.company?.name || !state.projectId) return;
      
      try {
        await updateProject(state.projectId, newName);
        actions.setCompany({ ...state.company, name: newName });
      } catch (err) {
        console.error('Failed to rename project', err);
      }
    }
  };

  const startEditing = () => {
    if (!state.projectId) return;
    setEditName(state.company.name);
    setIsEditing(true);
  };

  return (
    <div className="project-switcher-container">
      <div className="ps-current">
        {isEditing ? (
          <input 
            autoFocus
            className="ps-rename-input"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleRename}
          />
        ) : (
          <span 
            className="ps-name" 
            onClick={startEditing} 
            title={state.projectId ? "Click to rename project" : "Select a saved project to continue"}
            style={{ cursor: state.projectId ? 'text' : 'pointer' }}
          >
            {state.company?.name || 'Pick a Workspace...'}
          </span>
        )}
        
        <button className="ps-trigger" onClick={handleOpen}>
          <ChevronDown size={14} />
        </button>

        {state.projectId && (
          <span className="ps-status">
            {state.isSaving ? (
              <><Loader size={10} className="spinning" /> Saving...</>
            ) : (
              <><Check size={10} /> Saved</>
            )}
          </span>
        )}
      </div>

      {isOpen && (
        <>
          <div className="ps-backdrop" onClick={() => setIsOpen(false)} />
          <div className="ps-dropdown animate-fade-in">
            <div className="ps-dropdown-header">Recent Projects</div>
            <div className="ps-list">
              {projects.length === 0 ? (
                <div className="ps-empty">No projects found</div>
              ) : (
                projects.map(p => (
                  <button 
                    key={p.id} 
                    className={`ps-item ${p.id === state.projectId ? 'active' : ''}`}
                    onClick={() => handleSelect(p.id)}
                  >
                    <span className="ps-item-name">{p.name}</span>
                    <span className="ps-item-date">{new Date(p.updated_at).toLocaleDateString()}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
