import axios from 'axios';

// API base URL - would typically come from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://api.edumatrix.com';

// Token management
const getToken = () => localStorage.getItem('accessToken');
const setToken = (token) => localStorage.setItem('accessToken', token);
const removeToken = () => localStorage.removeItem('accessToken');

// User data management
const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};
const setUserData = (user) => localStorage.setItem('userData', JSON.stringify(user));
const removeUserData = () => localStorage.removeItem('userData');

/**
 * Sets up axios interceptors for handling authentication
 */
const setupAxiosInterceptors = () => {
  // Request interceptor - add token to all requests
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor - handle token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 Unauthorized and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Attempt to refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            // No refresh token, force logout
            logout();
            return Promise.reject(new Error('Session expired. Please login again.'));
          }
          
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          // Save new tokens
          setToken(response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
          
        } catch (refreshError) {
          // If refresh fails, log out
          logout();
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Initialize interceptors
setupAxiosInterceptors();

/**
 * Helper function to handle auth errors
 */
const handleAuthError = (error) => {
  if (error.response) {
    // Server responded with an error
    return new Error(error.response.data.message || 'Authentication failed');
  } else if (error.request) {
    // Request was made but no response
    return new Error('No response from server. Please check your internet connection.');
  } else {
    // Something else happened
    return error;
  }
};

/**
 * Register a new user
 */
export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      email,
      password
    });
    
    setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    setUserData(response.data.user);
    
    return response.data.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Log in a user with email and password
 */
export const login = async (email, password, rememberMe = false) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      rememberMe
    });
    
    setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    setUserData(response.data.user);
    
    return response.data.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign out the current user
 */
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Call logout API if a token exists
    if (refreshToken) {
      await axios.post(`${API_URL}/auth/logout`, { refreshToken });
    }
    
    // Clear tokens and user data
    removeToken();
    removeUserData();
    localStorage.removeItem('refreshToken');
    
    return true;
  } catch (error) {
    // Still clear local data even if API call fails
    removeToken();
    removeUserData();
    localStorage.removeItem('refreshToken');
    
    throw handleAuthError(error);
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    // Implement Google sign-in - this is a placeholder
    // In a real app, this would handle the Google OAuth flow
    const response = await axios.get(`${API_URL}/auth/google`);
    
    setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    setUserData(response.data.user);
    
    return response.data.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Reset user password
 */
export const resetPassword = async (email) => {
  try {
    await axios.post(`${API_URL}/auth/reset-password`, { email });
    return true;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (user, updates) => {
  try {
    const response = await axios.put(`${API_URL}/users/${user.uid}`, updates);
    
    // Update locally stored user data
    const updatedUser = { ...getUserData(), ...response.data };
    setUserData(updatedUser);
    
    return updatedUser;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = () => {
  return getUserData();
};

/**
 * Auth state change observer
 * 
 * This is a mock implementation since we're not using Firebase directly
 * In a real app with Firebase, this would use their onAuthStateChanged
 */
export const onAuthStateChanged = (callback) => {
  // Initial call with current state
  const user = getUserData();
  setTimeout(() => callback(user), 0);
  
  // Set up a simple event listener for auth changes
  const checkForChanges = () => {
    const currentUser = getUserData();
    callback(currentUser);
  };
  
  // Check every 2 seconds for changes (simulating real-time updates)
  const interval = setInterval(checkForChanges, 2000);
  
  // Return function to unsubscribe
  return () => clearInterval(interval);
};

export default {
  signup,
  login,
  logout,
  resetPassword,
  updateProfile,
  signInWithGoogle,
  getCurrentUser,
  onAuthStateChanged
};