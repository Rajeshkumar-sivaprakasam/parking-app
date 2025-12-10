import express from "express";
import {
  getVehicles,
  getAllVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect); // Protect all vehicle routes

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management API
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles for the authenticated user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get("/", getVehicles);
router.get("/all", getAllVehicles);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - make
 *               - vehicleModel
 *               - color
 *             properties:
 *               plateNumber:
 *                 type: string
 *               make:
 *                 type: string
 *               vehicleModel:
 *                 type: string
 *               color:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Validation error or vehicle already exists
 */
router.post("/", addVehicle);

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 */
router.put("/:id", updateVehicle);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */
router.delete("/:id", deleteVehicle);

export default router;
