import express from 'express'
import { login, logout, verifyToken, refreshToken } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Authentication routes
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify', authMiddleware, verifyToken)
router.post('/refresh', refreshToken)

export default router
