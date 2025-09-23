// auth-frontend/src/utils/authFetch.js

/**
 * Wrapper to perform authenticated fetch that auto-refreshes access tokens when 401 is returned.
 * Assumes:
 * - access token stored in localStorage as "token"
 * - refresh token is an HTTPOnly cookie (set by backend)
 */

export async function authFetch(url, options = {}) {
    let token = localStorage.getItem('token');
  
    const defaultHeaders = { 'Content-Type': 'application/json' };
    if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;
  
    const res = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), ...defaultHeaders },
      // no credentials needed for access token; refresh token stored as cookie, so include credentials when calling refresh endpoint
    });
  
    // if Access token expired -> try refresh once
    if (res.status === 401) {
      // try refresh
      const refreshRes = await fetch('https://posinnove-auth-backend.onrender.com/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // send refresh cookie
      });
  
      if (!refreshRes.ok) {
        // can't refresh -> redirect to login or throw
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Session expired');
      }
  
      const refreshData = await refreshRes.json();
      if (refreshData.token) {
        localStorage.setItem('token', refreshData.token);
        token = refreshData.token;
      }
  
      // retry original request with new token
      const retryRes = await fetch(url, {
        ...options,
        headers: { ...(options.headers || {}), 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return retryRes;
    }
  
    return res;
  }
  