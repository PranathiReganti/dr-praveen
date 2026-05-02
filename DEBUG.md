# Frontend-Backend Communication Setup & Debugging Guide

## Overview

This document provides guidance on setting up and verifying frontend-backend communication for the Dr. Praveen clinic management platform.

**System Architecture:**

- **Frontend:** React + Vite running on `http://localhost:3001`
- **Backend:** Express.js running on `http://localhost:5000`
- **Communication:** RESTful APIs with JWT authentication

---

## Quick Start

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Expected output:

```
╔════════════════════════════════════════════════╗
║  🏥 Dr. Praveen Backend Server                ║
║  ✅ Running on http://localhost:5000          ║
║  📚 API Docs: http://localhost:5000/api       ║
║  🏠 Home: http://localhost:5000/              ║
║  💚 Health: http://localhost:5000/api/health  ║
╚════════════════════════════════════════════════╝
```

### 2. Start Frontend Server

```bash
npm install
npm run dev
```

Expected output:

```
VITE v4.x.x  ready in 123 ms

➜  Local:   http://localhost:3001/
➜  Press h to show help
```

### 3. Verify Connection

Open browser DevTools (F12) and check console for connection diagnostics:

```
[CONNECTION DIAGNOSTICS]
✅ Backend available at http://localhost:5000
✅ CORS properly configured
```

---

## API Endpoints Overview

### Authentication

- **POST** `/api/auth/login`
  - Request: `{username, password}`
  - Response: `{token, role, message}`
  - Test: admin/1234 or doctor/5678

### Queue Management

- **GET** `/api/queue` - Get queue status
- **POST** `/api/queue/add` - Book a token
- **GET** `/api/queue/track?phone=...` - Track queue position

### Payments

- **POST** `/api/payment/create-order` - Create payment order
- **POST** `/api/payment/verify` - Verify payment

### Health Check

- **GET** `/api/health` - Server health status

---

## Configuration Files

### Frontend Configuration

**File:** `src/config/environment.js`

```javascript
// Environment-specific API configuration
export const getConfig = () => ({
  API_BASE_URL: "http://localhost:5000",
  API_TIMEOUT: 30000, // 30 seconds
});
```

### Backend Configuration

**File:** `backend/.env`

```
PORT=5000
NODE_ENV=development
JWT_SECRET=secret123
JWT_EXPIRE=1d
```

**CORS Setup:** `backend/server.js`

- Allows: `localhost:3001`, `localhost:5173`, `127.0.0.1:3001`, `127.0.0.1:5173`
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Credentials: Supported

---

## Error Handling & Debugging

### Common Errors & Solutions

#### 1. **Backend Not Reachable**

```
Error: Cannot connect to server. Please ensure backend is running on http://localhost:5000
```

**Solution:**

- Check backend is running: `npm run dev` in backend folder
- Verify port 5000 is not blocked: `netstat -an | grep 5000`
- Check no firewall is blocking connection

#### 2. **CORS Error**

```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' has been blocked by CORS policy
```

**Solution:**

- Backend CORS is enabled for all origins in development
- Check backend is reachable before frontend
- Clear browser cache: Ctrl+Shift+Delete

#### 3. **JWT Token Expired**

```
Error: Token expired
```

**Solution:**

- Login again to get new token
- Token expires after 1 day (configurable in .env)
- Token stored in localStorage under key "token"

#### 4. **JSON Parse Error**

```
Error: Invalid response format from server
```

**Solution:**

- Verify backend endpoint returns valid JSON
- Check Content-Type header is application/json
- Review server response in DevTools Network tab

#### 5. **Request Timeout**

```
Error: Request timeout after 30000ms
```

**Solution:**

- Check network latency: `ping localhost`
- Increase timeout in `src/config/environment.js`
- Check if backend is processing heavy operations

### Debug Utilities

#### Connection Checker

Used automatically on app startup in development mode.

```javascript
import { logConnectionDiagnostics } from "./utils/connectionChecker";

// Run diagnostics
await logConnectionDiagnostics();
```

Output includes:

- Backend availability
- Token status
- CORS configuration
- Specific error details

#### Browser DevTools Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Perform API call
4. Check:
   - Status: Should be 200 for success
   - Authorization header: Should contain "Bearer <token>"
   - Response: Should be valid JSON
   - Time: Should complete within 30 seconds

---

## Testing Workflows

### 1. Authentication Flow

```
1. Go to http://localhost:3001/login
2. Enter credentials: admin / 1234
3. Check DevTools Network → POST /api/auth/login
4. Verify response contains token
5. Check localStorage has token stored
6. Should redirect to /admin dashboard
```

### 2. Queue Booking Flow

