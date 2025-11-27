import { Router } from "express";
import {
  getSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} from "../controllers/slot.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Slots
 *   description: Slot management API
 */

/**
 * @swagger
 * /slots:
 *   get:
 *     summary: Get all slots
 *     tags: [Slots]
 *     responses:
 *       200:
 *         description: List of all slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slot'
 */
router.get("/", getSlots);

/**
 * @swagger
 * /slots/{id}:
 *   get:
 *     summary: Get slot by ID
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Slot ID
 *     responses:
 *       200:
 *         description: Slot details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slot'
 *       404:
 *         description: Slot not found
 */
router.get("/:id", getSlotById);

/**
 * @swagger
 * /slots:
 *   post:
 *     summary: Create a new slot
 *     tags: [Slots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slot'
 *     responses:
 *       201:
 *         description: Slot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slot'
 */
router.post("/", createSlot);

/**
 * @swagger
 * /slots/{id}:
 *   put:
 *     summary: Update slot by ID
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Slot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slot'
 *     responses:
 *       200:
 *         description: Slot updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slot'
 *       404:
 *         description: Slot not found
 */
router.put("/:id", updateSlot);

/**
 * @swagger
 * /slots/{id}:
 *   delete:
 *     summary: Delete slot by ID
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Slot ID
 *     responses:
 *       200:
 *         description: Slot deleted successfully
 *       404:
 *         description: Slot not found
 */
router.delete("/:id", deleteSlot);

export default router;
