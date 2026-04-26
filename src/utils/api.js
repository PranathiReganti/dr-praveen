/**
 * API Utility for Authenticated Requests
 * Automatically attaches JWT Bearer token from localStorage
 */

import { getConfig } from '../config/environment'

const { API_BASE_URL, API_TIMEOUT } = getConfig()

if (!API_BASE_URL) {
  console.error("API base URL not configured. Please set VITE_API_BASE_URL in your environment variables.")
}

/**
 * Enhanced fetch function with automatic JWT authentication
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - Fetch response object
 */
export async function apiFetch(url, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("API base URL not configured.");
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  const headers = options.headers || {}

  if (!headers['Content-Type'] && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json'
  }

  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const finalOptions = {
    ...options,
    headers
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    const response = await fetch(fullUrl, {
      ...finalOptions,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`[API TIMEOUT] ${fullUrl}: Request exceeded ${API_TIMEOUT}ms`)
      throw new Error(`Request timeout after ${API_TIMEOUT}ms. Please check your connection.`)
    }
    if (error instanceof TypeError) { // Catches network errors
      console.error(`[API CONNECTION ERROR] ${fullUrl}:`, error)
      throw new Error(`Cannot connect to server. Please ensure the backend is running and accessible at ${API_BASE_URL}`)
    }
    console.error(`[API ERROR] ${fullUrl}:`, error)
    throw new Error('An unexpected error occurred. Please try again.')
  }
}

/**
 * Helper to make authenticated API requests with automatic JSON parsing
 * Throws error if response is not ok
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export async function apiFetchJson(url, options = {}) {
  const response = await apiFetch(url, options)

  if (response.status === 204) { // No Content
    return null;
  }
  
  let data
  try {
    data = await response.json()
  } catch (error) {
    console.error(`[JSON PARSE ERROR] ${url}:`, error)
    throw new Error(`Invalid response format from server. Please try again.`)
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `HTTP ${response.status} Error`
    const error = new Error(errorMessage)
    error.status = response.status
    error.data = data
    console.error(`[API RESPONSE ERROR] ${url} failed with status ${response.status}:`, data);
    throw error
  }

  return data
}

/**
 * API request helper with common error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {Function} onError - Optional error callback
 * @returns {Promise<Object>} - Response data or null on error
 */
export async function apiRequest(url, options = {}, onError = null) {
  try {
    const data = await apiFetchJson(url, options)
    return data
  } catch (error) {
    console.error(`[API REQUEST ERROR] ${url}:`, error)
    if (onError) {
      onError(error)
    }
    // It's often better to let the caller handle the error state,
    // so re-throwing or returning a specific error object might be preferable to returning null.
    throw error;
  }
}

export default apiFetch
