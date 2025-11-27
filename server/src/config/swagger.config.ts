import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parking App API",
      version: "1.0.0",
      description: "API documentation for the Parking App",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Vehicle: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            vehicleNumber: { type: "string" },
            vehicleType: { type: "string", enum: ["car", "bike"] },
            vehicleModel: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Slot: {
          type: "object",
          properties: {
            _id: { type: "string" },
            slotNumber: { type: "string" },
            isBooked: { type: "boolean" },
            price: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            vehicleId: { type: "string" },
            slotId: { type: "string" },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
            totalPrice: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
