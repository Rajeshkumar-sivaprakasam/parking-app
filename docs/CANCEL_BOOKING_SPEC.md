# Cancel Booking Functionality - Technical Specification

## 1. Overview

### 1.1 Feature Description

The Cancel Booking functionality allows users to cancel their parking reservations with automatic refund processing, subject to configurable business rules and time-based restrictions.

### 1.2 Business Objectives

- Provide user flexibility for booking management
- Protect property owners from last-minute cancellations
- Automate refund processing
- Maintain comprehensive audit trails
- Ensure transparent communication

## 2. Business Rules

### 2.1 Cancellation Eligibility

- ✅ Bookings can only be cancelled BEFORE the start date/time
- ✅ Cancellations are blocked within configurable window (default: 2 hours before start)
- ✅ Only bookings with status 'CONFIRMED' or 'PENDING' can be cancelled
- ✅ Completed or expired bookings cannot be cancelled

### 2.2 Refund Policy

#### Time-Based Refund Percentages

```
Cancellation Time          | Refund Percentage
---------------------------|------------------
> 48 hours before start   | 100%
24-48 hours before start  | 75%
12-24 hours before start  | 50%
2-12 hours before start   | 25%
< 2 hours before start    | Not Allowed
```

#### Non-Refundable Bookings

- Display warning before cancellation confirmation
- No refund processed
- Booking still cancelled and slot released

### 2.3 Slot Availability

- Cancelled slots immediately return to available pool
- Real-time availability updates
- No double-booking prevention

## 3. User Workflow

### 3.1 Cancellation Flow

```
1. User navigates to "My Bookings"
   ↓
2. Selects active booking
   ↓
3. Clicks "Cancel Booking" button
   ↓
4. System validates eligibility
   ↓
5. Display cancellation confirmation modal
   - Show refund amount (if applicable)
   - Display cancellation policy
   - Request optional cancellation reason
   ↓
6. User confirms cancellation
   ↓
7. System processes:
   - Update booking status to 'CANCELLED'
   - Initiate refund (if applicable)
   - Release parking slot
   - Create audit log entry
   - Send notifications
   ↓
8. Display success message with refund details
```

### 3.2 Error Scenarios

#### Scenario 1: Within Restricted Window

```
Error Message: "Cancellations are not permitted within 2 hours of booking start time. Please contact support for assistance."
Action: Block cancellation, keep booking active
```

#### Scenario 2: Booking Already Started

```
Error Message: "This booking has already started and cannot be cancelled. Please contact support if you need assistance."
Action: Block cancellation
```

#### Scenario 3: Invalid Booking Status

```
Error Message: "This booking cannot be cancelled. Current status: [STATUS]"
Action: Block cancellation
```

## 4. Technical Implementation

### 4.1 Database Schema Updates

#### Bookings Table Modifications

```sql
ALTER TABLE bookings ADD COLUMN cancellation_reason VARCHAR(500);
ALTER TABLE bookings ADD COLUMN cancellation_time TIMESTAMP;
ALTER TABLE bookings ADD COLUMN cancelled_by VARCHAR(50);
ALTER TABLE bookings ADD COLUMN refund_amount DECIMAL(10,2);
ALTER TABLE bookings ADD COLUMN refund_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
ALTER TABLE bookings ADD COLUMN refund_transaction_id VARCHAR(100);
```

#### Booking Status Enum Update

```sql
ALTER TABLE bookings MODIFY COLUMN status ENUM(
  'PENDING',
  'CONFIRMED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
  'REFUNDED'
);
```

#### Audit Log Table

```sql
CREATE TABLE booking_audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_status VARCHAR(20),
  new_status VARCHAR(20),
  refund_amount DECIMAL(10,2),
  reason TEXT,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_created_at (created_at)
);
```

### 4.2 API Endpoints

#### Cancel Booking Endpoint

