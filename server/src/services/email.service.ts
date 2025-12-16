import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// From email address - use Resend's test domain or your verified domain
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

interface BookingEmailData {
  userName: string;
  userEmail: string;
  slotNumber: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalAmount: number;
  bookingId: string;
}

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmation = async (data: BookingEmailData) => {
  try {
    const { data: result, error } = await resend.emails.send({
      from: `ParkMy <${FROM_EMAIL}>`,
      to: [data.userEmail],
      subject: "🚗 Booking Confirmed - ParkMy",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0066cc, #004499); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: 600; color: #333; }
            .amount { font-size: 28px; color: #0066cc; text-align: center; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
              <div class="success-badge">✓ Payment Successful</div>
            </div>
            <div class="content">
              <p>Hi <strong>${data.userName}</strong>,</p>
              <p>Your parking spot has been successfully booked!</p>
              
              <div class="detail-row">
                <span class="detail-label">Booking ID</span>
                <span class="detail-value">#${data.bookingId
                  .slice(-8)
                  .toUpperCase()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Slot</span>
                <span class="detail-value">${data.slotNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Start Time</span>
                <span class="detail-value">${new Date(
                  data.startTime
                ).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">End Time</span>
                <span class="detail-value">${new Date(
                  data.endTime
                ).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.duration} hour(s)</span>
              </div>
              
              <div class="amount">₹${data.totalAmount.toFixed(2)}</div>
            </div>
            <div class="footer">
              <p>Thank you for using ParkMy!</p>
              <p>© ${new Date().getFullYear()} ParkMy - Smart Parking</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[EMAIL] Confirmation error:", error);
      return { success: false, error };
    }

    console.log("[EMAIL] Confirmation sent:", result?.id);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EMAIL] Confirmation exception:", error);
    return { success: false, error };
  }
};

/**
 * Send cancellation receipt email
 */
export const sendCancellationReceipt = async (
  data: BookingEmailData & { refundAmount: number; cancellationReason?: string }
) => {
  try {
    const { data: result, error } = await resend.emails.send({
      from: `ParkMy <${FROM_EMAIL}>`,
      to: [data.userEmail],
      subject: "❌ Booking Cancelled - ParkMy",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: 600; color: #333; }
            .refund-box { background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .refund-amount { font-size: 28px; color: #059669; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${data.userName}</strong>,</p>
              <p>Your booking has been cancelled as requested.</p>
              
              <div class="detail-row">
                <span class="detail-label">Booking ID</span>
                <span class="detail-value">#${data.bookingId
                  .slice(-8)
                  .toUpperCase()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Original Slot</span>
                <span class="detail-value">${data.slotNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Original Amount</span>
                <span class="detail-value">₹${data.totalAmount.toFixed(
                  2
                )}</span>
              </div>
              
              ${
                data.refundAmount > 0
                  ? `
              <div class="refund-box">
                <p style="margin: 0 0 10px 0; color: #666;">Refund Amount</p>
                <div class="refund-amount">₹${data.refundAmount.toFixed(
                  2
                )}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Will be credited within 5-7 business days</p>
              </div>
              `
                  : `
              <div style="background: #fef2f2; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #dc2626;">No refund applicable based on cancellation policy</p>
              </div>
              `
              }
            </div>
            <div class="footer">
              <p>Thank you for using ParkMy!</p>
              <p>© ${new Date().getFullYear()} ParkMy - Smart Parking</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[EMAIL] Cancellation error:", error);
      return { success: false, error };
    }

    console.log("[EMAIL] Cancellation sent:", result?.id);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EMAIL] Cancellation exception:", error);
    return { success: false, error };
  }
};

/**
 * Send waitlist allocation notification
 */
export const sendAllocationNotification = async (
  data: BookingEmailData & { expiresAt: Date }
) => {
  try {
    const { data: result, error } = await resend.emails.send({
      from: `ParkMy <${FROM_EMAIL}>`,
      to: [data.userEmail],
      subject: "⚡ Slot Available! Confirm Now - ParkMy",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .urgent-badge { background: #dc2626; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 10px; animation: pulse 1s infinite; }
            .content { padding: 30px; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: 600; color: #333; }
            .cta-button { display: block; background: #0066cc; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; text-align: center; font-weight: bold; margin: 20px 0; }
            .timer { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 A Slot is Available!</h1>
              <div class="urgent-badge">⏱️ Confirm within 5 minutes</div>
            </div>
            <div class="content">
              <p>Hi <strong>${data.userName}</strong>,</p>
              <p>Great news! A parking slot from your waitlist is now available.</p>
              
              <div class="timer">
                <p style="margin: 0; font-weight: bold; color: #92400e;">⏰ Offer expires at: ${new Date(
                  data.expiresAt
                ).toLocaleTimeString()}</p>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Slot</span>
                <span class="detail-value">${data.slotNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${new Date(
                  data.startTime
                ).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.duration} hour(s)</span>
              </div>
              
              <p style="text-align: center; color: #666; font-size: 14px;">Open the ParkMy app to confirm your booking.</p>
            </div>
            <div class="footer">
              <p>If you don't confirm, the slot will be offered to the next person in the waitlist.</p>
              <p>© ${new Date().getFullYear()} ParkMy - Smart Parking</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[EMAIL] Allocation error:", error);
      return { success: false, error };
    }

    console.log("[EMAIL] Allocation sent:", result?.id);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EMAIL] Allocation exception:", error);
    return { success: false, error };
  }
};

/**
 * Send booking reminder email (30 minutes before)
 */
export const sendBookingReminder = async (data: BookingEmailData) => {
  try {
    const { data: result, error } = await resend.emails.send({
      from: `ParkMy <${FROM_EMAIL}>`,
      to: [data.userEmail],
      subject: "⏰ Reminder: Your Parking Starts Soon - ParkMy",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: 600; color: #333; }
            .highlight { background: #f3e8ff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Starting in 30 Minutes!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${data.userName}</strong>,</p>
              <p>Just a friendly reminder that your parking booking starts soon!</p>
              
              <div class="highlight">
                <p style="margin: 0; font-size: 18px;">Slot <strong>${
                  data.slotNumber
                }</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Starting at ${new Date(
                  data.startTime
                ).toLocaleTimeString()}</p>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Booking ID</span>
                <span class="detail-value">#${data.bookingId
                  .slice(-8)
                  .toUpperCase()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.duration} hour(s)</span>
              </div>
            </div>
            <div class="footer">
              <p>See you soon!</p>
              <p>© ${new Date().getFullYear()} ParkMy - Smart Parking</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[EMAIL] Reminder error:", error);
      return { success: false, error };
    }

    console.log("[EMAIL] Reminder sent:", result?.id);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EMAIL] Reminder exception:", error);
    return { success: false, error };
  }
};
