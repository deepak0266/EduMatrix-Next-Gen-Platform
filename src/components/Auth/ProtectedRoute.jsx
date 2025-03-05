import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import the hook

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // Use the hook

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect to login if user is not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;