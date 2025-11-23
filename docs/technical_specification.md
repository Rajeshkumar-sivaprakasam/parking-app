# Malaysia Parking Lot Booking System - Technical Specification & Development Guide

## 1. Scalable Architecture & Folder Structure

We will adopt a **Feature-Sliced Design (FSD)** approach, adapted for modern React ecosystems. This ensures high cohesion and low coupling, making the codebase scalable and maintainable.

### Folder Structure

```text
src/
├── app/                    # App-wide settings, providers, and entry points
│   ├── providers/          # Redux StoreProvider, ThemeProvider, RouterProvider
│   ├── styles/             # Global styles (Tailwind imports)
│   └── App.tsx             # Root component
├── pages/                  # Page components (Routing layer)
│   ├── home/
│   ├── booking/
│   ├── profile/
│   └── admin/
├── widgets/                # Complex UI blocks combining multiple features
│   ├── Header/
│   ├── ParkingMapWidget/   # Combines Map + Filters + Slot Selection
│   └── PaymentModal/       # Combines Payment Methods + Summary
├── features/               # User interactions (Business Logic + UI)
│   ├── auth/               # Login, OTP, Signup forms
│   ├── booking/            # Booking flow, Extension logic
│   ├── vehicle-mgmt/       # Add/Remove vehicles
│   └── map-filters/        # Filter parking lots
├── entities/               # Business entities (Data structure + highly reusable UI)
│   ├── user/               # User model, avatar
│   ├── vehicle/            # Vehicle model, VehicleCard
│   ├── parking-lot/        # Slot model, Slot UI
│   └── payment/            # Transaction model
├── shared/                 # Reusable infrastructure code (No business logic)
│   ├── api/                # Axios/Fetch instances
│   ├── ui/                 # Atomic components (Button, Input, Modal)
│   ├── lib/                # Helpers (date formatting, currency)
│   └── config/             # Env vars, constants
└── main.tsx
```

### Separation of Concerns

- **UI**:
  - **Shared/UI**: Atomic, dumb components (e.g., `Button`, `Card`).
  - **Entities**: Domain-specific UI (e.g., `VehicleCard`, `ParkingSlot`).
  - **Widgets**: Composition of features (e.g., `DashboardLayout`).
- **Logic**:
  - **Redux Slices**: Located in `model` folders within `entities` or `features`.
  - **Custom Hooks**: Encapsulate behavior (e.g., `useParkingAvailability`).
  - **API Services**: Defined in `shared/api` or specific `entities`.
- **Types**:
  - **Shared/Types**: Global utility types.
  - **Component-level**: Props interfaces co-located with components.

### Tailwind CSS v4 Configuration

Tailwind v4 uses a CSS-first configuration. We will define our theme variables directly in `src/app/styles/index.css`.

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #0066cc; /* Example corporate blue */
  --color-brand-secondary: #ff9900;
  --color-status-success: #10b981;
  --color-status-error: #ef4444;
  --color-status-reserved: #f59e0b;

  --font-sans: "Inter", sans-serif;
}

/* Dark mode support via media query or class strategy */
@variant dark (&:where(.dark, .dark *));
```

---

## 2. Comprehensive Feature Implementation

### User Authentication & Security

- **Strategy**: JWT (JSON Web Tokens) stored in `HttpOnly` cookies (preferred) or `localStorage` with short expiry.
- **Mobile-First**: Phone number login via OTP (Mocked for dev, Twilio/Firebase for prod).
- **RBAC**:
  - `User`: Can book, view history, manage vehicles.
  - `Admin`: Can manage lots, view audit logs, override slots.

### Vehicle Management

- **CRUD**:
  - `GET /vehicles`: List all.
  - `POST /vehicles`: Add new (Validate format: `Wxx 1234`).
  - `PUT /vehicles/:id`: Update details.
  - `DELETE /vehicles/:id`: Remove.
- **Default Vehicle**: Boolean flag `isDefault` in the database. When booking, auto-select the vehicle with `isDefault: true`.

### Geolocation & Parking Discovery

- **Map Integration**: `react-leaflet` (Lightweight) or Google Maps API.
- **Logic**:
  - `useGeolocation` hook to get user coordinates.
  - Calculate distance using Haversine formula (frontend or backend).
- **Deep Linking**: `https://waze.com/ul?ll={lat},{lng}&navigate=yes`.

### Visual Slot Selection

- **Tech**: HTML5 Canvas or SVG for performance with 100+ slots.
- **State Mapping**:
  - `0`: Free (Green)
  - `1`: Occupied (Red)
  - `2`: Reserved (Orange)
- **Updates**: WebSocket connection subscribing to `parking-lot-{id}` channel.

### Digital Entry/Exit System

- **Entry**: Generate a dynamic QR code containing `{ bookingId, timestamp, signature }`. Refreshes every 30s.
- **LPR Simulation**: A simple input field in the "Admin/Gate" view where you type a plate number, and it queries the active bookings to open the gate.

### Booking & Extension

- **Flow**: Select Lot -> Select Slot -> Select Vehicle -> Choose Duration -> Payment.
- **Extension**:
  - Check if slot is reserved _after_ current end time.
  - If free, allow `PATCH /bookings/{id}/extend`.

### Cancellation & Refunds

