/**
 * API Helper Usage Guide
 * 
 * The api.js utility provides three functions for making API requests:
 * 1. apiFetch(url, options) - Basic fetch with auto-auth
 * 2. apiFetchJson(url, options) - Fetch with JSON parsing and error handling
 * 3. apiRequest(url, options, onError) - High-level helper with error callback
 */

/**
 * BASIC USAGE - apiFetch()
 * 
 * Automatically adds JWT Bearer token from localStorage
 * Works for both authenticated and unauthenticated endpoints
 * Returns raw Response object (like fetch)
 */

// ✅ BEFORE - Manual fetch
import { useState } from 'react'
async function handleLogin(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const data = await response.json()
  if (response.ok) {
    localStorage.setItem('token', data.token)
  }
}

// ✅ AFTER - Using apiFetch
import { apiFetch } from '../utils/api'
async function handleLogin(username, password) {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
  const data = await response.json()
  if (response.ok) {
    localStorage.setItem('token', data.token)
  }
}

/**
 * EXAMPLE 1: Queue Token Booking
 * Used in src/pages/Queue.jsx
 */
import { apiFetch } from '../utils/api'

async function generateToken() {
  const response = await apiFetch('/api/queue/add', {
    method: 'POST',
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      reason: formData.reason,
      clinic: selectedClinic
    })
  })

  const result = await response.json()
  
  if (!response.ok) {
    setError(result.message || 'Failed to generate token')
    return
  }

  const tokenNumber = result.data.tokenNumber
  setToken(tokenNumber)
}

/**
 * EXAMPLE 2: Fetching Queue Status (No Auth Required)
 * Used in src/pages/QueuePreview.jsx
 * 
 * Note: apiFetch adds token header automatically if token exists
 * For public APIs, it works fine too (header ignored by server if not needed)
 */
import { apiFetch } from '../utils/api'

async function fetchQueueStatus() {
  try {
    const response = await apiFetch('/api/queue')
    const result = await response.json()
    
    if (response.ok && result.data) {
      setQueueStatus(result.data)
    }
  } catch (error) {
    console.error('Failed to fetch queue status:', error)
  }
}

/**
 * EXAMPLE 3: Using apiFetchJson() for Cleaner Error Handling
 * 
 * Advantages:
 * - Automatically parses JSON
 * - Throws error if response is not ok
 * - Error includes status code and response data
 */
import { apiFetchJson } from '../utils/api'

async function fetchQueueData() {
  try {
    // This will throw if not response.ok
    const data = await apiFetchJson('/api/queue')
    setQueueData(data.data)
  } catch (error) {
    // error.status = HTTP status code
    // error.data = response body
    console.error(`API error ${error.status}:`, error.data.message)
    setError(error.data.message)
  }
}

/**
 * EXAMPLE 4: Protected Routes (Requires Authentication)
 * 
 * When token is missing, header won't be added
 * Server will reject with 401 Unauthorized
 */
import { apiFetch } from '../utils/api'

// Admin dashboard - requires token
async function getAdminDashboardData() {
  const response = await apiFetch('/api/admin/dashboard', {
    method: 'GET'
  })
  
  const data = await response.json()
  
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  }
  
  return data
}

/**
 * EXAMPLE 5: Using apiRequest() for High-Level Error Handling
 */
import { apiRequest } from '../utils/api'

// With error callback
async function syncData() {
  const data = await apiRequest(
    '/api/queue/add',
    {
      method: 'POST',
      body: JSON.stringify({ name, phone, reason, clinic })
    },
    (error) => {
      console.error('Failed to add token:', error.message)
      setError(error.message)
    }
  )
  
  if (data) {
    setToken(data.data.tokenNumber)
  }
}

/**
 * MIGRATION CHECKLIST
 * 
 * Components Updated:
 * ✅ src/dashboard/Login.jsx - Authentication
 * ✅ src/pages/Queue.jsx - Token booking
 * ✅ src/pages/QueuePreview.jsx - Queue status
 * ✅ src/pages/Track.jsx - Queue tracking
 * 
 * How to update more components:
 * 1. Import: import { apiFetch } from '../utils/api'
 * 2. Replace: fetch(`/api/...`)
 *    With: apiFetch('/api/...')
 * 3. Test: Verify requests include Authorization header in DevTools
 */

/**
 * AUTHORIZATION HEADER
 * 
 * Token is automatically extracted from localStorage
 * Key used: 'token'
 * Format: Authorization: Bearer <token>
 * 
 * To verify in DevTools:
 * 1. Open Network tab
 * 2. Click any API request
 * 3. Headers tab → scroll to "Authorization"
 * 4. Should show: Bearer eyJhbGc...
 */

/**
 * ERROR HANDLING
 * 
 * 401 Unauthorized - Token missing or expired
 * 400 Bad Request - Missing/invalid required fields
 * 404 Not Found - Endpoint doesn't exist
 * 500 Server Error - Backend error
 * 
 * All errors are logged to console with [API ERROR] prefix
 */
