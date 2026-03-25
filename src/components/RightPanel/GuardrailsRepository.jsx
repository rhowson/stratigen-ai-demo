import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Plus, Trash2, Edit2, Check, X, Lock } from 'react-feather';

export default function GuardrailsRepository() {
  const { state, actions } = useApp();
  const { guardrails } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [newGuardrail, setNewGuardrail] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    if (newGuardrail.trim()) {
      actions.addGuardrail(newGuardrail.trim());
      setNewGuardrail('');
      setIsAdding(false);
    }
  };

  const handleSaveEdit = (index) => {
    if (editText.trim()) {
      actions.updateGuardrail(index, editText.trim());
      setEditingIndex(null);
    }
  };

  return (
    <div className="kp-card animate-fade-in" style={{ marginBottom: '16px', borderLeft: '4px solid #f87171' }}>
      <div className="kp-card-header">
        <div className="kp-card-title" style={{ color: '#f87171' }}>
          <Lock size={14} />
          <span>AI Guardrails (Red Lines)</span>
        </div>
        {!isAdding && (
          <button className="add-btn-mini" onClick={() => setIsAdding(true)}>
            <Plus size={14} />
          </button>
        )}
      </div>

      <div className="kp-card-content" style={{ marginTop: '12px' }}>
        <p className="guardrail-intro" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
          These high-level policy rules are injected into all implementation specs to ensure alignment with company strategy.
        </p>

        <div className="guardrail-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {guardrails.map((g, i) => (
            <div key={i} className="guardrail-item" style={{ 
              background: 'rgba(248, 113, 113, 0.05)', 
              border: '1px solid rgba(248, 113, 113, 0.1)',
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {editingIndex === i ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ 
                      flex: 1, 
                      background: 'var(--bg-panel)', 
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}
                    autoFocus
                  />
                  <button className="icon-btn-confirm" onClick={() => handleSaveEdit(i)}><Check size={14} /></button>
                  <button className="icon-btn-cancel" onClick={() => setEditingIndex(null)}><X size={14} /></button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{g}</span>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button className="icon-btn-edit" onClick={() => { setEditingIndex(i); setEditText(g); }}>
                      <Edit2 size={12} />
                    </button>
                    <button className="icon-btn-delete" onClick={() => actions.deleteGuardrail(i)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAdding && (
            <div className="guardrail-input-wrap" style={{ marginTop: '8px' }}>
              <input 
                type="text"
                placeholder="Declare a new Red Line policy..."
                value={newGuardrail}
                onChange={(e) => setNewGuardrail(e.target.value)}
                style={{ 
                  width: '100%',
                  background: 'var(--bg-panel)', 
                  border: '1px solid #f87171',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  padding: '8px',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button className="btn-save" onClick={handleAdd}>Add Guardrail</button>
                <button className="btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
