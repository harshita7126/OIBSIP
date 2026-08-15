import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, ADMIN_ROLES } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth initialization error', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password, role = null) => {
    const { user: loggedInUser } = await authService.login(email, password, role);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const registeredUser = data?.user || data;
    if (registeredUser && registeredUser.isVerified !== false && !data?.requiresVerification) {
      setUser(registeredUser);
    }
    return data;
  };

  const verifyEmail = async (email, code) => {
    const result = await authService.verifyEmail(email, code);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    return updated;
  };

  const isAdmin = ['owner', 'manager', 'kitchen', 'support', 'admin'].includes(user?.role);

  const getRoleConfig = () => {
    if (!user || !user.role) return null;
    const roleKey = Object.keys(ADMIN_ROLES).find(
      key => ADMIN_ROLES[key].id === user.role
    );
    return roleKey ? ADMIN_ROLES[roleKey] : null;
  };

  const isRouteAllowed = (pathname) => {
    if (!pathname.startsWith('/admin')) return true;
    if (pathname === '/admin/login') return true;
    if (!isAdmin) return false;
    
    const roleConfig = getRoleConfig();
    if (!roleConfig) {
      // Default admin fallback allows /admin
      return pathname === '/admin' || pathname === '/admin/';
    }

    return roleConfig.allowedPaths.some(p => {
      if (p === '/admin') return pathname === '/admin' || pathname === '/admin/';
      return pathname.startsWith(p);
    });
  };

  const getDefaultAdminRoute = () => {
    const config = getRoleConfig();
    return config?.defaultPath || '/admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        role: user?.role,
        roleConfig: getRoleConfig(),
        loading,
        login,
        register,
        verifyEmail,
        logout,
        updateProfile,
        isRouteAllowed,
        getDefaultAdminRoute
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
