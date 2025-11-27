import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";
import Vehicle from "../models/vehicle.model";
import Slot from "../models/slot.model";
import Booking from "../models/booking.model";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    console.log("Cleared existing data.");

    // Create Users
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        phoneNumber: "1234567890",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "user",
        phoneNumber: "9876543210",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "user",
        phoneNumber: "5555555555",
      },
    ];

    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser = new User({ ...user, password: hashedPassword });
      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
    }
    console.log("Users seeded.");

    // Create Vehicles
    const vehicles = await Vehicle.insertMany([
      {
        plateNumber: "ABC-1234",
        vehicleModel: "Toyota Camry",
        isDefault: true,
      },
      {
        plateNumber: "XYZ-5678",
        vehicleModel: "Honda Civic",
        isDefault: false,
      },
      {
        plateNumber: "BIKE-001",
        vehicleModel: "Yamaha MT-15",
        isDefault: true,
      },
    ]);
    console.log("Vehicles seeded.");

    // Create Slots
    const slots = await Slot.insertMany([
      { identifier: "A1", status: "FREE", type: "standard" },
      { identifier: "A2", status: "OCCUPIED", type: "standard" },
      { identifier: "B1", status: "FREE", type: "ev" },
      { identifier: "B2", status: "RESERVED", type: "standard" },
    ]);
    console.log("Slots seeded.");

    // Create Bookings
    const bookings = await Booking.insertMany([
      {
        userId: createdUsers[1]._id,
        vehicleId: vehicles[0]._id,
        slotId: slots[1]._id, // A2 is OCCUPIED
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        status: "active",
      },
      {
        userId: createdUsers[2]._id,
        vehicleId: vehicles[2]._id,
        slotId: slots[3]._id, // B2 is RESERVED
        startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(new Date().getTime() + 26 * 60 * 60 * 1000),
        status: "active",
      },
    ]);
    console.log("Bookings seeded.");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
