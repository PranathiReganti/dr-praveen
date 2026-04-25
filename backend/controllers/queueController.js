// Queue Controller
// Handles queue management, token booking, and queue tracking

// ===== IN-MEMORY QUEUE STATE =====
// Stores all tokens for today's queue
// Persists while server is running, resets on restart
let queueArray = []
let nextTokenNumber = 1
let currentServingToken = null

console.log('[MODULE INIT] queueController loaded: nextTokenNumber =', nextTokenNumber, ', queueArray.length =', queueArray.length)

/**
 * Get current queue data
 * Returns real queue status with sequential tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getQueueData = async (req, res) => {
  try {
    // Count waiting tokens
    const waitingTokens = queueArray.filter(token => token.status === 'waiting')
    const waitingCount = waitingTokens.length

    // Calculate estimated time: waiting count * 5 minutes
    const estimatedTime = waitingCount * 5

    // Get current serving token
    const serving = currentServingToken || queueArray.find(token => token.status === 'serving')
    const currentToken = serving ? serving.tokenNumber : (queueArray.length > 0 ? queueArray[0].tokenNumber : 0)

    const queueData = {
      currentToken,
      waiting: waitingCount,
      estimatedTime: `${estimatedTime} mins`,
      lastUpdated: new Date().toISOString()
    }

    console.log('[QUEUE STATUS]', {
      currentToken,
      waitingCount,
      estimatedTime: `${estimatedTime} mins`,
      totalInQueue: queueArray.length
    })

    res.status(200).json({
      success: true,
      data: queueData,
      message: 'Queue data retrieved'
    })
  } catch (error) {
    console.error('[QUEUE ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Add new token to queue
 * Accepts patient details and generates SEQUENTIAL token number
 * @param {Object} req - Express request object with body {name, phone, reason, clinic}
 * @param {Object} res - Express response object
 */
