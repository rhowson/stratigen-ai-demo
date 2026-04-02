export async function fetchIndustryModels() {
  const res = await fetch('/api/industry-models');
  if (!res.ok) throw new Error('Failed to fetch industry models');
  const data = await res.json();
  return data.models;
}