```typescript
POST /api/bookings/{bookingId}/cancel

Request Body:
{
  "reason": "string (optional, max 500 chars)",
  "confirmNonRefundable": "boolean (required for non-refundable bookings)"
}

Response (Success - 200):
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "bookingId": "string",
    "status": "CANCELLED",
    "refund": {
      "eligible": boolean,
      "amount": number,
      "percentage": number,
      "transactionId": "string",
      "estimatedDays": number
    },
    "cancelledAt": "ISO 8601 timestamp"
  }
}

Response (Error - 400):
{
  "success": false,
  "error": {
    "code": "CANCELLATION_NOT_ALLOWED",
    "message": "Cancellations are not permitted within 2 hours of booking start time",
    "details": {
      "bookingStartTime": "ISO 8601 timestamp",
      "currentTime": "ISO 8601 timestamp",
      "hoursUntilStart": number
    }
  }
}
```

#### Validate Cancellation Endpoint

```typescript
GET /api/bookings/{bookingId}/cancel/validate

Response (200):
{
  "eligible": boolean,
  "refundable": boolean,
  "refundPercentage": number,
  "refundAmount": number,
  "restrictions": {
    "withinRestrictedWindow": boolean,
    "hoursUntilStart": number,
    "minimumCancellationWindow": number
  },
  "warnings": ["string array"]
}
```

### 4.3 RinggitPay Integration

#### Refund Request

```typescript
POST https://api.ringgitpay.com/v1/refunds

Headers:
{
  "Authorization": "Bearer {API_KEY}",
  "Content-Type": "application/json"
}

Request Body:
{
  "transactionId": "string (original payment transaction ID)",
  "amount": number,
  "currency": "MYR",
  "reason": "string",
  "metadata": {
    "bookingId": "string",
    "userId": "string",
    "refundPercentage": number
  }
}

Response:
{
  "refundId": "string",
  "status": "PENDING",
  "amount": number,
  "estimatedCompletionDays": number,
  "createdAt": "ISO 8601 timestamp"
}
```

#### Refund Webhook

```typescript
POST /api/webhooks/ringgitpay/refund

Request Body:
{
  "event": "refund.completed" | "refund.failed",
  "refundId": "string",
  "transactionId": "string",
  "amount": number,
  "status": "COMPLETED" | "FAILED",
  "completedAt": "ISO 8601 timestamp",
  "metadata": {
    "bookingId": "string"
  }
}

Response: 200 OK
```

### 4.4 Business Logic Implementation

