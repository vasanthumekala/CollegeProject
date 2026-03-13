import api from "./api";

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials);
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post("/users/refresh-token");
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authService;
