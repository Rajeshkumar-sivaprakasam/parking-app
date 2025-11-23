import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

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
      const response = await fetch("http://localhost:3000/bookings", {
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