```typescript
// services/bookingCancellationService.ts

interface CancellationResult {
  success: boolean;
  refund?: RefundDetails;
  error?: CancellationError;
}

interface RefundDetails {
  eligible: boolean;
  amount: number;
  percentage: number;
  transactionId?: string;
  estimatedDays: number;
}

class BookingCancellationService {
  async cancelBooking(
    bookingId: string,
    userId: string,
    reason?: string
  ): Promise<CancellationResult> {
    // 1. Fetch booking details
    const booking = await this.getBooking(bookingId);

    // 2. Validate ownership
    if (booking.userId !== userId) {
      throw new UnauthorizedError("Not authorized to cancel this booking");
    }

    // 3. Validate cancellation eligibility
    const validation = this.validateCancellation(booking);
    if (!validation.eligible) {
      throw new CancellationNotAllowedError(validation.reason);
    }

    // 4. Calculate refund
    const refund = this.calculateRefund(booking);

    // 5. Begin transaction
    await this.db.transaction(async (trx) => {
      // Update booking status
      await trx("bookings")
        .where({ id: bookingId })
        .update({
          status: "CANCELLED",
          cancellation_reason: reason,
          cancellation_time: new Date(),
          cancelled_by: userId,
          refund_amount: refund.amount,
          refund_status: refund.eligible ? "PENDING" : null,
        });

      // Release parking slot
      await trx("parking_slots")
        .where({ id: booking.slotId })
        .update({ status: "AVAILABLE" });

      // Create audit log
      await trx("booking_audit_log").insert({
        booking_id: bookingId,
        user_id: userId,
        action: "CANCEL",
        old_status: booking.status,
        new_status: "CANCELLED",
        refund_amount: refund.amount,
        reason: reason,
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
      });

      // Process refund if eligible
      if (refund.eligible && refund.amount > 0) {
        const refundResult = await this.processRefund(booking, refund);

        await trx("bookings").where({ id: bookingId }).update({
          refund_transaction_id: refundResult.transactionId,
        });
      }
    });

    // 6. Send notifications
    await this.sendCancellationNotifications(booking, refund);

    return {
      success: true,
      refund: refund,
    };
  }

  private validateCancellation(booking: Booking): ValidationResult {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const hoursUntilStart =
      (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Check if booking has already started
    if (now >= startTime) {
      return {
        eligible: false,
        reason: "Booking has already started",
      };
    }

    // Check minimum cancellation window (2 hours)
    const minCancellationHours = this.config.get("MIN_CANCELLATION_HOURS", 2);
    if (hoursUntilStart < minCancellationHours) {
      return {
        eligible: false,
        reason: `Cancellations not permitted within ${minCancellationHours} hours of start time`,
      };
    }

    // Check booking status
    if (!["CONFIRMED", "PENDING"].includes(booking.status)) {
      return {
        eligible: false,
        reason: `Cannot cancel booking with status: ${booking.status}`,
      };
    }

    return { eligible: true };
  }

  private calculateRefund(booking: Booking): RefundDetails {
    if (!booking.refundable) {
      return {
        eligible: false,
        amount: 0,
        percentage: 0,
        estimatedDays: 0,
      };
    }

    const now = new Date();
    const startTime = new Date(booking.startTime);
    const hoursUntilStart =
      (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 0;

    if (hoursUntilStart > 48) {
      refundPercentage = 100;
    } else if (hoursUntilStart > 24) {
      refundPercentage = 75;
    } else if (hoursUntilStart > 12) {
      refundPercentage = 50;
    } else if (hoursUntilStart > 2) {
      refundPercentage = 25;
    }

    const refundAmount = (booking.totalAmount * refundPercentage) / 100;

    return {
      eligible: true,
      amount: refundAmount,
      percentage: refundPercentage,
      estimatedDays: 5 - 7,
    };
  }

  private async processRefund(
    booking: Booking,
    refund: RefundDetails
  ): Promise<RefundResult> {
    const ringgitPay = new RinggitPayClient(
      this.config.get("RINGGITPAY_API_KEY")
    );

    return await ringgitPay.createRefund({
      transactionId: booking.paymentTransactionId,
      amount: refund.amount,
      currency: "MYR",
      reason: "Booking cancellation",
      metadata: {
        bookingId: booking.id,
        userId: booking.userId,
        refundPercentage: refund.percentage,
      },
    });
  }

  private async sendCancellationNotifications(
    booking: Booking,
    refund: RefundDetails
  ): Promise<void> {
    // Send email to user
    await this.emailService.send({
      to: booking.userEmail,
      template: "booking-cancelled",
      data: {
        bookingId: booking.id,
        parkingLotName: booking.parkingLotName,
        startTime: booking.startTime,
        refund: refund,
      },
    });

    // Send email to admin
    await this.emailService.send({
      to: this.config.get("ADMIN_EMAIL"),
      template: "booking-cancelled-admin",
      data: {
        bookingId: booking.id,
        userId: booking.userId,
        parkingLotName: booking.parkingLotName,
        refundAmount: refund.amount,
      },
    });

    // Create in-app notification
    await this.notificationService.create({
      userId: booking.userId,
      type: "BOOKING_CANCELLED",
      title: "Booking Cancelled",
      message: `Your booking at ${booking.parkingLotName} has been cancelled`,
      data: { bookingId: booking.id, refund: refund },
    });
  }
}
```

