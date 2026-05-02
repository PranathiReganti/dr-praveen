import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production'

/**
 * Authentication middleware to verify JWT tokens
 * Reads token from Authorization header: "Bearer <token>"
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authMiddleware = (req, res, next) => {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization header is missing',
        code: 'NO_TOKEN'
      })
    }

    // Extract token from "Bearer <token>"
    const tokenParts = authHeader.split(' ')
    
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid Authorization header format. Use: Bearer <token>',
        code: 'INVALID_TOKEN_FORMAT'
      })
    }

    const token = tokenParts[1]

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Attach user data to request object
    req.user = {
      username: decoded.username,
      role: decoded.role,
      loginTime: decoded.loginTime,
      iat: decoded.iat,
      exp: decoded.exp
    }

    console.log(`[AUTH] User authenticated: ${decoded.username} (${decoded.role})`)

    // Call next middleware
    next()
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED',
        expiredAt: error.expiredAt
      })
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      })
    }

    // Generic error
    console.error('[AUTH ERROR]', error.message)
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    })
  }
}

export default authMiddleware
