import api from "./api";

export const mechanicService = {
  // Add new mechanic (admin only)
  addMechanic: async (mechanicData, profileImage) => {
    try {
      const formData = new FormData();
      formData.append("name", mechanicData.name);
      formData.append("experience", mechanicData.experience);
      formData.append("contact", mechanicData.contact);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await api.post("/mechanics/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all mechanics
  getAllMechanics: async (filters = {}) => {
    try {
      const response = await api.get("/mechanics", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get mechanic by ID
  getMechanicById: async (mechanicId) => {
    try {
      const response = await api.get(`/mechanics/${mechanicId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update mechanic details (admin only)
  updateMechanic: async (mechanicId, mechanicData, profileImage) => {
    try {
      const formData = new FormData();
      if (mechanicData.name) formData.append("name", mechanicData.name);
      if (mechanicData.experience !== undefined)
        formData.append("experience", mechanicData.experience);
      if (mechanicData.contact)
        formData.append("contact", mechanicData.contact);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await api.patch(
        `/mechanics/update/${mechanicId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove mechanic (admin only)
  removeMechanic: async (mechanicId) => {
    try {
      const response = await api.delete(`/mechanics/remove/${mechanicId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get mechanic availability
  getMechanicAvailability: async (mechanicId) => {
    try {
      const response = await api.get(`/mechanics/${mechanicId}/availability`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get mechanic's bookings
  getMechanicBookings: async (mechanicId) => {
    try {
      const response = await api.get(`/mechanics/${mechanicId}/bookings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default mechanicService;
