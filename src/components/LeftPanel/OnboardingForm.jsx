import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchCompanyProfile, fetchCompetitorAnalysis } from '../../services/companyService';
import { fetchIndustryModels } from '../../services/industryService';
import { CheckCircle, Globe, Briefcase, ChevronDown } from 'react-feather';

export default function OnboardingForm() {
  const { state, actions } = useApp();
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industryModels, setIndustryModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [modelsLoading, setModelsLoading] = useState(true);

  useEffect(() => {
    fetchIndustryModels()
      .then(models => {
        setIndustryModels(models);
        if (models.length > 0) setSelectedModelId(models[0].id);
      })
      .catch(err => console.error('Failed to load industry models:', err))
      .finally(() => setModelsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedModelId) return;

    const selectedModel = industryModels.find(m => m.id === selectedModelId);
    const companyData = { name: name.trim(), website: website.trim() };
    actions.setCompany(companyData, selectedModel);

    if (website.trim()) {
      actions.setProfileLoading(true);
      try {
        const profile = await fetchCompanyProfile(website.trim());
        actions.setCompanyProfile(profile);

        actions.setCompetitorLoading(true);
        fetchCompetitorAnalysis(
          name.trim(), profile.services, profile.specialisations, profile.description
        ).then(analysis => {
          actions.setCompetitors(analysis);
          actions.toggleRightPanel(true);
        }).catch(err => {
          console.error('Competitor analysis failed:', err);
          actions.setCompetitorError(err.message);
        });
      } catch (err) {
        console.error('Profile fetch failed:', err);
        actions.setProfileError(err.message);
      }
    }
  };

  if (state.isOnboarded) {
    const { companyProfile, profileLoading, profileError } = state;

    return (
      <div className="input-section">
        <div className="input-section-title">
          <CheckCircle size={15} />
          Industry Model Loaded
        </div>

        <div className="item-card" style={{ marginBottom: 'var(--space-md)' }}>
          <div className="item-card-title">{state.company.name}</div>
          {state.company.website && (
            <div className="item-card-meta">
              <Globe size={11} style={{ marginRight: 4 }} />
              {state.company.website}
            </div>
          )}
          <div className="mapped-caps" style={{ marginTop: '8px' }}>
            <span className="chip chip-cyan">{state.industryName}</span>
            <span className="chip chip-emerald">{state.capabilities.length} Domains</span>
          </div>
        </div>

        <div className="profile-section" style={{ marginBottom: 'var(--space-md)' }}>
          <div className="profile-section-label">Operational Domains</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            {state.capabilities.map(l0 => (
              <div key={l0.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 8px',
                background: 'var(--surface-secondary)',
                borderRadius: '6px',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
              }}>
                <span style={{ fontSize: '13px' }}>{l0.icon}</span>
                <span>{l0.name}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>
                  {l0.l1.reduce((acc, l1) => acc + l1.l2.length, 0)} caps
                </span>
              </div>
            ))}
          </div>
        </div>

        {profileLoading && (
          <div className="profile-loading">
            <div className="skeleton-header" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="profile-loading-label">
              <span className="loading-dot" />
              Analysing website with AI...
            </div>
          </div>
        )}

        {profileError && (
          <div className="profile-error">Could not analyse website: {profileError}</div>
        )}

        {companyProfile && (
          <div className="company-profile animate-fade-in">
            {companyProfile.tagline && (
              <div className="profile-tagline">"{companyProfile.tagline}"</div>
            )}

            {companyProfile.description && (
              <div className="profile-section">
                <div className="profile-section-label">About</div>
                <p className="profile-description">{companyProfile.description}</p>
              </div>
            )}

            {companyProfile.services?.length > 0 && (
              <div className="profile-section">
                <div className="profile-section-label">Services</div>
                <div className="profile-tags">
                  {companyProfile.services.map((s, i) => (
                    <span key={i} className="chip chip-emerald">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {companyProfile.specialisations?.length > 0 && (
              <div className="profile-section">
                <div className="profile-section-label">Specialisations</div>
                <div className="profile-tags">
                  {companyProfile.specialisations.map((s, i) => (
                    <span key={i} className="chip chip-cyan">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {companyProfile.keyDifferentiators?.length > 0 && (
              <div className="profile-section">
                <div className="profile-section-label">Differentiators</div>
                <div className="profile-tags">
                  {companyProfile.keyDifferentiators.map((d, i) => (
                    <span key={i} className="chip chip-amber">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="input-section">
      <div className="input-section-title">
        <Briefcase size={15} />
        Company Onboarding
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
        Select an industry model and enter company details. AI will analyse the website for products, services, and competitors.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Industry Model</label>
          <div style={{ position: 'relative' }}>
            <select
              className="input"
              value={selectedModelId}
              onChange={e => setSelectedModelId(e.target.value)}
              disabled={modelsLoading}
              style={{ appearance: 'none', paddingRight: '32px', cursor: 'pointer' }}
            >
              {modelsLoading && <option value="">Loading models...</option>}
              {industryModels.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-tertiary)',
              }}
            />
          </div>
          {selectedModelId && industryModels.find(m => m.id === selectedModelId)?.description && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px', lineHeight: 1.5 }}>
              {industryModels.find(m => m.id === selectedModelId).description}
            </p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            className="input"
            type="text"
            placeholder="e.g. Michael Page"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Website <span style={{ color: 'var(--text-tertiary)' }}>(optional)</span></label>
          <input
            className="input"
            type="text"
            placeholder="e.g. michaelpage.co.uk"
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={!name.trim() || !selectedModelId || modelsLoading}
        >
          Load Industry Model
        </button>
      </form>
    </div>
  );
}
