import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { errorHandler } from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.config";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";
import hpp from "hpp";

const app = express();

// Compression - Enable gzip compression for all responses
app.use(compression());

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Security Middleware
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import slotRoutes from "./routes/slot.routes";
import bookingRoutes from "./routes/booking.routes";

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error Handling
app.use(errorHandler);

export default app;
