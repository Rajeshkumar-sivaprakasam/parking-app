import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/apiendpoints";

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  isDefault: boolean;
}

const vehiclesAdapter = createEntityAdapter<Vehicle>();

const initialState = vehiclesAdapter.getInitialState({
  loading: false,
  error: null as string | null,
});

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.vehicles.getAll);
    return response.data.data as Vehicle[]; // Assuming backend returns { success: true, data: [...] }
  }
);

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVehicles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchVehicles.fulfilled, (state, action) => {
      vehiclesAdapter.setAll(state, action.payload);
      state.loading = false;
    });
    builder.addCase(fetchVehicles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch vehicles";
    });
  },
});

export default vehicleSlice.reducer;
export const { selectAll: selectAllVehicles } = vehiclesAdapter.getSelectors();
