// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, name) => {
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Return the user
      return userCredential.user;
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      throw error;
    }
  };

  // Log in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      throw error;
    }
  };

  // Log out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.code, error.message);
      throw error;
    }
  };

  // Check if user's email is verified
  const isEmailVerified = () => {
    return currentUser?.emailVerified || false;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Context value - all the authentication related functions and state
  const value = {
    currentUser,
    signup,
    login,
    logout,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;