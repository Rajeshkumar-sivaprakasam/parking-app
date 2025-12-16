import express from "express";
import {
  getBookings,
  getAllBookings,
  createBooking,
  cancelBooking,
  extendBooking,
  joinWaitlist,
  withdrawWaitlist,
  confirmAllocation,
} from "../controllers/booking.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect); // Protect all booking routes

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management API
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get("/", getBookings);
router.get("/all", getAllBookings);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slotId
 *               - vehicleId
 *               - startTime
 *               - endTime
 *               - totalAmount
 *             properties:
 *               slotId:
 *                 type: string
 *               vehicleId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request or slot not available
 */
router.post("/", createBooking);

/**
 * @swagger
 * /bookings/waitlist:
 *   post:
 *     summary: Join waiting list for a full slot
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slotId
 *               - vehicleId
 *               - startTime
 *               - endTime
 *               - totalAmount
 *     responses:
 *       201:
 *         description: Joined waitlist successfully
 */
router.post("/waitlist", joinWaitlist);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 */
router.post("/:id/cancel", cancelBooking);

/**
 * @swagger
 * /bookings/{id}/withdraw:
 *   post:
 *     summary: Withdraw from waiting list (Refunds apply)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Withdrawn successfully
 */
router.post("/:id/withdraw", withdrawWaitlist);

/**
 * @swagger
 * /bookings/{id}/confirm:
 *   post:
 *     summary: Confirm an allocated slot
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Allocation confirmed
 */
router.post("/:id/confirm", confirmAllocation);

/**
 * @swagger
 * /bookings/{id}/extend:
 *   post:
 *     summary: Extend a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration
 *               - additionalAmount
 *             properties:
 *               duration:
 *                 type: number
 *                 description: Duration in hours to extend
 *               additionalAmount:
 *                 type: number
 *                 description: Additional cost
 *     responses:
 *       200:
 *         description: Booking extended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Cannot extend booking
 *       404:
 *         description: Booking not found
 */
router.post("/:id/extend", extendBooking);

export default router;
