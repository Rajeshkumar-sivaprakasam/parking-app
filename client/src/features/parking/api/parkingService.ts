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
  getSlots: async (status?: string, startTime?: string, duration?: number) => {
    const params: any = {};
    if (status) params.status = status;
    if (startTime) params.startTime = startTime;
    if (duration) params.duration = duration;

    const response = await axiosInstance.get(
      API_ENDPOINTS.parkingSlots.getAll,
      {
        params,
      }
    );
    return response.data.data;
  },
};
