import { useState } from 'react';
import { Package, X, Check, Search } from 'react-feather';
import './WorkPackageSelectorModal.css';

export default function WorkPackageSelectorModal({ isOpen, onClose, workPackages, onConfirm, loading }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const allPackages = workPackages.flatMap(ws => 
    ws.packages.map((pkg, idx) => ({ 
      ...pkg, 
      l0Domain: ws.l0Domain,
      // Ensure local uniqueness even if IDs in state collide
      uniqueId: pkg.id && !pkg.id.startsWith('ws-') ? pkg.id : `${ws.id}-${pkg.name}-${idx}`
    }))
  );

  const filtered = allPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.l0Domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.uniqueId));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Package size={18} />
            Select Work Packages for AI Execution Plan
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Choose the work packages you want to include in the multi-dimensional AI implementation strategy.
          </p>
          
          <div className="selector-search">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search packages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="selector-list-header">
            <div className="selector-checkbox" onClick={handleSelectAll}>
              <div className={`checkbox-box ${selectedIds.length === filtered.length && filtered.length > 0 ? 'checked' : ''}`}>
                {selectedIds.length === filtered.length && filtered.length > 0 && <Check size={10} />}
              </div>
              <span>{selectedIds.length === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All'}</span>
            </div>
            <span className="selector-count">{selectedIds.length} selected</span>
          </div>

          <div className="selector-list">
            {filtered.map(pkg => (
              <div 
                key={pkg.uniqueId} 
                className={`selector-item ${selectedIds.includes(pkg.uniqueId) ? 'selected' : ''}`}
                onClick={() => toggleSelect(pkg.uniqueId)}
              >
                <div className="checkbox-box">
                  {selectedIds.includes(pkg.uniqueId) && <Check size={10} />}
                </div>
                <div className="selector-item-info">
                  <div className="selector-item-name">{pkg.name}</div>
                  <div className="selector-item-meta">{pkg.l0Domain} • {pkg.priority} Priority</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="selector-empty">No work packages found matching your search.</div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn-primary" 
            disabled={selectedIds.length === 0 || loading}
            onClick={() => {
              // Map back to the original package IDs or data for the action
              const selectedPkgs = allPackages.filter(p => selectedIds.includes(p.uniqueId));
              // If the original IDs are generic, we should pass the objects themselves or use the names/data
              onConfirm(selectedIds, selectedPkgs); 
            }}
          >
            {loading ? 'Building Strategy...' : `Build Execution Plan (${selectedIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
