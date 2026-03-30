import api from "./api";

export const contactService = {
  // Submit a contact message (public, no auth needed)
  submitMessage: async (formData) => {
    try {
      const response = await api.post("/contact/submit", formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all contact messages (admin only)
  getAllMessages: async () => {
    try {
      const response = await api.get("/contact/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a contact message (admin only)
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/contact/delete/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default contactService;
