import api from './api';

/**
 * Upload Resume Service
 * Uses FormData to send file to the backend
 * @param {File} file - The resume file (PDF or TXT)
 */
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Resume Upload Service Error:', error);
    throw error.response?.data || { message: 'Network error or server unavailable' };
  }
};
