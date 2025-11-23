# Task Checklist

- [x] **Phase 1: Foundation & Setup**

  - [x] Initialize Vite + React + TypeScript project.
  - [x] Configure Tailwind CSS v4.
  - [x] Setup Redux Toolkit Store.
  - [x] Setup React Router.
  - [x] Configure i18n (English, Malay, Chinese).
  - [x] Setup JSON Server.

- [ ] **Phase 2: Core Features**

  - [ ] **Authentication**
    - [x] Implement Login/Signup pages.
    - [x] Create `authSlice`.
    - [x] Mock OTP login flow.
  - [ ] **Vehicle Management**
    - [x] Create `VehicleList` and `AddVehicle` forms.
    - [x] Implement `vehicleSlice` with CRUD operations.
  - [ ] **Parking Map & Slots**
    - [ ] Integrate Map library (Leaflet).
    - [ ] Create `ParkingSlotGrid` component.
    - [ ] Implement `useParkingAvailability` hook.

- [ ] **Phase 3: Booking Workflow**

  - [ ] Create Booking Wizard.
  - [ ] Implement `bookingSlice`.
  - [ ] Add "Extend Booking" logic.

- [ ] **Phase 4: Payment & Localization**
  - [ ] Create Mock Payment Gateway page.
  - [ ] Implement `PaymentMethodSelector`.
  - [ ] Handle success/failure callbacks.
  - [ ] Translate key UI elements.