export const addToken = async (req, res) => {
  try {
    const { name, phone, reason, clinic } = req.body

    console.log('[DEBUG] addToken called', { name, phone, reason, clinic })
    console.log('[DEBUG] nextTokenNumber BEFORE increment:', nextTokenNumber)
    console.log('[DEBUG] queueArray length:', queueArray.length)

    // Validate required fields
    if (!name || !phone || !reason || !clinic) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'name, phone, reason, and clinic are required',
        required: ['name', 'phone', 'reason', 'clinic']
      })
    }

    // Generate SEQUENTIAL token number (increments by 1)
    const tokenNumber = nextTokenNumber++

    console.log('[DEBUG] nextTokenNumber AFTER increment:', nextTokenNumber)
    console.log('[DEBUG] Generated tokenNumber:', tokenNumber)

    const tokenData = {
      tokenNumber,
      name,
      phone,
      reason,
      clinic,
      timestamp: new Date().toISOString(),
      status: 'waiting'
    }

    // Add token to queue array
    queueArray.push(tokenData)

    console.log('[TOKEN CREATED]', {
      tokenNumber,
      patient: name,
      clinic,
      totalInQueue: queueArray.length
    })

    res.status(201).json({
      success: true,
      data: {
        tokenNumber,
        clinic,
        patient: name,
        phone,
        reason
      },
      message: 'Token created successfully'
    })
  } catch (error) {
    console.error('[ADD TOKEN ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Book a queue token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const bookToken = async (req, res) => {
  try {
    // TODO: Implement token booking logic
    res.status(201).json({ message: 'Token booked successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Track queue by phone number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const trackQueue = async (req, res) => {
  try {
    const { phone } = req.params

    // Find token by phone number
    const token = queueArray.find(t => t.phone === phone)

    if (!token) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Token not found for this phone number'
      })
    }

    // Count how many tokens are ahead in the queue
    const tokenIndex = queueArray.indexOf(token)
    const tokensAhead = queueArray.filter((t, idx) => idx < tokenIndex && t.status === 'waiting').length

    const trackingData = {
      tokenNumber: token.tokenNumber,
      patient: token.name,
      phone: token.phone,
      clinic: token.clinic,
      reason: token.reason,
      status: token.status,
      tokensAhead,
      estimatedWaitTime: `${tokensAhead * 5} mins`,
      bookedAt: token.timestamp
    }

    console.log('[QUEUE TRACKED]', {
      tokenNumber: token.tokenNumber,
      patient: token.name,
      tokensAhead
    })

    res.status(200).json({
      success: true,
      data: trackingData,
      message: 'Queue tracking retrieved'
    })
  } catch (error) {
    console.error('[TRACK QUEUE ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Get queue status for a clinic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getQueueStatus = async (req, res) => {
  try {
    const { clinicId } = req.params

    // Get all tokens for this clinic
    const clinicTokens = queueArray.filter(token => token.clinic === clinicId)
    const waitingCount = clinicTokens.filter(t => t.status === 'waiting').length
    const servingToken = clinicTokens.find(t => t.status === 'serving')

    const statusData = {
      clinic: clinicId,
      currentToken: servingToken ? servingToken.tokenNumber : null,
      waitingCount,
      totalTokens: clinicTokens.length,
      estimatedTime: `${waitingCount * 5} mins`
    }

    res.status(200).json({
      success: true,
      data: statusData,
      message: 'Queue status retrieved'
    })
  } catch (error) {
    console.error('[GET QUEUE STATUS ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Call next patient in queue
 * @param {Object} req - Express request object with body {clinic}
 * @param {Object} res - Express response object
 */
export const callNextPatient = async (req, res) => {
  try {
    const { clinic } = req.body

    if (!clinic) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'clinic is required'
      })
    }

    // Mark previous serving token as done
    if (currentServingToken) {
      currentServingToken.status = 'done'
    }

    // Get first waiting token for this clinic
    const nextToken = queueArray.find(
      t => t.clinic === clinic && t.status === 'waiting'
    )

    if (!nextToken) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No waiting tokens in queue'
      })
    }

    // Update token status to serving
    nextToken.status = 'serving'
    currentServingToken = nextToken

    console.log('[PATIENT CALLED]', {
      tokenNumber: nextToken.tokenNumber,
      patient: nextToken.name,
      clinic
    })

    res.status(200).json({
      success: true,
      data: {
        tokenNumber: nextToken.tokenNumber,
        patient: nextToken.name,
        phone: nextToken.phone,
        reason: nextToken.reason,
        clinic
      },
      message: 'Next patient called'
    })
  } catch (error) {
    console.error('[CALL NEXT PATIENT ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Mark consultation as complete
 * @param {Object} req - Express request object with body {tokenNumber}
 * @param {Object} res - Express response object
 */
export const completeConsultation = async (req, res) => {
  try {
    const { tokenNumber } = req.body

    if (!tokenNumber) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tokenNumber is required'
      })
    }

    // Find token by number
    const token = queueArray.find(t => t.tokenNumber === tokenNumber)

    if (!token) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Token not found'
      })
    }

    // Mark token as done
    token.status = 'done'

    if (currentServingToken && currentServingToken.tokenNumber === tokenNumber) {
      currentServingToken = null
    }

    console.log('[CONSULTATION COMPLETED]', {
      tokenNumber,
      patient: token.name
    })

    res.status(200).json({
      success: true,
      data: {
        tokenNumber,
        patient: token.name,
        status: 'done'
      },
      message: 'Consultation marked as complete'
    })
  } catch (error) {
    console.error('[COMPLETE CONSULTATION ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Get all tokens in queue (for admin/monitoring)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllTokens = async (req, res) => {
  try {
    const stats = {
      total: queueArray.length,
      waiting: queueArray.filter(t => t.status === 'waiting').length,
      serving: queueArray.filter(t => t.status === 'serving').length,
      done: queueArray.filter(t => t.status === 'done').length,
      nextTokenNumber
    }

    res.status(200).json({
      success: true,
      data: {
        stats,
        tokens: queueArray
      },
      message: 'All tokens retrieved'
    })
  } catch (error) {
    console.error('[GET ALL TOKENS ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Reset queue for new day (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const resetQueue = async (req, res) => {
  try {
    const oldTokenCount = queueArray.length
    queueArray = []
    nextTokenNumber = 1
    currentServingToken = null

    console.log('[QUEUE RESET]', {
      previousTokenCount: oldTokenCount,
      message: 'Queue reset for new day'
    })

    res.status(200).json({
      success: true,
      data: {
        previousTokenCount: oldTokenCount,
        newTokenNumber: nextTokenNumber
      },
      message: 'Queue reset successfully'
    })
  } catch (error) {
    console.error('[RESET QUEUE ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Move queue forward
 * Marks current serving patient as done and moves next waiting patient to serving
 * Used in Admin Dashboard for demo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const moveQueueForward = async (req, res) => {
  try {
    // Mark current serving patient as done
    if (currentServingToken) {
      currentServingToken.status = 'done'
      console.log('[QUEUE FORWARD] Marked token', currentServingToken.tokenNumber, 'as done')
    }

    // Find next waiting patient
    const nextWaitingToken = queueArray.find(t => t.status === 'waiting')

    if (!nextWaitingToken) {
      // Queue is empty or no more waiting patients
      currentServingToken = null
      
      const waitingCount = queueArray.filter(t => t.status === 'waiting').length
      const estimatedTime = waitingCount * 5

      console.log('[QUEUE FORWARD] No more waiting tokens')

      return res.status(200).json({
        success: true,
        data: {
          message: 'Queue is now empty',
          currentToken: null,
          waiting: waitingCount,
          estimatedTime: `${estimatedTime} mins`,
          lastUpdated: new Date().toISOString()
        },
        message: 'Queue moved forward - no more patients waiting'
      })
    }

    // Move next waiting patient to serving
    nextWaitingToken.status = 'serving'
    currentServingToken = nextWaitingToken

    // Calculate queue metrics
    const waitingCount = queueArray.filter(t => t.status === 'waiting').length
    const estimatedTime = waitingCount * 5

    console.log('[QUEUE FORWARD] Moved token', nextWaitingToken.tokenNumber, 'to serving')
    console.log('[QUEUE STATUS]', {
      currentToken: nextWaitingToken.tokenNumber,
      patient: nextWaitingToken.name,
      waitingCount,
      estimatedTime: `${estimatedTime} mins`
    })

    res.status(200).json({
      success: true,
      data: {
        currentToken: nextWaitingToken.tokenNumber,
        patient: nextWaitingToken.name,
        phone: nextWaitingToken.phone,
        reason: nextWaitingToken.reason,
        clinic: nextWaitingToken.clinic,
        waiting: waitingCount,
        estimatedTime: `${estimatedTime} mins`,
        lastUpdated: new Date().toISOString()
      },
      message: 'Queue moved forward successfully'
    })
  } catch (error) {
    console.error('[MOVE QUEUE FORWARD ERROR]', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}
