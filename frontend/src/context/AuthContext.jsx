import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const SESSION_TIMEOUT = 4 * 60 * 60 * 1000;
  const ACTIVITY_CHECK_INTERVAL = 60 * 1000;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    if (token && savedUser) {
      if (loginTime) {
        const currentTime = new Date().getTime();
        const timePassed = currentTime - parseInt(loginTime);

        if (timePassed > SESSION_TIMEOUT) {
          logout();
          console.log("Session expired - auto logout");
        } else {
          setUser(JSON.parse(savedUser));

          const remainingTime = SESSION_TIMEOUT - timePassed;
          setupAutoLogout(remainingTime);
        }
      } else {
        localStorage.setItem("loginTime", new Date().getTime().toString());
        setUser(JSON.parse(savedUser));
        setupAutoLogout(SESSION_TIMEOUT);
      }
    }
    setLoading(false);
  }, []);

  const setupAutoLogout = (timeout) => {
    if (window.autoLogoutTimer) {
      clearTimeout(window.autoLogoutTimer);
    }

    window.autoLogoutTimer = setTimeout(() => {
      console.log("4 hours elapsed - logging out");
      logout();

      if (window.location.pathname !== "/login") {
        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
      }
    }, timeout);
  };

  useEffect(() => {
    let lastActivityTime = new Date().getTime();
    let activityCheckInterval;

    const resetTimer = () => {
      const currentTime = new Date().getTime();
      const loginTime = localStorage.getItem("loginTime");

      if (loginTime && user) {
        const timeSinceLogin = currentTime - parseInt(loginTime);

        if (timeSinceLogin < SESSION_TIMEOUT) {
          lastActivityTime = currentTime;

          localStorage.setItem("loginTime", currentTime.toString());
          setupAutoLogout(SESSION_TIMEOUT);
        }
      }
    };

    const checkInactivity = () => {
      const currentTime = new Date().getTime();
      const loginTime = localStorage.getItem("loginTime");

      if (loginTime && user) {
        const timeSinceLogin = currentTime - parseInt(loginTime);

        if (timeSinceLogin >= SESSION_TIMEOUT) {
          console.log("Inactivity timeout - logging out");
          logout();
          if (window.location.pathname !== "/login") {
            alert(
              "Your session has expired due to inactivity. Please login again."
            );
            window.location.href = "/login";
          }
        }
      }
    };

    if (user) {
      const activityEvents = ["mousedown", "keypress", "scroll", "touchstart"];

      activityEvents.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });

      activityCheckInterval = setInterval(
        checkInactivity,
        ACTIVITY_CHECK_INTERVAL
      );

      return () => {
        activityEvents.forEach((event) => {
          window.removeEventListener(event, resetTimer);
        });
        if (activityCheckInterval) {
          clearInterval(activityCheckInterval);
        }
      };
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("loginTime", new Date().getTime().toString());

      setUser(user);

      setupAutoLogout(SESSION_TIMEOUT);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("loginTime", new Date().getTime().toString());

      setUser(user);

      setupAutoLogout(SESSION_TIMEOUT);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    if (window.autoLogoutTimer) {
      clearTimeout(window.autoLogoutTimer);
      window.autoLogoutTimer = null;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");

    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const getRemainingSessionTime = () => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime && user) {
      const currentTime = new Date().getTime();
      const timePassed = currentTime - parseInt(loginTime);
      const remainingTime = SESSION_TIMEOUT - timePassed;

      if (remainingTime > 0) {
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        return `${hours}h ${minutes}m`;
      }
    }
    return null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isEmployer: user?.role === "employer",
    isJobSeeker: user?.role === "jobseeker",
    getRemainingSessionTime,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
