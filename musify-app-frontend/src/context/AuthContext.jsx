import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// SAFE fallback (VERY IMPORTANT for deployment)
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("userToken"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");
        const storedUser = localStorage.getItem("userData");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // ================= REGISTER =================
    const register = async (email, password) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                { email, password }
            );

            if (response.status === 200) {
                return {
                    success: true,
                    message: "Registration successful",
                };
            }

            return {
                success: false,
                message: response.data?.message || "Registration failed",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Network error. Please try again later.",
            };
        }
    };

    // ================= LOGIN =================
    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/login`,
                {
                    email,
                    password,
                    portal: "user",
                }
            );

            if (response.status === 200) {
                const { token, email: userEmail, role } = response.data;

                setToken(token);
                setUser({ email: userEmail, role });

                localStorage.setItem("userToken", token);
                localStorage.setItem(
                    "userData",
                    JSON.stringify({ email: userEmail, role })
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
                    "Network error. Please try again later.",
            };
        }
    };

    // ================= AUTH =================
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
    };

    const getAuthHeaders = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    return (
        <AuthContext.Provider
            value={{
                register,
                login,
                isAuthenticated,
                loading,
                logout,
                user,
                token,
                getAuthHeaders,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};