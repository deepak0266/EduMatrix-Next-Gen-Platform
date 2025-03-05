import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/common.module.css';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, signInWithGoogle, currentUser } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(redirectPath, { replace: true });
    }
  }, [currentUser, navigate, redirectPath]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await login(email, password, rememberMe);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrors({ auth: 'Invalid email or password' });
      } else if (error.code === 'auth/too-many-requests') {
        setErrors({ auth: 'Too many failed login attempts. Please try again later or reset your password.' });
      } else {
        setErrors({ auth: error.message || 'An error occurred during login' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      navigate(redirectPath, { replace: true });
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
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Log in to your EduMatrix account</p>
        </div>
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          {errors.auth && (
            <div className={`${styles.formError} ${styles.mb4}`}>
              {errors.auth}
            </div>
          )}
          
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
            <div className={`${styles.flex} ${styles.justifyBetween}`}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <Link to="/forgot-password" className={styles.authLink}>
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className={styles.formInput}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className={styles.formError}>{errors.password}</div>
            )}
          </div>
          
          <div className={`${styles.flex} ${styles.itemsCenter} ${styles.mb6}`}>
            <label className={`${styles.flex} ${styles.itemsCenter} ${styles.gap2}`}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>
          
          <Button
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            type="submit"
          >
            Log In
          </Button>
          
          <div className={styles.authDivider}>or continue with</div>
          
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
            Don't have an account?{' '}
            <Link to="/signup" className={styles.authLink}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;