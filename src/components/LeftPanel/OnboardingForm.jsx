import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchCompanyProfile, fetchCompetitorAnalysis } from '../../services/companyService';
import { CheckCircle, Globe, ArrowRight, Briefcase } from 'react-feather';

export default function OnboardingForm() {
  const { state, actions } = useApp();
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const companyData = { name: name.trim(), website: website.trim() };
    actions.setCompany(companyData);

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
          actions.toggleRightPanel(true); // Open panel to show insights
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
          Company Onboarded
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
        Enter details to load the industry model. AI will analyse the website for products, services, and competitors.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input className="input" type="text" placeholder="e.g. Michael Page" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Website</label>
          <input className="input" type="text" placeholder="e.g. michaelpage.co.uk" value={website} onChange={e => setWebsite(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!name.trim()}>
          Load Industry Model
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}
