const API_BASE = '';

/**
 * Scrape company website and extract profile via OpenAI
 */
export async function fetchCompanyProfile(website) {
  const res = await fetch(`${API_BASE}/api/scrape-company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ website }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch company profile');
  }

  const data = await res.json();
  return data.profile;
}

/**
 * Run competitor analysis via OpenAI (background)
 */
export async function fetchCompetitorAnalysis(companyName, services, specialisations, description) {
  const res = await fetch(`${API_BASE}/api/competitor-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName, services, specialisations, description }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyse competitors');
  }

  const data = await res.json();
  return data.analysis;
}

/**
 * Map a pain point to L2 capabilities using OpenAI
 */
export async function fetchPainPointMapping(text, capabilityNames) {
  const res = await fetch(`${API_BASE}/api/map-pain-point`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, capabilityNames }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to map pain point');
  }

  const data = await res.json();
  return data.mappedCapabilityIds;
}
