import api from "./api";

export const carService = {
  // Register a new car
  registerCar: async (carData) => {
    try {
      const response = await api.post("/cars/register", carData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's cars
  getMyCars: async (userId) => {
    try {
      const response = await api.get(`/cars/my/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all cars (admin)
  getAllCars: async (filters = {}) => {
    try {
      const response = await api.get("/cars", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get car by ID
  getCarById: async (carId) => {
    try {
      const response = await api.get(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update car details
  updateCar: async (carId, carData) => {
    try {
      const response = await api.patch(`/cars/update/${carId}`, carData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove/Delete car
  removeCar: async (carId) => {
    try {
      const response = await api.delete(`/cars/remove/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search cars by license number
  searchByLicense: async (licenseNo) => {
    try {
      const response = await api.get("/cars/search", {
        params: { licenseNo },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default carService;
