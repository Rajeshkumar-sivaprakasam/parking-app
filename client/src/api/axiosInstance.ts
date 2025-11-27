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
    // You can add logic here to attach tokens, etc.
    const state = localStorage.getItem("persist:root"); // Assuming redux-persist or similar, or just direct token storage
    // For now, let's assume the token is stored in localStorage directly for simplicity, or we access the store.
    // Since we can't easily import the store here (circular dependency), we'll use a simple localStorage key if set by the slice.

    // Actually, let's check if we can get it from the state if we were using redux-persist, but for now let's rely on the authSlice to save it to localStorage or just use the state if possible.
    // A common pattern is to subscribe to the store, but here we'll just check localStorage 'token'.
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
