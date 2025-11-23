import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/home/HomePage';
import { LoginPage } from '../../pages/auth/LoginPage';
import { SignUpPage } from '../../pages/auth/SignUpPage';
import { BookingPage } from '../../pages/booking/BookingPage';
import { SlotSelectionPage } from '../../pages/booking/SlotSelectionPage';
import { BookingsPage } from '../../pages/bookings/BookingsPage';
import { MainLayout } from '../../shared/ui/MainLayout';
import { VehiclesPage } from '../../pages/vehicles/VehiclesPage';
import { PaymentsPage } from '../../pages/payments/PaymentsPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { EditProfilePage } from '../../pages/profile/EditProfilePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/booking',
        element: <BookingPage />,
      },
      {
        path: '/booking/slots',
        element: <SlotSelectionPage />,
      },
      {
        path: '/bookings',
        element: <BookingsPage />,
      },
      {
        path: '/vehicles',
        element: <VehiclesPage />,
      },
      {
        path: '/payments',
        element: <PaymentsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile/edit',
        element: <EditProfilePage />,
      },
    ],
  },
]);
