const API_BASE = '';

/**
 * Fetch all available projects (summarised)
 */
export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/api/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();
  return data.projects;
}

/**
 * Fetch a specific project entirely
 */
export async function fetchProjectById(id) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  const data = await res.json();
  return data.project;
}

/**
 * Create a new project
 */
export async function createProject(name, state) {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, state }),
  });
  if (!res.ok) throw new Error('Failed to create project');
  const data = await res.json();
  return data.projectId;
}

/**
 * Update an existing project's state or name
 */
export async function updateProject(id, name, state) {
  const payload = {};
  if (name !== undefined) payload.name = name;
  if (state !== undefined) payload.state = state;

  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return true;
}
