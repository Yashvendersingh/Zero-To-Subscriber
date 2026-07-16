import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/api/v1/auth/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Listen to session expiry event
    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener("auth-expired", handleAuthExpired);
    
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    setUser(response.data.user);
    return response.data.user;
  };

  const signup = async (email, password, fullName) => {
    await api.post("/api/v1/auth/signup", {
      email,
      password,
      full_name: fullName,
    });
    // Auto login after signup
    return await login(email, password);
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/api/v1/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
