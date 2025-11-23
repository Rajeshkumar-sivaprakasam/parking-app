import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ParkingSlot {
  id: string;
  status: "FREE" | "OCCUPIED" | "RESERVED";
  type: "standard" | "disabled" | "ev";
}

interface ParkingMapState {
  slots: ParkingSlot[];
  filters: {
    showCovered: boolean;
    maxPrice: number;
  };
  selectedSlotId: string | null;
}

const initialState: ParkingMapState = {
  slots: [],
  filters: {
    showCovered: true,
    maxPrice: 100,
  },
  selectedSlotId: null,
};

const parkingMapSlice = createSlice({
  name: "parkingMap",
  initialState,
  reducers: {
    setSlots: (state, action: PayloadAction<ParkingSlot[]>) => {
      state.slots = action.payload;
    },
    updateSlotStatus: (
      state,
      action: PayloadAction<{ id: string; status: ParkingSlot["status"] }>
    ) => {
      const slot = state.slots.find((s) => s.id === action.payload.id);
      if (slot) {
        slot.status = action.payload.status;
      }
    },
    selectSlot: (state, action: PayloadAction<string | null>) => {
      state.selectedSlotId = action.payload;
    },
  },
});

export const { setSlots, updateSlotStatus, selectSlot } =
  parkingMapSlice.actions;
export default parkingMapSlice.reducer;
