import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('algo_vision_auth');
    return storedAuth === null ? true : storedAuth === 'true';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('algo_vision_user');
    return saved ? JSON.parse(saved) : { name: 'Student', email: 'student@algovision.io' };
  });

  const login = (email, password) => {
    const userObj = { email, name: email ? email.split('@')[0] : 'Student' };
    setIsAuthenticated(true);
    setUser(userObj);
    localStorage.setItem('algo_vision_auth', 'true');
    localStorage.setItem('algo_vision_user', JSON.stringify(userObj));
    return true;
  };

  const register = (name, email, password) => {
    const userObj = { email: email || 'student@algovision.io', name: name || 'Student' };
    setIsAuthenticated(true);
    setUser(userObj);
    localStorage.setItem('algo_vision_auth', 'true');
    localStorage.setItem('algo_vision_user', JSON.stringify(userObj));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.setItem('algo_vision_auth', 'false');
    localStorage.removeItem('algo_vision_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
