import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getIndustryData } from '../../data/industryModels';
import { Target, Plus, X } from 'react-feather';

export default function StrategyInput() {
  const { state, actions } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState('KPI');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    actions.addObjective({ name: name.trim(), type });
    setName('');
  };

  const handleSuggestion = (suggestion) => {
    actions.addObjective({ name: suggestion.name, type: suggestion.type, kpiId: suggestion.kpiId });
  };

  const usedNames = new Set(state.objectives.map(o => o.name));
  const { suggestedObjectives } = getIndustryData(state.industryId);

  return (
    <div className="input-section">
      <div className="input-section-title">
        <Target size={15} />
        Strategic Objectives
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Objective Name</label>
          <input className="input" type="text" placeholder="e.g. Reduce Time to Fill" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Type</label>
            <select className="input" value={type} onChange={e => setType(e.target.value)}>
              <option value="KPI">KPI</option>
              <option value="OKR">OKR</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }} disabled={!name.trim()}>
            <Plus size={14} />
            Add
          </button>
        </div>
      </form>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <div className="form-label">Suggested for {state.industryName}</div>
        <div className="suggestion-chips">
          {suggestedObjectives
            .filter(s => !usedNames.has(s.name))
            .map((s, i) => (
              <span key={i} className="chip suggestion-chip" onClick={() => handleSuggestion(s)}>
                <Plus size={10} /> {s.name}
              </span>
            ))}
        </div>
      </div>

      {state.objectives.length > 0 && (
        <div className="item-list">
          {state.objectives.map(obj => (
            <div key={obj.id} className="item-card">
              <div className="item-card-header">
                <div>
                  <div className="item-card-title">{obj.name}</div>
                  <div className="item-card-meta">{obj.type}</div>
                </div>
                <button className="item-remove" onClick={() => actions.removeObjective(obj.id)}>
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
