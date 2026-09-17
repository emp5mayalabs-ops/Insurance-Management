// API Client for Insurance Management System
// Uses URL configured in .env (e.g. VITE_API_URL=http://localhost:8000)
// Endpoints:
// 1. GET    /                               -> Backend status
// 2. POST   /api/admin/login/               -> Admin login
// 3. POST   /api/admin/agents/create/       -> Create agent
// 4. GET    /api/admin/agents/              -> View all agents
// 5. GET    /api/admin/agents/<id>/         -> View one agent
// 6. PUT    /api/admin/agents/<id>/update/  -> Edit agent
// 7. PUT    /api/admin/agents/<id>/update/  -> Activate/deactivate
// 8. DELETE /api/admin/agents/<id>/delete/  -> Delete agent

export const getBaseUrl = () => {
  const envUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8000';
  return envUrl.replace(/\/+$/, '');
};

// Helper to construct authorization and content headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('insure_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to parse backend error responses
async function extractErrorMessage(response) {
  try {
    const errorData = await response.json();
    if (errorData.detail) return errorData.detail;
    if (errorData.message) return errorData.message;
    if (errorData.error) return errorData.error;
    // Django REST Framework field validation errors: { field: ["error message"] }
    const firstKey = Object.keys(errorData)[0];
    if (firstKey) {
      const val = errorData[firstKey];
      if (Array.isArray(val)) return `${firstKey}: ${val.join(', ')}`;
      if (typeof val === 'string') return `${firstKey}: ${val}`;
    }
    return JSON.stringify(errorData);
  } catch {
    return `Server returned error (${response.status}: ${response.statusText})`;
  }
}

/**
 * Endpoint 1: GET / - Check backend health status
 */
export async function checkBackendStatus() {
  const baseUrl = getBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${baseUrl}/`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json().catch(() => ({ status: 'ok', message: 'Backend reachable' }));
      return { online: true, data, url: baseUrl };
    }
    return { online: false, error: `HTTP ${response.status}`, url: baseUrl };
  } catch (err) {
    return { online: false, error: err.message || 'Offline', url: baseUrl };
  }
}

/**
 * Endpoint 2: POST /api/admin/login/ - Admin login
 */
export async function adminLogin(credentials) {
  console.log('adminLogin received:', typeof credentials, credentials);
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (response.ok) {
    const data = await response.json();
    const token = data.token || data.access || data.key || data.jwt;
    if (token) {
      localStorage.setItem('insure_auth_token', token);
    }
    return { success: true, data };
  }

  const message = await extractErrorMessage(response);
  throw new Error(message || 'Login failed. Please check your administrator credentials.');
}

/**
 * Endpoint 4: GET /api/admin/agents/ - View all agents
 */
export async function getAgents() {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/agents/`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (response.ok) {
    const data = await response.json();
    // Handle either direct array or paginated response: { count, results: [...] }
    const agentsList = Array.isArray(data) ? data : (data.agents || data.results || data.data || []);
    return { success: true, data: agentsList };
  }

  const message = await extractErrorMessage(response);
  throw new Error(message || `Failed to fetch agents (HTTP ${response.status})`);
}

/**
 * Endpoint 5: GET /api/admin/agents/<id>/ - View one agent
 */
export async function getAgentById(id) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/agents/${id}/`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (response.ok) {
    const data = await response.json();
    const agentData = data.agent || data.data || data;
    return { success: true, agentData };
  }

  const message = await extractErrorMessage(response);
  throw new Error(message || `Failed to fetch agent details (HTTP ${response.status})`);
}

/**
 * Endpoint 3: POST /api/admin/agents/create/ - Create agent
 */
export async function createAgent(agentData) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/agents/create/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(agentData)
  });

  if (response.ok || response.status === 201) {
    const data = await response.json().catch(() => ({ success: true }));
    return { success: true, data };
  }

  const message = await extractErrorMessage(response);
  throw new Error(message || `Failed to create agent (HTTP ${response.status})`);
}

/**
 * Endpoint 6 & 7: PUT /api/admin/agents/<id>/update/ - Edit agent & Activate/deactivate
 */
export async function updateAgent(id, updatedFields) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/agents/${id}/update/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedFields)
  });

  if (response.ok) {
    const data = await response.json().catch(() => ({ success: true }));
    return { success: true, data };
  }

  const message = await extractErrorMessage(response);
  throw new Error(message || `Failed to update agent (HTTP ${response.status})`);
}

/**
 * Endpoint 8: DELETE /api/admin/agents/<id>/delete/ - Delete agent
 */
export async function deleteAgent(id) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/agents/${id}/delete/`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (response.ok || response.status === 204) {
    return { success: true };
  }

  const message = await extractErrorMessage(response);
  throw new Error(message || `Failed to delete agent (HTTP ${response.status})`);
}
