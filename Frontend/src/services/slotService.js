import api from "./api";

export const slotService = {
  // Get available slots for booking
  getAvailableSlots: async (filters = {}) => {
    try {
      const response = await api.get("/slots/available", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all slots (admin)
  getAllSlots: async (filters = {}) => {
    try {
      const response = await api.get("/slots", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get slots by date
  getSlotsByDate: async (date) => {
    try {
      const response = await api.get("/slots/date", {
        params: { date },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get slots by mechanic
  getSlotsByMechanic: async (mechanicId) => {
    try {
      const response = await api.get(`/slots/mechanic/${mechanicId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check slot availability
  checkAvailability: async (slotId) => {
    try {
      const response = await api.get(`/slots/${slotId}/availability`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get slots for date range
  getSlotsByDateRange: async (startDate, endDate, filters = {}) => {
    try {
      const response = await api.get("/slots/date-range", {
        params: { startDate, endDate, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get peak hours
  getPeakHours: async () => {
    try {
      const response = await api.get("/slots/peak-hours");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default slotService;
