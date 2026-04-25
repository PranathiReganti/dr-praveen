import express from 'express'
import { 
  createOrder,
  verifyPaymentRazorpay,
  initiatePayment, 
  verifyPayment, 
  getPaymentHistory, 
  processRefund 
} from '../controllers/paymentController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Razorpay Payment APIs
router.post('/create-order', createOrder)           // Create order
router.post('/verify', verifyPaymentRazorpay)       // Verify payment

// Additional payment routes
router.post('/initiate', authMiddleware, initiatePayment)
router.get('/history/:patientId', authMiddleware, getPaymentHistory)
router.post('/refund/:paymentId', authMiddleware, processRefund)

export default router
