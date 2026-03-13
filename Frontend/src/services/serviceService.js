import api from "./api";

export const serviceService = {
  // Add new service (admin only)
  addService: async (serviceData) => {
    try {
      const response = await api.post("/services/addService", serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all services
  getAllServices: async () => {
    try {
      const response = await api.get("/services/allService");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get service by ID
  getServiceById: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update service charge (admin only)
  updateServiceCharge: async (serviceId, serviceCharge) => {
    try {
      const response = await api.patch(`/services/update/${serviceId}`, {
        serviceCharge,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete service (admin only)
  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/services/remove/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get service statistics
  getServiceStats: async () => {
    try {
      const response = await api.get("/services/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get popular services
  getPopularServices: async () => {
    try {
      const response = await api.get("/services/popular");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default serviceService;
