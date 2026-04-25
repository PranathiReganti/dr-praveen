import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import queueRoutes from './routes/queue.js'
import paymentRoutes from './routes/payment.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ============================================
// MIDDLEWARE
// ============================================
// CORS configuration - Allow frontend to communicate
const corsOptions = {
  origin: [
    'http://localhost:3000',       // Frontend dev server (PRIMARY)
    'http://localhost:3001',       // Frontend dev server (FALLBACK)
    'http://localhost:5173',       // Vite default port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ============================================
// ROOT ROUTE
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'API Running...',
    status: 'active',
    timestamp: new Date().toISOString()
  })
})

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes)
app.use('/api/queue', queueRoutes)
app.use('/api/payment', paymentRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Dr. Praveen Backend API is running',
    timestamp: new Date().toISOString()
  })
})

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Dr. Praveen Healthcare Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      root: '/',
      health: '/api/health',
      auth: '/api/auth',
      queue: '/api/queue',
      payment: '/api/payment'
    },
    documentation: 'See individual route files for endpoint details'
  })
})

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    status: 404
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
    status: err.status || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
  
  // Determine appropriate status code
  let statusCode = err.status || 500
  if (err.name === 'ValidationError') statusCode = 400
  if (err.name === 'UnauthorizedError') statusCode = 401
  if (err.name === 'ForbiddenError') statusCode = 403
  if (err.name === 'NotFoundError') statusCode = 404
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An error occurred processing your request',
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🏥 Dr. Praveen Backend Server                ║
║  ✅ Running on http://localhost:${PORT}        ║
║  📚 API Docs: http://localhost:${PORT}/api     ║
║  🏠 Home: http://localhost:${PORT}/            ║
║  💚 Health: http://localhost:${PORT}/api/health║
╚════════════════════════════════════════════════╝
  `)
})

export default app
