import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getIndustryData } from '../../data/industryModels';
import { Zap, ArrowRight, Plus, Loader } from 'react-feather';
import { fetchPainPointMapping } from '../../services/companyService';

export default function PainPointInput() {
  const { state, actions } = useApp();
  const [text, setText] = useState('');
  const [isMapping, setIsMapping] = useState(false);

  const handleMapAction = async (painPointText) => {
    if (!painPointText.trim() || isMapping) return;
    
    setIsMapping(true);
    try {
      // Extract minimal capability list for AI to save tokens
      const caps = state.isOnboarded ? state.capabilities : capabilityModel;
      const capabilityNames = [];
      caps.forEach(l0 => {
        l0.l1.forEach(l1 => {
          l1.l2.forEach(l2 => {
            capabilityNames.push({ id: l2.id, name: l2.name, l1: l1.name, l0: l0.name });
          });
        });
      });

      const mappedIds = await fetchPainPointMapping(painPointText, capabilityNames);
      actions.addPainPoint(painPointText.trim(), mappedIds);
      setText('');
    } catch (err) {
      console.error('Failed to map pain point:', err);
      // Fallback: add pain point with empty mapping if AI fails
      actions.addPainPoint(painPointText.trim(), []);
    } finally {
      setIsMapping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMapAction(text);
  };

  const { painPointExamples } = getIndustryData(state.industryId);

  return (
    <div className="input-section">
      <div className="input-section-title">
        <Zap size={15} />
        Pain Points
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)', lineHeight: 1.6 }}>
        Describe business pain points in plain text. AI will automatically map them strictly to the right capability.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="input"
            placeholder="e.g. CV screening is too slow and manual, taking 3+ hours per role..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            disabled={isMapping}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!text.trim() || isMapping}>
          {isMapping ? (
            <><Loader size={12} className="spinning" style={{ marginRight: 6 }} /> Analysing...</>
          ) : (
            <>Map Pain Point <ArrowRight size={14} /></>
          )}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <div className="form-label">Quick Examples for {state.industryName}</div>
        <div className="suggestion-chips">
          {painPointExamples.map((ex, i) => (
            <span key={i} className="chip suggestion-chip" onClick={() => handleMapAction(ex)} style={{ pointerEvents: isMapping ? 'none' : 'auto', opacity: isMapping ? 0.5 : 1 }}>
              <Plus size={10} /> {ex.length > 35 ? ex.slice(0, 35) + '…' : ex}
            </span>
          ))}
        </div>
      </div>

      {state.painPoints.length > 0 && (
        <div className="item-list">
          {state.painPoints.map(pp => (
            <div key={pp.id} className="item-card">
              <div className="item-card-title" style={{ fontSize: 'var(--text-sm)' }}>{pp.text}</div>
              <div className="mapped-caps">
                {pp.mappedCapabilities.slice(0, 3).map((cap, i) => (
                  <span key={i} className="chip chip-amber" style={{ fontSize: '10px' }}>{cap.l2Name}</span>
                ))}
                {pp.mappedCapabilities.length > 3 && (
                  <span className="chip" style={{ fontSize: '10px' }}>+{pp.mappedCapabilities.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
