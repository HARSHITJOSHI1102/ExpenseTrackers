import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      logout();
    }

    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setCurrentUser(user);
      setIsAuthenticated(true);

      return user;
    } catch (err) {
      const message = err?.response?.data?.msg || err.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const res = await axios.post('/auth/register', {
        name,
        email: email.toLowerCase().trim(),
        password,
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.msg || err.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];

    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/auth/request-otp', {
        email: email.toLowerCase().trim(),
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.msg || 'Failed to send OTP';
      throw new Error(message);
    }
  };

  const verifyOtp = async ({ email, otp }) => {
    try {
      const res = await axios.post('/auth/verify-otp', {
        email: email.toLowerCase().trim(),
        otp,
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.msg || 'OTP verification failed';
      throw new Error(message);
    }
  };

  const resetPassword = async ({ email, otp, newPassword }) => {
    try {
      const res = await axios.post('/auth/reset-password', {
        email: email.toLowerCase().trim(),
        otp,
        newPassword,
      });

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.msg || 'Password reset failed';
      throw new Error(message);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// code