import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/model/authSlice";
import bookingReducer from "../../features/booking/model/bookingSlice";
import vehicleReducer from "../../features/vehicle-mgmt/model/vehicleSlice";
import parkingMapReducer from "../../features/map-filters/model/parkingMapSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    vehicles: vehicleReducer,
    parkingMap: parkingMapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
