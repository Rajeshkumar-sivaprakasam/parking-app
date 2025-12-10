import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
import { initializeParkingSlots } from "./utils/bootstrap.utils";

// ...

// Connect to Database and Initialize
connectDB().then(() => {
  initializeParkingSlots();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
