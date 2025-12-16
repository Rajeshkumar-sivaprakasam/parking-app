import cron from "node-cron";
import Booking from "../models/booking.model";
import ParkingSlot from "../models/slot.model";

// Cron Job: Runs every minute
// Purpose: Automatically update booking statuses and free up parking slots.
export const startCronJobs = () => {
  console.log("Starting Cron Jobs...");

  cron.schedule("* * * * *", async () => {
    const session = await Booking.startSession();
    try {
      session.startTransaction();
      const now = new Date();

      // 1. ACTIVATE UPCOMING BOOKINGS
      // Find bookings that are 'upcoming' but start time has passed
      const bookingsToActivate = await Booking.find({
        status: "upcoming",
        startTime: { $lte: now },
      }).session(session);

      for (const booking of bookingsToActivate) {
        booking.status = "active";
        await booking.save({ session });

        // Mark slot as occupied
        await ParkingSlot.findByIdAndUpdate(booking.slotId, {
          status: "occupied",
        }).session(session);

        console.log(
          `[CRON] Activated booking ${booking._id}, Slot ${booking.slotId} occupied.`
        );
      }

      // 2. COMPLETE EXPIRED BOOKINGS
      // Find bookings that are 'active' but end time has passed
      const bookingsToComplete = await Booking.find({
        status: "active",
        endTime: { $lte: now },
      }).session(session);

      for (const booking of bookingsToComplete) {
        booking.status = "completed";
        await booking.save({ session });

        // Mark slot as available
        await ParkingSlot.findByIdAndUpdate(booking.slotId, {
          status: "available",
        }).session(session);

        console.log(
          `[CRON] Completed booking ${booking._id}, Slot ${booking.slotId} freed.`
        );
      }

      await session.commitTransaction();
    } catch (error) {
      console.error("[CRON] Error during cron job execution:", error);
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
    } finally {
      session.endSession();
    }
  });

  // Second Cron: Allocation & Waitlist Management (Runs every minute)
  cron.schedule("* * * * *", async () => {
    const session = await Booking.startSession();
    try {
      session.startTransaction();
      const now = new Date();

      // 3. EXPIRE UNCLAIMED ALLOCATIONS
      const expiredAllocations = await Booking.find({
        status: "allocated",
        allocationExpiresAt: { $lte: now },
      }).session(session);

      for (const booking of expiredAllocations) {
        booking.status = "cancelled";
        booking.paymentStatus = "partial_refund";
        booking.refundAmount = booking.totalAmount * 0.8; // 8.4 Refund Waitlist User
        booking.cancellationReason = "Allocation offer expired (No response)";
        await booking.save({ session });

        console.log(
          `[CRON] Expired allocation for ${booking._id}. Refund processed.`
        );

        // Assign to NEXT user in queue
        const nextCandidate = await Booking.findOne({
          slotId: booking.slotId,
          status: "waiting",
          startTime: { $gte: booking.startTime }, // Approx match
          // Ensure it still fits? Ideally yes.
        })
          .sort({ createdAt: 1 })
          .session(session);

        if (nextCandidate) {
          nextCandidate.status = "allocated";
          nextCandidate.allocationExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
          ); // 5 mins
          await nextCandidate.save({ session });
          console.log(
            `[CRON] Re-allocated Slot ${booking.slotId} to ${nextCandidate._id}`
          );
        } else {
          console.log(
            `[CRON] No further candidates for Slot ${booking.slotId}`
          );
        }
      }

      // 4. EXPIRE FAILED WAITLIST REQUESTS
      // If start time passed and they are still 'waiting', they didn't get a spot.
      const failedWaitlist = await Booking.find({
        status: "waiting",
        startTime: { $lte: now },
      }).session(session);

      for (const booking of failedWaitlist) {
        booking.status = "cancelled";
        booking.paymentStatus = "partial_refund";
        booking.refundAmount = booking.totalAmount * 0.8; // 8.2 Refund
        booking.cancellationReason = "Slot not available by start time";
        await booking.save({ session });

        console.log(
          `[CRON] Waitlist request ${booking._id} failed. Refund processed.`
        );
      }

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) await session.abortTransaction();
      console.error("[CRON] Error in Allocation Cron:", error);
    } finally {
      session.endSession();
    }
  });
};
