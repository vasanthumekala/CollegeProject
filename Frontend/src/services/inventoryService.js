import api from "./api";

export const inventoryService = {
  // Add new product (admin only)
  addProduct: async (productData) => {
    try {
      const response = await api.post("/inventory/add", productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      const response = await api.get("/inventory", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/inventory/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update product details (admin only)
  updateProductDetails: async (productId, productData) => {
    try {
      const response = await api.patch(
        `/inventory/update/${productId}`,
        productData,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/inventory/delete/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Increment product quantity (admin only)
  incrementQuantity: async (productId, quantity) => {
    try {
      const response = await api.patch(`/inventory/${productId}/increment`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Decrement product quantity (admin only)
  decrementQuantity: async (productId, quantity) => {
    try {
      const response = await api.patch(`/inventory/${productId}/decrement`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await api.get("/inventory/low-stock", {
        params: { threshold },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search products by type or name
  searchProducts: async (searchTerm) => {
    try {
      const response = await api.get("/inventory/search", {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    try {
      const response = await api.get("/inventory/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default inventoryService;
