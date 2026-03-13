import api from "./api";

export const bookingService = {
  // User: Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings/create", bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User: Get own bookings
  getMyBookings: async () => {
    try {
      const response = await api.get("/bookings/myBookings");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // User: Cancel own booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.patch(`/bookings/cancel/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Get all bookings
  getAllBookings: async (filters = {}) => {
    try {
      const response = await api.get("/bookings/allBookings", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.patch(`/bookings/updateStatus/${bookingId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Assign mechanic to booking
  assignMechanic: async (bookingId, mechanicId) => {
    try {
      const response = await api.patch(
        `/bookings/assignMechanic/${bookingId}`,
        {
          mechanicId,
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking statistics (admin)
  getBookingStats: async () => {
    try {
      const response = await api.get("/bookings/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get upcoming bookings
  getUpcomingBookings: async () => {
    try {
      const response = await api.get("/bookings/upcoming");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default bookingService;
