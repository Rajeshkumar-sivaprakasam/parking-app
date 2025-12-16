import axios, { type AxiosRequestConfig } from "axios";
import { apiCache, cacheTTL } from "../shared/lib/apiCache";

// Extend AxiosRequestConfig to include cache options
declare module "axios" {
  interface AxiosRequestConfig {
    cache?: boolean;
    cacheTTL?: number;
  }
}

// Endpoints that should be cached
const CACHEABLE_ENDPOINTS = ["/slots", "/vehicles"];

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Check cache for GET requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check cache for GET requests
    if (config.method?.toLowerCase() === "get" && config.cache !== false) {
      const shouldCache = CACHEABLE_ENDPOINTS.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (shouldCache) {
        const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
        const cachedData = apiCache.get(cacheKey);

        if (cachedData) {
          // Return cached data by throwing a special "error"
          // This prevents the actual request from being made
          return Promise.reject({
            __CACHE_HIT__: true,
            data: cachedData,
            config,
          });
        }

        // Store cache key in config for response interceptor
        (config as any).__cacheKey = cacheKey;
        (config as any).__cacheTTL = config.cacheTTL || cacheTTL.MEDIUM;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Cache successful responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Cache the response if it was marked for caching
    const cacheKey = (response.config as any).__cacheKey;
    const ttl = (response.config as any).__cacheTTL;

    if (cacheKey && response.status === 200) {
      apiCache.set(cacheKey, response.data, ttl);
    }

    return response;
  },
  (error) => {
    // Handle cache hits
    if (error.__CACHE_HIT__) {
      return Promise.resolve({
        data: error.data,
        status: 200,
        statusText: "OK (cached)",
        headers: {},
        config: error.config,
      });
    }

    // Handle global errors
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - redirecting to login...");
    }
    return Promise.reject(error);
  }
);

// Utility to invalidate cache
export const invalidateCache = {
  slots: () => apiCache.deleteByPrefix("/slots"),
  vehicles: () => apiCache.deleteByPrefix("/vehicles"),
  all: () => apiCache.clear(),
};

export default axiosInstance;
