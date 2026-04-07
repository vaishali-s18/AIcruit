import api from './api';

const STORAGE_KEY = 'aicruit_user';
const API_URL = '/api/auth';

export const authService = {
  // Sign up new user
  signup: async (name, email, password, role) => {
    try {
      const response = await api.post(`${API_URL}/signup`, { name, email, password, role });
      if (response.data.success) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Something went wrong during signup' 
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post(`${API_URL}/login`, { email, password });
      if (response.data.success) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials' 
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem(STORAGE_KEY);
  },

  // Update user profile
  updateProfile: async (updates) => {
    try {
      const response = await api.put(`${API_URL}/profile`, updates);
      
      if (response.data.success) {
        // Update local session data with fresh user info
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating profile' 
      };
    }
  },

  // Add saved job
  saveJob: async (userId, jobId) => {
    try {
      const response = await api.post(`${API_URL}/save-job`, { userId, jobId });
      if (response.data.success) {
        // Update local session data
        const user = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (user) {
          user.savedJobs = response.data.savedJobs;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
      }
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error saving job' };
    }
  },

  // Remove saved job
  unsaveJob: async (userId, jobId) => {
    try {
      const response = await api.post(`${API_URL}/unsave-job`, { userId, jobId });
      if (response.data.success) {
        // Update local session data
        const user = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (user) {
          user.savedJobs = response.data.savedJobs;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
      }
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error unsaving job' };
    }
  },

  // Apply for a job
  applyJob: async (userId, jobId) => {
    return { success: false, message: 'Not implemented in backend yet' };
  }
};

