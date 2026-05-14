// Queue Controller (Safe & Refactored)
// Handles queue management, token booking, and queue tracking with proper date and clinic scoping.

import { sendTokenNotificationSMS } from '../utils/smsService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =================================================================================================
// == HELPER FUNCTIONS
// =================================================================================================

/**
 * Gets the start of the current day in UTC.
 * @returns {Date} - The start of the day (00:00:00 UTC).
 */
const getStartOfDay = () => {
  const now = new Date();
  // Using UTC for consistency across servers/timezones.
  now.setUTCHours(0, 0, 0, 0);
  return now;
};

/**
 * Gets the end of the current day in UTC.
 * @returns {Date} - The end of the day (23:59:59 UTC).
 */
const getEndOfDay = () => {
  const now = new Date();
  now.setUTCHours(23, 59, 59, 999);
  return now;
};


// =================================================================================================
// == CORE QUEUE LOGIC
// =================================================================================================

/**
 * Add new token to the queue for a specific clinic for the current day.
 * This is the primary function for booking a new token.
 * It safely handles patient creation and sequential token numbering per clinic, per day.
 */
export const addToken = async (req, res) => {
  console.log("[addToken] STEP 1: Request received for new token.");
  const { name, phone, email, place, reason, clinic, trackingUrl } = req.body;

  // 1. Validate Input
  if (!name || !phone || !reason || !clinic) {
    console.error("[addToken] FAIL: Missing required fields.");
    return res.status(400).json({
      success: false,
      message: "name, phone, reason, and clinic are required fields.",
    });
  }

  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    // 2. Find or create the clinic record safely.
    console.log(`[addToken] STEP 2: Upserting clinic: ${clinic}`);
    const clinicRecord = await prisma.clinic.upsert({
      where: { name: clinic },
      update: {},
      create: { name: clinic, address: 'Address not specified' },
    });
    console.log(`[addToken] Clinic ID: ${clinicRecord.id}`);

    // 3. Find or create the patient record safely.
    console.log(`[addToken] STEP 3: Upserting patient with phone: ${phone}`);
    const patient = await prisma.patient.upsert({
      where: { phone: String(phone) },
      update: { name, email, place },
      create: { name, phone: String(phone), email, place },
    });
    console.log(`[addToken] Patient ID: ${patient.id}`);
    
    // 4. Find the last token for THIS clinic and THIS day to determine the next token number.
    console.log(`[addToken] STEP 4: Fetching last token for clinicId ${clinicRecord.id} today.`);
    const lastToken = await prisma.token.findFirst({
      where: {
        clinicId: clinicRecord.id,
        appointmentDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: {
        tokenNumber: 'desc',
      },
    });
    console.log("[addToken] Last token found:", lastToken);

    const nextTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;
    console.log(`[addToken] STEP 5: Next token number is ${nextTokenNumber}.`);

    // 5. Create the new token.
    console.log("[addToken] STEP 6: Creating the new token in the database.");
    const tokenRecord = await prisma.token.create({
      data: {
        tokenNumber: nextTokenNumber,
        patientId: patient.id,
        clinicId: clinicRecord.id,
        reasonForVisit: reason,
        status: 'WAITING',
        appointmentDate: new Date(),
      },
    });
    console.log("[addToken] STEP 7: Token created successfully:", tokenRecord);

    // 6. Send SMS notification (non-blocking).
    const waitingCount = await prisma.token.count({ where: { status: 'WAITING', clinicId: clinicRecord.id, appointmentDate: { gte: todayStart, lte: todayEnd } } });
    const estimatedTime = (waitingCount - 1) * 5;
    sendTokenNotificationSMS({
        name, phone, tokenNumber: nextTokenNumber, clinic, reason, estimatedTime: `${estimatedTime} mins`, trackingUrl
    }).catch(smsError => console.error("[addToken] SMS sending failed:", smsError));
    
    // 7. Send final success response.
    console.log("[addToken] STEP 8: Sending success response to client.");
    return res.status(201).json({
      success: true,
      data: { tokenNumber: nextTokenNumber, patient: name, clinic },
      message: "Token created successfully.",
    });

  } catch (error) {
    console.error("[addToken] FATAL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during token creation.",
      error: error.message,
    });
  }
};

/**
 * Get current queue data for a specific clinic for the current day.
 */
