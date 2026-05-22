import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../services/apiService.js";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("adminToken"));
    const [loading, setLoading] = useState(true);

    // ================= LOGIN =================
    const login = async (email, password) => {
        try {
            const response = await apiClient.post(`/api/auth/login`, {
                email,
                password,
                portal: "admin",
            });

            if (response.status === 200) {
                const { token, email, role } = response.data;

                setToken(token);
                setUser({ email, role });

                localStorage.setItem("adminToken", token);
                localStorage.setItem(
                    "adminUser",
                    JSON.stringify({ email, role })
                );

                return { success: true };
            }

            return {
                success: false,
                message: response.data?.message || "Login failed",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Login failed",
            };
        }
    };

    // ================= AUTH CHECK =================
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const isAdmin = () => {
        return user?.role === "ADMIN";
    };

    // ================= LOGOUT =================
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
    };

    // ================= LOAD SESSION =================
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("adminToken");
            const storedUser = localStorage.getItem("adminUser");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Error loading auth state:", err);
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
        } finally {
            setLoading(false);
        }
    }, []);

    // ================= CONTEXT =================
    const contextValue = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};