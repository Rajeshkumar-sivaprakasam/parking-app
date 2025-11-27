export const API_ENDPOINTS = {
  users: {
    getAll: "/users",
    getById: (id: string) => `/users/${id}`,
    create: "/users",
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  vehicles: {
    getAll: "/vehicles",
    getById: (id: string) => `/vehicles/${id}`,
    create: "/vehicles",
    update: (id: string) => `/vehicles/${id}`,
    delete: (id: string) => `/vehicles/${id}`,
  },
  bookings: {
    getAll: "/bookings",
    getById: (id: string) => `/bookings/${id}`,
    create: "/bookings",
    update: (id: string) => `/bookings/${id}`,
    delete: (id: string) => `/bookings/${id}`,
  },
  slots: {
    getAll: "/slots",
    getById: (id: string) => `/slots/${id}`,
    create: "/slots",
    update: (id: string) => `/slots/${id}`,
    delete: (id: string) => `/slots/${id}`,
  },
  auth: {
    login: "/users/login",
    register: "/users",
  },
};
