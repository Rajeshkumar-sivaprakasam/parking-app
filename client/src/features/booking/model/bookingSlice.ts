import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/apiendpoints";

// Types
export interface Booking {
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
      const response = await axiosInstance.post(
        API_ENDPOINTS.bookings.create,
        bookingData
      );
      return response.data.data; // Assuming backend returns { success: true, data: ... }
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
