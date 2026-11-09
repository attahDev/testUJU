export const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const TOKEN_KEY = 'rose-uju-token';

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    return;
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function errorMessage(data) {
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d) => String(d.msg).replace(/^Value error, /, '')).join(', ');
  return 'Something went wrong. Please try again.';
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(errorMessage(data), res.status);
  return data;
}

export async function uploadImage(file) {
  const info = await api('/api/admin/uploads', {
    method: 'POST',
    body: { filename: file.name, content_type: file.type },
  });
  const headers = { ...info.headers };
  if (info.upload_url.startsWith(BASE)) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(info.upload_url, { method: 'PUT', headers, body: file });
  if (!res.ok) throw new ApiError('Image upload failed', res.status);
  return info.public_url;
}