export const getQueueData = async (req, res) => {
  const { clinic } = req.query;
  if (!clinic) {
    return res.status(400).json({ success: false, message: "Clinic query parameter is required." });
  }

  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const clinicRecord = await prisma.clinic.findUnique({ where: { name: clinic } });
    if (!clinicRecord) {
      return res.status(404).json({ success: false, message: `Clinic \"${clinic}\" not found.` });
    }

    const tokens = await prisma.token.findMany({
      where: {
        clinicId: clinicRecord.id,
        appointmentDate: { gte: todayStart, lte: todayEnd },
      },
      include: { patient: true },
      orderBy: { tokenNumber: 'asc' },
    });

    const servingToken = tokens.find(t => t.status === 'SERVING');
    const waitingTokens = tokens.filter(t => t.status === 'WAITING');
    
    return res.status(200).json({
      success: true, 
      data: {
        currentToken: servingToken ? servingToken.tokenNumber : null,
        waiting: waitingTokens.length,
        estimatedTime: `${waitingTokens.length * 5} mins`,
        patients: tokens.map(t => ({ tokenNumber: t.tokenNumber, name: t.patient.name, status: t.status, phone: t.patient.phone, reason: t.reasonForVisit })),
      }
    });
  } catch (error) {
    console.error(`[getQueueData] Error for clinic ${clinic}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

/**
 * Track a patient's token by their phone number for the current day.
 */
export const trackQueue = async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone query parameter is required." });
  }

  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();
    
    const token = await prisma.token.findFirst({
      where: {
        patient: { phone: String(phone) },
        appointmentDate: { gte: todayStart, lte: todayEnd },
      },
      include: { patient: true, clinic: true },
      orderBy: { tokenNumber: 'desc' }
    });

    if (!token) {
      return res.status(404).json({ success: false, message: "No active token found for this phone number today." });
    }

    const tokensAhead = await prisma.token.count({
      where: {
        clinicId: token.clinicId,
        status: 'WAITING',
        tokenNumber: { lt: token.tokenNumber },
        appointmentDate: { gte: todayStart, lte: todayEnd },
      },
    });

    return res.status(200).json({ 
      success: true, 
      data: {
        tokenNumber: token.tokenNumber,
        patient: token.patient.name,
        clinic: token.clinic.name,
        status: token.status,
        tokensAhead,
        estimatedWaitTime: `${tokensAhead * 5} mins`,
      }
    });
  } catch (error) {
    console.error(`[trackQueue] Error for phone ${phone}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

/**
 * Calls the next patient in the queue for a specific clinic.
 */
export const callNextPatient = async (req, res) => {
  const { clinic } = req.body;
  if (!clinic) {
    return res.status(400).json({ success: false, message: "Clinic is required." });
  }

  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const clinicRecord = await prisma.clinic.findUnique({ where: { name: clinic } });
    if (!clinicRecord) {
      return res.status(404).json({ success: false, message: `Clinic \"${clinic}\" not found.` });
    }
    
    const currentServing = await prisma.token.findFirst({ where: { clinicId: clinicRecord.id, status: 'SERVING', appointmentDate: { gte: todayStart, lte: todayEnd } } });
    if (currentServing) {
      await prisma.token.update({ where: { id: currentServing.id }, data: { status: 'COMPLETED' } });
    }

    const nextPatientToken = await prisma.token.findFirst({
      where: { clinicId: clinicRecord.id, status: 'WAITING', appointmentDate: { gte: todayStart, lte: todayEnd } },
      orderBy: { tokenNumber: 'asc' },
    });

    if (!nextPatientToken) {
      return res.status(200).json({ success: true, message: "No more patients are waiting in the queue." });
    }

    await prisma.token.update({ where: { id: nextPatientToken.id }, data: { status: 'SERVING' } });

    return res.status(200).json({ success: true, message: `Calling next patient, Token #${nextPatientToken.tokenNumber}.` });
  } catch (error) {
    console.error(`[callNextPatient] Error for clinic ${clinic}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

/**
 * Manually mark a specific token as complete.
 */
export const completeConsultationByTokenNumber = async (req, res) => {
    const tokenNumber = Number(req.params.tokenNumber);
    if (!tokenNumber || isNaN(tokenNumber)) {
        return res.status(400).json({ success: false, message: "A valid token number is required." });
    }
    
    try {
        const todayStart = getStartOfDay();
        const todayEnd = getEndOfDay();

        const token = await prisma.token.findFirst({
            where: { tokenNumber, appointmentDate: { gte: todayStart, lte: todayEnd } }
        });

        if (!token) {
            return res.status(404).json({ success: false, message: "Token not found for the current day." });
        }
        
        await prisma.token.update({ where: { id: token.id }, data: { status: 'COMPLETED' } });
        
        return res.status(200).json({ success: true, message: `Token #${tokenNumber} marked as complete.` });

    } catch (error) {
        console.error(`[completeConsultation] Error for token ${tokenNumber}:`, error);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};


// =================================================================================================
// == DEPRECATED & UNSAFE FUNCTIONS
// =================================================================================================

/** @deprecated */
export const bookToken = async (req, res) => res.status(410).json({ success: false, message: "This endpoint is deprecated. Use POST /api/queue/add instead." });

/** @deprecated */
export const getAllTokens = async (req, res) => res.status(410).json({ success: false, message: "This endpoint is deprecated. Use GET /api/queue?clinic=<clinic_name> instead." });

/** @deprecated */
export const completeConsultation = async (req, res) => res.status(410).json({ success: false, message: "This endpoint is deprecated. Use PATCH /api/queue/complete/:tokenNumber instead." });

/** @deprecated */
export const moveQueueForward = async (req, res) => res.status(410).json({ success: false, message: "This endpoint is deprecated. Use POST /api/queue/next instead." });

/**
 * @deprecated This function is dangerous. It is disabled by default.
 */
export const resetQueue = async (req, res) => {
    const { confirm } = req.body;
    if (confirm !== "CONFIRM_RESET") {
        return res.status(403).json({ success: false, message: "This is a dangerous operation. Invalid confirmation." });
    }
    // The actual delete operation is commented out for safety.
    // await prisma.token.deleteMany({}); 
    return res.status(200).json({ success: true, message: "Queue reset is disabled for safety." });
};