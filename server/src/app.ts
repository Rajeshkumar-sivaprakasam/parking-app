import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.config";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import bookingRoutes from "./routes/booking.routes";
import slotRoutes from "./routes/slot.routes";

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/slots", slotRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error Handling
app.use(errorHandler);

export default app;
