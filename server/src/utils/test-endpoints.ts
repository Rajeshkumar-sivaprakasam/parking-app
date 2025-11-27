import axios from "axios";

const API_URL = "http://localhost:5000/api";

const testEndpoints = async () => {
  try {
    console.log("Testing Health Check...");
    const health = await axios.get(`${API_URL}/health`);
    console.log("Health:", health.data);

    console.log("\nTesting Users...");
    const newUser = await axios.post(`${API_URL}/users`, {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "user",
      phoneNumber: "+1234567890",
    });
    console.log("Created User:", newUser.data);
    const users = await axios.get(`${API_URL}/users`);
    console.log("Users:", users.data);

    console.log("\nTesting Vehicles...");
    const newVehicle = await axios.post(`${API_URL}/vehicles`, {
      plateNumber: "TEST 123",
      model: "Test Model",
      isDefault: true,
    });
    console.log("Created Vehicle:", newVehicle.data);
    const vehicles = await axios.get(`${API_URL}/vehicles`);
    console.log("Vehicles:", vehicles.data);

    console.log("\nTesting Slots...");
    const newSlot = await axios.post(`${API_URL}/slots`, {
      identifier: "T1",
      status: "FREE",
      type: "standard",
    });
    console.log("Created Slot:", newSlot.data);
    const slots = await axios.get(`${API_URL}/slots`);
    console.log("Slots:", slots.data);

    console.log("\nTesting Bookings...");
    const newBooking = await axios.post(`${API_URL}/bookings`, {
      userId: newUser.data._id,
      vehicleId: newVehicle.data._id,
      slotId: newSlot.data._id,
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 3600000), // 1 hour later
    });
    console.log("Created Booking:", newBooking.data);
    const bookings = await axios.get(`${API_URL}/bookings`);
    console.log("Bookings:", bookings.data);

    console.log("\nCleanup...");
    await axios.delete(`${API_URL}/users/${newUser.data._id}`);
    await axios.delete(`${API_URL}/vehicles/${newVehicle.data._id}`);
    await axios.delete(`${API_URL}/slots/${newSlot.data._id}`);
    await axios.delete(`${API_URL}/bookings/${newBooking.data._id}`);
    console.log("Cleanup complete.");
  } catch (error) {
    console.error(
      "Error testing endpoints:",
      (error as any).response?.data || (error as Error).message
    );
  }
};

testEndpoints();
