/**
 * Notification Helper Utility
 * Combines email and push notification services for booking events
 */

import User from "../models/user.model";
import {
  sendBookingConfirmation,
  sendCancellationReceipt,
  sendAllocationNotification,
  sendBookingReminder,
} from "../services/email.service";
import {
  sendBookingPush,
  sendCancellationPush,
  sendAllocationPush,
  sendReminderPush,
} from "../services/push.service";

interface BookingNotificationData {
  userId: string;
  bookingId: string;
  slotNumber: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalAmount: number;
}

/**
 * Send notifications for new booking confirmation
 */
export const notifyBookingConfirmation = async (
  data: BookingNotificationData
) => {
  try {
    const user = await User.findById(data.userId).select(
      "name email fcmTokens"
    );
    if (!user) {
      console.error("[NOTIFY] User not found:", data.userId);
      return;
    }

    // Send email notification
    await sendBookingConfirmation({
      userName: user.name,
      userEmail: user.email,
      slotNumber: data.slotNumber,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      totalAmount: data.totalAmount,
      bookingId: data.bookingId,
    });

    // Send push notification if tokens available
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      await sendBookingPush(user.fcmTokens, {
        slotNumber: data.slotNumber,
        startTime: data.startTime,
        bookingId: data.bookingId,
      });
    }

    console.log("[NOTIFY] Booking confirmation sent for:", data.bookingId);
  } catch (error) {
    console.error("[NOTIFY] Booking confirmation error:", error);
  }
};

/**
 * Send notifications for booking cancellation
 */
export const notifyCancellation = async (
  data: BookingNotificationData & { refundAmount: number }
) => {
  try {
    const user = await User.findById(data.userId).select(
      "name email fcmTokens"
    );
    if (!user) return;

    // Send email
    await sendCancellationReceipt({
      userName: user.name,
      userEmail: user.email,
      slotNumber: data.slotNumber,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      totalAmount: data.totalAmount,
      bookingId: data.bookingId,
      refundAmount: data.refundAmount,
    });

    // Send push
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      await sendCancellationPush(user.fcmTokens, {
        slotNumber: data.slotNumber,
        refundAmount: data.refundAmount,
        bookingId: data.bookingId,
      });
    }

    console.log("[NOTIFY] Cancellation sent for:", data.bookingId);
  } catch (error) {
    console.error("[NOTIFY] Cancellation error:", error);
  }
};

/**
 * Send notifications for waitlist allocation
 */
export const notifyAllocation = async (
  data: BookingNotificationData & { expiresAt: Date }
) => {
  try {
    const user = await User.findById(data.userId).select(
      "name email fcmTokens"
    );
    if (!user) return;

    // Send email
    await sendAllocationNotification({
      userName: user.name,
      userEmail: user.email,
      slotNumber: data.slotNumber,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      totalAmount: data.totalAmount,
      bookingId: data.bookingId,
      expiresAt: data.expiresAt,
    });

    // Send push
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      await sendAllocationPush(user.fcmTokens, {
        slotNumber: data.slotNumber,
        expiresAt: data.expiresAt,
        bookingId: data.bookingId,
      });
    }

    console.log("[NOTIFY] Allocation sent for:", data.bookingId);
  } catch (error) {
    console.error("[NOTIFY] Allocation error:", error);
  }
};

/**
 * Send booking reminder (30 min before)
 */
export const notifyReminder = async (data: BookingNotificationData) => {
  try {
    const user = await User.findById(data.userId).select(
      "name email fcmTokens"
    );
    if (!user) return;

    // Send email
    await sendBookingReminder({
      userName: user.name,
      userEmail: user.email,
      slotNumber: data.slotNumber,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      totalAmount: data.totalAmount,
      bookingId: data.bookingId,
    });

    // Send push
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      await sendReminderPush(user.fcmTokens, {
        slotNumber: data.slotNumber,
        startTime: data.startTime,
        bookingId: data.bookingId,
      });
    }

    console.log("[NOTIFY] Reminder sent for:", data.bookingId);
  } catch (error) {
    console.error("[NOTIFY] Reminder error:", error);
  }
};
