import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/apiendpoints";

export interface Booking {
  _id: string;
  slotId: any; // Populated
  vehicleId: any; // Populated
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
}

export const bookingService = {
  getBookings: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.bookings.getAll);
    return response.data.data;
  },

  getAllBookings: async () => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.bookings.getAllAdmin
    );
    return response.data.data;
  },

  createBooking: async (bookingData: any) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.bookings.create,
      bookingData
    );
    return response.data.data;
  },

  cancelBooking: async (id: string) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.bookings.cancel(id)
    );
    return response.data;
  },

  extendBooking: async (
    id: string,
    data: { duration: number; additionalAmount: number }
  ) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.bookings.extend(id),
      data
    );
    return response.data.data;
  },
};
