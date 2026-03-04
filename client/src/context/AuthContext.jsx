import React, { createContext, useContext, useState, useEffect } from "react";
import {
  registerApi,
  loginApi,
  logoutApi,
  getMeApi
} from "@/api/auth.api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //  Check auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMeApi();
        setUser(res.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      const res = await loginApi({ email, password });

      setUser(res.data.data.user);
      return true;

    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setIsLoading(true);

      const res = await registerApi({ name, email, password });

      setUser(res.data.data.user);
      return true;

    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch { }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};