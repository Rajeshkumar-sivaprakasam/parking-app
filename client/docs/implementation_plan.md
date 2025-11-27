# Implementation Plan - Malaysia Parking Lot Booking System

# Goal Description

Build a production-grade parking lot booking system tailored for the Malaysian market using React 19, TypeScript, Tailwind CSS v4, and Redux Toolkit.

## User Review Required

> [!IMPORTANT]
>
> - **Maps API**: Confirm if we should use Google Maps (Cost) or Leaflet (Free/OpenStreetMap).
> - **Payment Gateways**: We will use mock implementations for TnG/GrabPay. Real integration requires merchant accounts.
> - **Backend**: This plan assumes a mock API from local json server for frontend development unless a Node.js backend is explicitly requested.

## Proposed Changes

### Phase 1: Foundation & Setup

#### [NEW] [Project Setup]

- Initialize Vite + React + TypeScript project.
- Configure Tailwind CSS v4.
- Setup Redux Toolkit Store.
- Setup React Router.
- Configure i18n (English, Malay, Chinese).

### Phase 2: Core Features

#### [NEW] [Authentication]

- Implement Login/Signup pages.
- Create `authSlice`.
- Mock OTP login flow.

#### [NEW] [Vehicle Management]

- Create `VehicleList` and `AddVehicle` forms.
- Implement `vehicleSlice` with CRUD operations.

#### [NEW] [Parking Map & Slots]

- Integrate Map library (Leaflet).
- Create `ParkingSlotGrid` component.
- Implement `useParkingAvailability` hook (mock WebSocket).

### Phase 3: Booking Workflow

#### [NEW] [Booking Flow]

- Create Booking Wizard (Select Lot -> Slot -> Vehicle -> Time).
- Implement `bookingSlice`.
- Add "Extend Booking" logic.

### Phase 4: Payment & Localization

#### [NEW] [Payment Integration]

- Create Mock Payment Gateway page.
- Implement `PaymentMethodSelector`.
- Handle success/failure callbacks.

#### [NEW] [Localization]

- Translate key UI elements to Malay and Chinese.
- Add language switcher.

## Verification Plan

### Automated Tests

- Unit tests for `calculateRefund` logic.
- Redux slice tests for booking state transitions.

### Manual Verification

- **Booking Flow**: Complete a full booking cycle (Select -> Pay -> Confirm).
- **Extension**: Verify "Extend" button appears < 15 mins before expiry.
- **Localization**: Switch languages and verify text updates.
- **Responsiveness**: Test on mobile view (Chrome DevTools).
