// CineVenue API Client for Partner App

const API_BASE = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : '';

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('partner_token') || localStorage.getItem('token') || localStorage.getItem('accessToken')
    : '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async get(url: string) {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/api') ? url : `/api/v1${url}`}`;
    const res = await fetch(fullUrl, {
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    const data = await res.json().catch(() => ({}));
    return { data, status: res.status, ok: res.ok };
  },

  async post(url: string, body?: any) {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/api') ? url : `/api/v1${url}`}`;
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    return { data, status: res.status, ok: res.ok };
  },

  async put(url: string, body?: any) {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/api') ? url : `/api/v1${url}`}`;
    const res = await fetch(fullUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    return { data, status: res.status, ok: res.ok };
  },

  async delete(url: string) {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/api') ? url : `/api/v1${url}`}`;
    const res = await fetch(fullUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    const data = await res.json().catch(() => ({}));
    return { data, status: res.status, ok: res.ok };
  }
};

export default api;
