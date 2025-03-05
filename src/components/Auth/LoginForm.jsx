import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import styles from '../../assets/styles/Auth/LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password); // Use Firebase login
      navigate('/study-dashboard'); // Redirect after successful login
    } catch (error) {
      setErrors({
        general: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h2>Welcome to EduMatrix</h2>
          <p>Login to continue your learning journey</p>
        </div>
        
        {errors.general && (
          <div className={styles.errorAlert}>
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? styles.inputError : ''}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>
          
          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className={styles.divider}>
            <span>OR</span>
          </div>
          
          <button type="button" className={styles.googleButton}>
            <img src="/assets/google-icon.svg" alt="Google" />
            Continue with Google
          </button>
          
          <div className={styles.signupLink}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;