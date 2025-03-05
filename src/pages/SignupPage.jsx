import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/common.module.css';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup, signInWithGoogle, currentUser } = useContext(AuthContext);
  
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await signup(email, password, fullName);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ auth: 'This email is already registered. Please login instead.' });
      } else {
        setErrors({ auth: error.message || 'An error occurred during signup' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ auth: 'Could not sign in with Google. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create an Account</h1>
          <p className={styles.authSubtitle}>Join EduMatrix to boost your learning journey</p>
        </div>
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          {errors.auth && (
            <div className={`${styles.formError} ${styles.mb4}`}>
              {errors.auth}
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.formLabel}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className={styles.formInput}
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && (
              <div className={styles.formError}>{errors.fullName}</div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={styles.formInput}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className={styles.formError}>{errors.email}</div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.formInput}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className={styles.formError}>{errors.password}</div>
            )}
            <div className={styles.formHelp}>
              At least 8 characters with uppercase, lowercase, and numbers
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.formInput}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <div className={styles.formError}>{errors.confirmPassword}</div>
            )}
          </div>
          
          <div className={`${styles.formGroup} ${styles.mb6}`}>
            <label className={`${styles.flex} ${styles.itemsStart} ${styles.gap2}`}>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                style={{ marginTop: '0.25rem' }}
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className={styles.authLink}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className={styles.authLink}>
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <div className={styles.formError}>{errors.agreeToTerms}</div>
            )}
          </div>
          
          <Button
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            type="submit"
          >
            Create Account
          </Button>
          
          <div className={styles.authDivider}>or sign up with</div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={styles.authSocialButton}
          >
            <img src="/assets/icons/google-icon.svg" alt="Google" width="20" height="20" />
            <span>Google</span>
          </button>
          
          <div className={styles.authFooter}>
            Already have an account?{' '}
            <Link to="/login" className={styles.authLink}>
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;