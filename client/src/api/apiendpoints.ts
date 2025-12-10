export const API_ENDPOINTS = {
  users: {
    getAll: "/users",
    delete: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
  },
  auth: {
    login: "/users/login",
    register: "/users",
  },
  vehicles: {
    getAll: "/vehicles",
    getAllAdmin: "/vehicles/all",
    add: "/vehicles",
    update: (id: string) => `/vehicles/${id}`,
    delete: (id: string) => `/vehicles/${id}`,
  },
  bookings: {
    getAll: "/bookings",
    getAllAdmin: "/bookings/all",
    create: "/bookings",
    cancel: (id: string) => `/bookings/${id}/cancel`,
    extend: (id: string) => `/bookings/${id}/extend`,
    delete: (id: string) => `/bookings/${id}`,
    update: (id: string) => `/bookings/${id}`,
  },
  parkingSlots: {
    getAll: "/slots",
    update: (id: string) => `/slots/${id}`,
  },
};
