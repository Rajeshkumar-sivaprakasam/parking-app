import express from "express";
import { protect } from "../middleware/auth.middleware";
import User from "../models/user.model";
import { sendResponse } from "../utils/response.utils";

const router = express.Router();

/**
 * @swagger
 * /api/notifications/subscribe:
 *   post:
 *     summary: Register FCM token for push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fcmToken
 *             properties:
 *               fcmToken:
 *                 type: string
 *                 description: Firebase Cloud Messaging token
 *     responses:
 *       200:
 *         description: Token registered successfully
 */
router.post("/subscribe", protect, async (req: any, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return sendResponse(res, 400, false, null, "FCM token is required");
    }

    // Add token if not already present (avoid duplicates)
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { fcmTokens: fcmToken } },
      { new: true }
    );

    console.log(`[PUSH] Token registered for user ${userId}`);
    sendResponse(res, 200, true, null, "Notification subscription successful");
  } catch (error) {
    console.error("[PUSH] Subscribe error:", error);
    sendResponse(res, 500, false, null, (error as Error).message);
  }
});

/**
 * @swagger
 * /api/notifications/unsubscribe:
 *   post:
 *     summary: Remove FCM token
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post("/unsubscribe", protect, async (req: any, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return sendResponse(res, 400, false, null, "FCM token is required");
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { fcmTokens: fcmToken } },
      { new: true }
    );

    console.log(`[PUSH] Token removed for user ${userId}`);
    sendResponse(res, 200, true, null, "Unsubscribed from notifications");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
});

export default router;
