import express from "express";
import { getSlots, updateSlotStatus } from "../controllers/slot.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Slots
 *   description: Parking Slot management API
 */

/**
 * @swagger
 * /slots:
 *   get:
 *     summary: Get all parking slots
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parking slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slot'
 */
router.get("/", protect, getSlots);

/**
 * @swagger
 * /slots/{id}/status:
 *   put:
 *     summary: Update parking slot status (Admin only)
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, occupied, reserved]
 *     responses:
 *       200:
 *         description: Slot status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slot'
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Slot not found
 */
router.put("/:id/status", protect, authorize("admin"), updateSlotStatus); // Only admin can update status manually

export default router;
