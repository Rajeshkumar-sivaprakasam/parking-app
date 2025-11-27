import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if your backend runs on a different port
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here, e.g., 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Redirect to login or clear token
      console.error("Unauthorized access - redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
