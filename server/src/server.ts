import dotenv from "dotenv";
import path from "path";
import app from "./app";
import { connectDB } from "./config/db";
import { startCronJobs } from "./jobs/cron";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 5000;

// Connect to Database
import { initializeParkingSlots } from "./utils/bootstrap.utils";

// ...

// Connect to Database and Initialize
// Connect to Database and Initialize
connectDB().then(() => {
  initializeParkingSlots();
  startCronJobs();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
