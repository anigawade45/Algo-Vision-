const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Handle HTTP response parsing and error throwing
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'An error occurred during request execution');
    error.status = response.status;
    error.response = {
      status: response.status,
      data: data || { success: false, message: response.statusText },
    };
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
};

/**
 * Centralized API Client with credentials (HTTP-only cookies) enabled
 */
const apiClient = {
  get: async (url, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(res);
  },

  post: async (url, body, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(res);
  },

  put: async (url, body, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(res);
  },

  delete: async (url, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(res);
  },

  patch: async (url, body, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(res);
  },
};

export default apiClient;
