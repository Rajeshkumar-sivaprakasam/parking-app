import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/apiendpoints";

export interface ParkingSlot {
  _id: string;
  number: string;
  type: "standard" | "ev" | "disabled";
  status: "available" | "occupied" | "reserved";
  pricePerHour: number;
  location: string;
}

export const parkingService = {
  getSlots: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get(
      API_ENDPOINTS.parkingSlots.getAll,
      {
        params,
      }
    );
    return response.data.data;
  },
};
