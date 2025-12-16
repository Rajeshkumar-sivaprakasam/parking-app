import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MainLayout } from "../../shared/ui/MainLayout";
import { ProtectedRoute } from "../../features/auth/ui/ProtectedRoute";
import { LoadingFallback } from "../../shared/ui/LoadingFallback";

// Lazy load all page components for code splitting
const HomePage = lazy(() =>
  import("../../pages/home/HomePage").then((m) => ({ default: m.HomePage }))
);
const LoginPage = lazy(() =>
  import("../../pages/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const SignUpPage = lazy(() =>
  import("../../pages/auth/SignUpPage").then((m) => ({ default: m.SignUpPage }))
);
const BookingPage = lazy(() =>
  import("../../pages/booking/BookingPage").then((m) => ({
    default: m.BookingPage,
  }))
);
const SlotSelectionPage = lazy(() =>
  import("../../pages/booking/SlotSelectionPage").then((m) => ({
    default: m.SlotSelectionPage,
  }))
);
const BookingsPage = lazy(() =>
  import("../../pages/bookings/BookingsPage").then((m) => ({
    default: m.BookingsPage,
  }))
);
const VehiclesPage = lazy(() =>
  import("../../pages/vehicles/VehiclesPage").then((m) => ({
    default: m.VehiclesPage,
  }))
);
const PaymentsPage = lazy(() =>
  import("../../pages/payments/PaymentsPage").then((m) => ({
    default: m.PaymentsPage,
  }))
);
const ProfilePage = lazy(() =>
  import("../../pages/profile/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  }))
);
const EditProfilePage = lazy(() =>
  import("../../pages/profile/EditProfilePage").then((m) => ({
    default: m.EditProfilePage,
  }))
);
const AdminRecordsPage = lazy(() =>
  import("../../pages/admin/AdminRecordsPage").then((m) => ({
    default: m.AdminRecordsPage,
  }))
);

// Wrapper component for lazy-loaded routes
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <LazyRoute>
        <LoginPage />
      </LazyRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <LazyRoute>
        <SignUpPage />
      </LazyRoute>
    ),
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: (
              <LazyRoute>
                <HomePage />
              </LazyRoute>
            ),
          },
          {
            path: "/booking",
            element: (
              <LazyRoute>
                <BookingPage />
              </LazyRoute>
            ),
          },
          {
            path: "/booking/slots",
            element: (
              <LazyRoute>
                <SlotSelectionPage />
              </LazyRoute>
            ),
          },
          {
            path: "/bookings",
            element: (
              <LazyRoute>
                <BookingsPage />
              </LazyRoute>
            ),
          },
          {
            path: "/vehicles",
            element: (
              <LazyRoute>
                <VehiclesPage />
              </LazyRoute>
            ),
          },
          {
            path: "/payments",
            element: (
              <LazyRoute>
                <PaymentsPage />
              </LazyRoute>
            ),
          },
          {
            path: "/profile",
            element: (
              <LazyRoute>
                <ProfilePage />
              </LazyRoute>
            ),
          },
          {
            path: "/profile/edit",
            element: (
              <LazyRoute>
                <EditProfilePage />
              </LazyRoute>
            ),
          },
          {
            path: "/admin",
            element: (
              <LazyRoute>
                <AdminRecordsPage />
              </LazyRoute>
            ),
          },
        ],
      },
    ],
  },
]);
