const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(json?.message || text || res.statusText);
    return json;
  } catch (err) {
    if (res.ok) return text;
    throw err;
  }
}

export function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
