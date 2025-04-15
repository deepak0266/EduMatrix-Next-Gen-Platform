import axios from 'axios';

// Environment variables for Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload file to Cloudinary using unsigned upload
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Upload response
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'auto');
    
    // Upload to Cloudinary with unsigned upload
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      formData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    
    // Extract the actual error message from Cloudinary's response if available
    const errorMessage = 
      error.response?.data?.error?.message || 
      error.response?.data?.error || 
      error.message || 
      'Failed to upload file';
    
    throw new Error(errorMessage);
  }
};

export default {
  uploadToCloudinary
};