- **Validation**: `startTime - currentTime > 15 mins`.
- **Refund Engine**:
  - > 24h: 100% refund.
  - 1h - 24h: 80% refund.
  - < 1h: No refund (or custom rule).

---

## 3. Payment & Localization (Malaysia Context)

### Payment Gateway Integration (Mock)

- **Providers**: Touch 'n Go, GrabPay, FPX.
- **Flow**:
  1. User selects provider.
  2. App redirects to `/payment-mock/{provider}?amount=XX`.
  3. Mock page has "Success" and "Fail" buttons.
  4. Redirects back to `/booking/status?result=success`.
- **Webhooks**: Simulate a POST request to backend to update booking status from `PENDING` to `PAID`.

### Localization (i18n)

- **Library**: `react-i18next`.
- **Languages**:
  - `en`: English
  - `ms`: Bahasa Melayu
  - `zh`: Simplified Chinese
- **Storage**: Persist language preference in `localStorage`.

---

## 4. State Management (Redux Toolkit)

### Store Structure

```typescript
interface RootState {
  auth: AuthState;
  booking: BookingState;
  vehicle: VehicleState;
  parkingMap: ParkingMapState;
  ui: UIState; // For modals, toasts
}
```

### Slices

- **authSlice**: `user`, `token`, `isAuthenticated`, `role`.
- **bookingSlice**: `activeBooking`, `history`, `currentSelection` (draft booking).
- **vehicleSlice**: `list` (EntityAdapter), `loading`.
- **parkingMapSlice**: `slots` (Array), `filters` (price, covered), `userLocation`.

### API Handling

- Use **createAsyncThunk** for standard CRUD.
- Use **RTK Query** for high-frequency data like Slot Status (polling/cache invalidation).

---

## 5. Essential UI Components

### `VehicleCard`

- **Props**: `plateNumber`, `model`, `isDefault`, `onEdit`, `onDelete`.
- **Style**: Card with a "license plate" font style for the number.

### `ParkingSlotGrid`

- **Layout**: CSS Grid or Flexbox.
- **Interaction**: Click to select. Disabled if occupied.

### `BookingTimer`

- **Logic**: `setInterval` decrementing from `endTime`.
- **Alert**: When `< 15 mins`, show "Extend Now" button with pulsing animation.

### `PaymentMethodSelector`

- **UI**: Grid of logos (TnG, Grab, Bank Islam, Maybank).
- **Selection**: Highlights active border.

### `CancellationModal`

- **Content**:
  - "Are you sure?"
  - "Refund Amount: RM 5.00" (Calculated dynamically).
  - "Penalty: RM 2.00".

### `ReceiptInvoice`

- **Format**: Clean HTML layout printable to PDF.
- **Data**: Transaction ID, Date, Location, Duration, Amount, SST (6%).

---

## 6. Code Snippets

### Redux Slice: Booking

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Types
interface Booking {
  id: string;
  slotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
}

interface BookingState {
  activeBooking: Booking | null;
  history: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Async Thunk
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData: Partial<Booking>, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Booking failed");
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState: BookingState = {
  activeBooking: null,
  history: [],
  status: "idle",
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearActiveBooking: (state) => {
      state.activeBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.status = "succeeded";
          state.activeBooking = action.payload;
        }
      )
      .addCase(createBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearActiveBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
```

### Cancellation Logic Utility

```typescript
import { differenceInMinutes, parseISO } from "date-fns";

interface RefundCalculation {
  refundable: boolean;
  refundAmount: number;
  penalty: number;
  reason?: string;
}

export const calculateRefund = (
  bookingStartTime: string,
  totalAmount: number
): RefundCalculation => {
  const now = new Date();
  const start = parseISO(bookingStartTime);
  const minutesUntilStart = differenceInMinutes(start, now);

  // Policy: No refund if less than 15 mins before start
  if (minutesUntilStart < 15) {
    return {
      refundable: false,
      refundAmount: 0,
      penalty: totalAmount,
      reason: "Cancellation window expired (< 15 mins before start)",
    };
  }

  // Policy: 100% refund if > 24 hours, else 80%
  if (minutesUntilStart > 24 * 60) {
    return {
      refundable: true,
      refundAmount: totalAmount,
      penalty: 0,
    };
  } else {
    const penalty = totalAmount * 0.2;
    return {
      refundable: true,
      refundAmount: totalAmount - penalty,
      penalty: penalty,
    };
  }
};
```

### Custom Hook: useParkingAvailability

```typescript
import { useState, useEffect } from "react";

interface SlotStatus {
  id: string;
  status: "FREE" | "OCCUPIED" | "RESERVED";
}

export const useParkingAvailability = (lotId: string) => {
  const [slots, setSlots] = useState<SlotStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket: WebSocket;

    const connect = () => {
      // Replace with actual WS URL
      socket = new WebSocket(`wss://api.parking.my/lots/${lotId}/stream`);

      socket.onopen = () => {
        console.log("Connected to parking stream");
        setLoading(false);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Assuming the server sends the full list or diffs
          // Here we assume a full list update for simplicity
          setSlots(data);
        } catch (e) {
          console.error("Failed to parse slot update");
        }
      };

      socket.onerror = (err) => {
        setError("Connection error");
        setLoading(false);
      };

      socket.onclose = () => {
        // Simple reconnect logic could go here
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
    };
  }, [lotId]);

  return { slots, loading, error };
};
```
