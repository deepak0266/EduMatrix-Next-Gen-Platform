import axios from 'axios';

// Environment variables for Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload file to Cloudinary using unsigned upload with PDF optimization
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Upload response
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Add PDF specific transformations if it's a PDF file
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      // Enable PDF pages
      formData.append('pages', 'true');
      
      // Set flags for better PDF compatibility
      formData.append('flags', 'attachment');
      
      // Add these parameters for better PDF viewing
      formData.append('resource_type', 'raw');
    }
    
    // Upload to Cloudinary with unsigned upload
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      formData
    );
    
    // For PDFs, make sure the URL has proper content-disposition
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      // Add flag to ensure inline display in browsers
      response.data.secure_url = `${response.data.secure_url}?fl_inline`;
    }
    
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

/**
 * Get optimized PDF URL for viewing
 * @param {string} url - Original PDF URL
 * @returns {string} - Optimized URL for viewing
 */
export const getOptimizedPdfUrl = (url) => {
  if (!url) return '';
  
  // If URL already has query parameters
  if (url.includes('?')) {
    return `${url}&fl_inline=true`;
  }
  
  return `${url}?fl_inline=true`;
};

export default {
  uploadToCloudinary,
  getOptimizedPdfUrl
};