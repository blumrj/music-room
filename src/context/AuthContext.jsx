import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import apiClient from "../api/ApiClient";
import useEditShortcut from "../hooks/useEditShortcut";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  const refreshAuth = useCallback(async () => {
    try {
      const { authenticated } = await apiClient.getSession();
      setIsAuthenticated(authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEditShortcut(setIsEditOpen);

  const login = async (email, password) => {
    await apiClient.login(email, password);
    await refreshAuth();
  };

  const logout = async () => {
    await apiClient.logout();
    setIsAuthenticated(false);
  };

  const value = {
    isEditOpen,
    closeEdit: () => setIsEditOpen(false),
    isAuthenticated,
    checked,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
