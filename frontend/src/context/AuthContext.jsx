import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail as verifyEmailApi,
  resendVerification as resendVerificationApi,
} from '@/api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check initial authentication state on app startup
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCurrentUser();
      if (res?.success && res?.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // 401 Unauthorized is expected for unauthenticated users on initial load
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Authenticate user via backend API
  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      if (res?.success && res?.data?.user) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid email or password';
      const status = error.status || error.response?.status;
      const errors = error.response?.data?.errors || null;
      return { success: false, message, status, errors };
    }
  };

  // Register user via backend API (DOES NOT set user state / auto-login)
  const register = async (name, email, password) => {
    try {
      const res = await registerUser({ name, email, password });
      if (res?.success === false) {
        return {
          success: false,
          message: res?.message || 'Registration failed',
          errors: res?.errors || null,
        };
      }
      return {
        success: true,
        message: res?.message || 'Registration successful. Please verify your email.',
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      const errors = error.response?.data?.errors || null;
      return { success: false, message, errors };
    }
  };

  // Verify email token
  const verifyAccountEmail = async (token) => {
    try {
      const res = await verifyEmailApi(token);
      if (res?.success === false) {
        return { success: false, message: res?.message || 'Verification failed' };
      }
      return { success: true, message: res?.message || 'Email verified successfully' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid or expired verification link';
      return { success: false, message };
    }
  };

  // Resend verification email
  const resendVerificationLink = async (email) => {
    try {
      const res = await resendVerificationApi(email);
      if (res?.success === false) {
        return { success: false, message: res?.message || 'Failed to resend verification email' };
      }
      return { success: true, message: res?.message || 'Verification email sent.' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to resend email';
      return { success: false, message };
    }
  };

  // Logout user via backend API
  const logout = async () => {
    try {
      await logoutUser();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.message);
      return { success: false, message: error.message };
    } finally {
      setUser(null);
    }
  };

  // Update local user state
  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    verifyAccountEmail,
    resendVerificationLink,
    logout,
    refreshUser: checkAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
