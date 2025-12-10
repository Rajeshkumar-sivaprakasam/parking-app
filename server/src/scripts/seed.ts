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

    // Check for existing data to prevent accidental wipes
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(
        "Data already exists. Skipping seed to preserve users/vehicles/bookings."
      );
      console.log(
        "To force reset, manually clear the database or update this script."
      );
      process.exit(0);
    }

    // Clear existing data (Only if db is empty or forced - currently disabled for safety)
    // await User.deleteMany({});
    // await Vehicle.deleteMany({});
    // await Slot.deleteMany({});
    // await Booking.deleteMany({});
    // console.log("Cleared existing data.");

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
    const vehiclesData = [
      {
        userId: createdUsers[1]._id, // John
        plateNumber: "ABC-1234",
        make: "Toyota",
        vehicleModel: "Camry",
        color: "Silver",
        isDefault: true,
      },
      {
        userId: createdUsers[1]._id, // John
        plateNumber: "XYZ-5678",
        make: "Honda",
        vehicleModel: "Civic",
        color: "Black",
        isDefault: false,
      },
      {
        userId: createdUsers[2]._id, // Jane
        plateNumber: "BIKE-001",
        make: "Yamaha",
        vehicleModel: "MT-15",
        color: "Blue",
        isDefault: true,
      },
    ];

    const createdVehicles = await Vehicle.insertMany(vehiclesData);
    console.log("Vehicles seeded.");

    // Create Slots (40 Total)
    const slotsData = [];
    const sections = [
      { prefix: "A", count: 20, type: "standard", price: 5 },
      { prefix: "B", count: 10, type: "ev", price: 8 },
      { prefix: "C", count: 10, type: "disabled", price: 4 },
    ];

    for (const section of sections) {
      for (let i = 1; i <= section.count; i++) {
        let status = "available";
        // Mark specific slots as occupied/reserved for testing
        if (section.prefix === "A" && i === 2) status = "occupied";
        if (section.prefix === "B" && i === 2) status = "reserved";

        slotsData.push({
          number: `${section.prefix}${i}`,
          status,
          type: section.type,
          pricePerHour: section.price,
          location: "Level 1",
        });
      }
    }

    const createdSlots = await Slot.insertMany(slotsData);
    console.log(`Seeded ${createdSlots.length} slots.`);

    // Create Bookings
    const bookingsData = [
      {
        userId: createdUsers[1]._id,
        vehicleId: createdVehicles[0]._id,
        // Find slot A2
        slotId: createdSlots.find((s) => s.number === "A2")?._id,
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        totalAmount: 10,
        status: "active",
        paymentStatus: "paid",
      },
      {
        userId: createdUsers[2]._id,
        vehicleId: createdVehicles[2]._id,
        // Find slot B2
        slotId: createdSlots.find((s) => s.number === "B2")?._id,
        startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(new Date().getTime() + 26 * 60 * 60 * 1000),
        totalAmount: 10,
        status: "upcoming",
        paymentStatus: "paid",
      },
    ];

    await Booking.insertMany(bookingsData);
    console.log("Bookings seeded.");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
