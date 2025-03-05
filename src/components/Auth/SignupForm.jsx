import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import styles from '../../assets/styles/Auth/SignupForm.module.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth(); // Use the signup function from AuthContext

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement validation
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
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
      await signup(formData.email, formData.password, formData.name); // Use Firebase signup
      navigate('/login', { 
        state: { message: 'Account created successfully! Please login.' } 
      });
    } catch (error) {
      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <h2>Join EduMatrix</h2>
          <p>Create your account to start learning</p>
        </div>
        
        {errors.general && (
          <div className={styles.errorAlert}>
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? styles.inputError : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          
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
              placeholder="Create a strong password"
              className={errors.password ? styles.inputError : ''}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? styles.inputError : ''}
            />
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>
          
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreedToTerms">
              I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
            {errors.agreedToTerms && (
              <span className={styles.errorText}>{errors.agreedToTerms}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className={styles.signupButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div className={styles.divider}>
            <span>OR</span>
          </div>
          
          <button type="button" className={styles.googleButton}>
            <img src="/assets/google-icon.svg" alt="Google" />
            Sign up with Google
          </button>
          
          <div className={styles.loginLink}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
