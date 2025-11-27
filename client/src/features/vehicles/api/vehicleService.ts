import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/apiendpoints";

export interface Vehicle {
  _id: string;
  plateNumber: string;
  make: string;
  vehicleModel: string;
  color: string;
  isDefault: boolean;
}

export const vehicleService = {
  getVehicles: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.vehicles.getAll);
    return response.data.data;
  },

  addVehicle: async (vehicleData: Omit<Vehicle, "_id">) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.vehicles.add,
      vehicleData
    );
    return response.data.data;
  },

  updateVehicle: async (id: string, vehicleData: Partial<Vehicle>) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.vehicles.update(id),
      vehicleData
    );
    return response.data.data;
  },

  deleteVehicle: async (id: string) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.vehicles.delete(id)
    );
    return response.data;
  },
};
