import admin from "firebase-admin";

// Initialize Firebase Admin SDK (only once)
let firebaseApp: admin.app.App | null = null;

const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;

  // Check if Firebase credentials are configured
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    console.warn(
      "[PUSH] Firebase not configured. Push notifications disabled."
    );
    return null;
  }

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle newlines in private key from env
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("[PUSH] Firebase initialized successfully");
    return firebaseApp;
  } catch (error) {
    console.error("[PUSH] Firebase initialization failed:", error);
    return null;
  }
};

// Get messaging instance
const getMessaging = () => {
  const app = initializeFirebase();
  if (!app) return null;
  return admin.messaging(app);
};

interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
  icon?: string;
}

/**
 * Send push notification to a single FCM token
 */
export const sendPushNotification = async (
  fcmToken: string,
  notification: PushNotificationData
) => {
  const messaging = getMessaging();
  if (!messaging) {
    console.log("[PUSH] Messaging not available, skipping notification");
    return { success: false, error: "Firebase not configured" };
  }

  try {
    const message: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data,
      webpush: {
        notification: {
          icon: notification.icon || "/pwa-192x192.svg",
          badge: "/favicon-32x32.svg",
          vibrate: [200, 100, 200],
        },
        fcmOptions: {
          link: "/",
        },
      },
    };

    const response = await messaging.send(message);
    console.log("[PUSH] Notification sent:", response);
    return { success: true, messageId: response };
  } catch (error: any) {
    console.error("[PUSH] Send error:", error);

    // Handle invalid tokens
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      return { success: false, error: "invalid_token", shouldRemove: true };
    }

    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to multiple FCM tokens
 */
export const sendMulticastNotification = async (
  fcmTokens: string[],
  notification: PushNotificationData
) => {
  const messaging = getMessaging();
  if (!messaging || fcmTokens.length === 0) {
    return { success: false, error: "No messaging or tokens" };
  }

  try {
    const message: admin.messaging.MulticastMessage = {
      tokens: fcmTokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data,
      webpush: {
        notification: {
          icon: notification.icon || "/pwa-192x192.svg",
          badge: "/favicon-32x32.svg",
        },
      },
    };

    const response = await messaging.sendEachForMulticast(message);
    console.log(
      `[PUSH] Multicast: ${response.successCount} success, ${response.failureCount} failed`
    );

    // Collect invalid tokens
    const invalidTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const error = resp.error;
        if (
          error?.code === "messaging/invalid-registration-token" ||
          error?.code === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(fcmTokens[idx]);
        }
      }
    });

    return {
      success: response.successCount > 0,
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens,
    };
  } catch (error: any) {
    console.error("[PUSH] Multicast error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send booking confirmation push notification
 */
export const sendBookingPush = async (
  fcmTokens: string[],
  bookingData: { slotNumber: string; startTime: Date; bookingId: string }
) => {
  return sendMulticastNotification(fcmTokens, {
    title: "🚗 Booking Confirmed!",
    body: `Slot ${bookingData.slotNumber} booked for ${new Date(
      bookingData.startTime
    ).toLocaleTimeString()}`,
    data: {
      type: "booking_confirmed",
      bookingId: bookingData.bookingId,
    },
  });
};

/**
 * Send booking reminder push notification (30 min before)
 */
export const sendReminderPush = async (
  fcmTokens: string[],
  bookingData: { slotNumber: string; startTime: Date; bookingId: string }
) => {
  return sendMulticastNotification(fcmTokens, {
    title: "⏰ Parking Starts Soon!",
    body: `Your slot ${bookingData.slotNumber} is ready in 30 minutes`,
    data: {
      type: "booking_reminder",
      bookingId: bookingData.bookingId,
    },
  });
};

/**
 * Send waitlist allocation push notification
 */
export const sendAllocationPush = async (
  fcmTokens: string[],
  bookingData: { slotNumber: string; expiresAt: Date; bookingId: string }
) => {
  return sendMulticastNotification(fcmTokens, {
    title: "⚡ Slot Available!",
    body: `Confirm slot ${bookingData.slotNumber} within 5 minutes!`,
    data: {
      type: "allocation",
      bookingId: bookingData.bookingId,
      expiresAt: bookingData.expiresAt.toISOString(),
    },
  });
};

/**
 * Send cancellation push notification
 */
export const sendCancellationPush = async (
  fcmTokens: string[],
  bookingData: { slotNumber: string; refundAmount: number; bookingId: string }
) => {
  const refundText =
    bookingData.refundAmount > 0
      ? `Refund: ₹${bookingData.refundAmount.toFixed(2)}`
      : "No refund applicable";

  return sendMulticastNotification(fcmTokens, {
    title: "❌ Booking Cancelled",
    body: `Slot ${bookingData.slotNumber} cancelled. ${refundText}`,
    data: {
      type: "booking_cancelled",
      bookingId: bookingData.bookingId,
    },
  });
};
