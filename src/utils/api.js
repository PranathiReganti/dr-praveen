/**
 * API Utility for Authenticated Requests
 * Automatically attaches JWT Bearer token from localStorage
 */

import { getConfig } from '../config/environment'

const { API_BASE_URL, API_TIMEOUT } = getConfig()

/**
 * Enhanced fetch function with automatic JWT authentication
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - Fetch response object
 * 
 * @example
 * // Unauthenticated request
 * const response = await apiFetch('/api/queue')
 * 
 * // Authenticated request - token automatically added
 * const response = await apiFetch('/api/admin/dashboard', {
 *   method: 'GET'
 * })
 * 
 * // POST with body
 * const response = await apiFetch('/api/queue/add', {
 *   method: 'POST',
 *   body: JSON.stringify({ name, phone, reason, clinic })
 * })
 */
export async function apiFetch(url, options = {}) {
  // Build full URL if not absolute
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  // Initialize headers if not present
  const headers = options.headers || {}

  // Set JSON content type by default if not specified
  if (!headers['Content-Type'] && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json'
  }

  // Get token from localStorage and add to Authorization header
  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Merge headers with options
  const finalOptions = {
    ...options,
    headers
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch(fullUrl, {
        ...finalOptions,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`[API TIMEOUT] ${fullUrl}: Request exceeded ${API_TIMEOUT}ms`)
      throw new Error(`Request timeout after ${API_TIMEOUT}ms. Please check your connection.`)
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[API CONNECTION ERROR] ${fullUrl}:`, error)
      throw new Error(`Cannot connect to server. Please ensure backend is running on ${API_BASE_URL}`)
    }
    console.error(`[API ERROR] ${fullUrl}:`, error)
    throw error
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
    return null
  }
}

export default apiFetch