## 5. Email Templates

### 5.1 User Cancellation Confirmation (Refundable)

```html
Subject: Booking Cancellation Confirmed - Refund Processing Dear {{userName}},
Your parking booking has been successfully cancelled. Booking Details: - Booking
ID: {{bookingId}} - Location: {{parkingLotName}} - Original Start Time:
{{startTime}} - Cancelled At: {{cancelledAt}} Refund Information: - Refund
Amount: RM {{refundAmount}} - Refund Percentage: {{refundPercentage}}% -
Processing Time: 5-7 business days - Refund Method: Original payment method The
refund will be credited to your original payment method within 5-7 business
days. Thank you for using ParkMy.
```

### 5.2 User Cancellation Confirmation (Non-Refundable)

```html
Subject: Booking Cancellation Confirmed Dear {{userName}}, Your parking booking
has been successfully cancelled. Booking Details: - Booking ID: {{bookingId}} -
Location: {{parkingLotName}} - Original Start Time: {{startTime}} - Cancelled
At: {{cancelledAt}} Please note: This was a non-refundable booking. No refund
will be processed. Thank you for using ParkMy.
```

## 6. Testing Requirements

### 6.1 Unit Tests

- ✅ Refund calculation logic for all time windows
- ✅ Cancellation eligibility validation
- ✅ Booking status transitions
- ✅ Audit log creation

### 6.2 Integration Tests

- ✅ End-to-end cancellation flow
- ✅ RinggitPay API integration
- ✅ Email notification delivery
- ✅ Database transaction rollback on failure

### 6.3 Test Cases

```gherkin
Feature: Cancel Booking

Scenario: Cancel refundable booking >48 hours before start
  Given user has a confirmed booking starting in 72 hours
  And booking amount is RM 50
  When user cancels the booking
  Then booking status should be 'CANCELLED'
  And refund amount should be RM 50 (100%)
  And parking slot should be available
  And user should receive cancellation email
  And audit log should be created

Scenario: Cancel booking within restricted window
  Given user has a confirmed booking starting in 1 hour
  When user attempts to cancel the booking
  Then cancellation should be blocked
  And error message should display "within 2 hours"
  And booking status should remain 'CONFIRMED'

Scenario: Cancel non-refundable booking
  Given user has a non-refundable booking
  When user confirms cancellation
  Then booking status should be 'CANCELLED'
  And no refund should be processed
  And parking slot should be available
```

## 7. Configuration

### 7.1 Environment Variables

```env
MIN_CANCELLATION_HOURS=2
REFUND_PERCENTAGE_48H=100
REFUND_PERCENTAGE_24H=75
REFUND_PERCENTAGE_12H=50
REFUND_PERCENTAGE_2H=25
RINGGITPAY_API_KEY=your_api_key
RINGGITPAY_WEBHOOK_SECRET=your_webhook_secret
ADMIN_EMAIL=admin@parkmy.com
```

## 8. Monitoring & Analytics

### 8.1 Metrics to Track

- Cancellation rate (% of bookings cancelled)
- Average refund amount
- Cancellation reasons (categorized)
- Time-to-cancel distribution
- Refund processing success rate

### 8.2 Alerts

- Failed refund processing
- High cancellation rate (>20% in 24h)
- Webhook delivery failures

## 9. Security Considerations

- ✅ Validate user ownership before cancellation
- ✅ Prevent duplicate cancellation requests (idempotency)
- ✅ Secure webhook endpoint with signature verification
- ✅ Rate limiting on cancellation endpoint
- ✅ Audit all cancellation attempts (success and failure)

## 10. Future Enhancements

- Partial cancellation (for multi-day bookings)
- Cancellation insurance option
- Flexible refund policies per parking lot
- Automated rebooking suggestions
- Cancellation analytics dashboard