```
1. Go to http://localhost:3001/queue
2. Fill in form (name, phone, doctor, reason)
3. Click "Confirm"
4. Check DevTools Console for [PAYMENT] logs
5. Complete simulated payment
6. Verify POST /api/queue/add succeeds
7. Should display token number
```

### 3. Queue Tracking Flow

```
1. Go to http://localhost:3001/track
2. Enter phone number of booked token
3. Check DevTools Network → GET /api/queue
4. Verify queue status loads
5. Should show current token, waiting count, estimated time
```

### 4. Queue Preview (Home Page)

```
1. Go to http://localhost:3001/
2. Check Network tab for GET /api/queue
3. Should show live queue data in phone mockup
4. Auto-refreshes every 30 seconds
```

---

## Performance Optimization

### Request Deduplication

The API helper automatically:

- Reuses existing tokens (no re-login needed)
- Includes proper Content-Type headers
- Handles timeouts gracefully
- Logs errors for debugging

### Caching Strategy

- localStorage: User tokens (1 day expiry)
- sessionStorage: Temporary data during session
- Memory state: React components manage real-time data

### Network Optimization

- API timeout: 30 seconds (configurable)
- Request consolidation: Use batch endpoints when possible
- Error retry: Implement exponential backoff for critical operations

---

## Production Deployment

### Before Production

1. ✅ Test all API endpoints manually
2. ✅ Verify error handling on network failures
3. ✅ Check console has no errors or warnings
4. ✅ Validate JWT token security
5. ✅ Review CORS settings for production domain
6. ✅ Update `src/config/environment.js` with production API URL
7. ✅ Set `NODE_ENV=production` in backend
8. ✅ Use secure, generated JWT_SECRET (not "secret123")

### Environment Configuration

Create `.env.production`:

```
VITE_API_BASE_URL=https://api.yourdomain.com
```

Update backend `backend/.env`:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=<generated-secure-secret>
API_CORS_ORIGIN=https://yourdomain.com
```

---

## Code Examples

### Making Authenticated API Calls

#### Using apiFetch (Low-level)

```javascript
import { apiFetch } from "@/utils/api";

const response = await apiFetch("/api/queue/add", {
  method: "POST",
  body: JSON.stringify({ name: "John", phone: "9876543210" }),
});
const data = await response.json();
```

#### Using apiFetchJson (High-level)

```javascript
import { apiFetchJson } from "@/utils/api";

try {
  const data = await apiFetchJson("/api/queue/add", {
    method: "POST",
    body: JSON.stringify({ name: "John", phone: "9876543210" }),
  });
  console.log("Token:", data.tokenNumber);
} catch (error) {
  console.error("Error:", error.message);
}
```

#### Using apiRequest (Callback style)

```javascript
import { apiRequest } from "@/utils/api";

apiRequest("/api/queue", {}, (error) => {
  if (error) {
    console.error("Queue error:", error);
  }
});
```

### Checking Connection Status

```javascript
import {
  checkBackendConnection,
  getConnectionDiagnostics,
} from "@/utils/connectionChecker";

// Simple check
const isConnected = await checkBackendConnection();

// Detailed diagnostics
const diag = await getConnectionDiagnostics();
console.log("Backend available:", diag.backendAvailable);
console.log("CORS enabled:", diag.corsEnabled);
```

---

## Troubleshooting Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3001
- [ ] No firewall blocking localhost communication
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Node.js version is compatible (v14+)
- [ ] npm packages installed in both directories
- [ ] .env file configured correctly in backend
- [ ] JWT_SECRET is set in backend .env
- [ ] DevTools Network tab shows requests to http://localhost:5000
- [ ] Authorization header present in API requests
- [ ] Response status codes are correct (200, 400, 401, etc.)
- [ ] Response bodies are valid JSON
- [ ] No console errors or warnings

---

## Support & Resources

**Files Referenced:**

- Frontend: `src/utils/api.js` - API communication
- Frontend: `src/config/environment.js` - Environment config
- Frontend: `src/utils/connectionChecker.js` - Connection diagnostics
- Backend: `backend/server.js` - Express setup
- Backend: `backend/middleware/authMiddleware.js` - JWT validation
- Backend: `backend/.env` - Environment variables

**Log Patterns:**

- `[API ERROR]` - Network or fetch errors
- `[JSON PARSE ERROR]` - Invalid JSON response
- `[API TIMEOUT]` - Request exceeded timeout
- `[API CONNECTION ERROR]` - Cannot reach backend
- `[CONNECTION DIAGNOSTICS]` - App startup diagnostics
- `[LOGIN ERROR]` - Authentication failure
- `[PAYMENT ERROR]` - Payment processing error
- `[QUEUE DATA ERROR]` - Queue fetch error

---

Last Updated: 2024
Backend API Version: 1.0
Frontend Version: 1.0.0
