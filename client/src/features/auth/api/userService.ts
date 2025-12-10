import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/apiendpoints";

export const userService = {
  getAllUsers: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.users.getAll);
    return response.data.data;
  },
};
