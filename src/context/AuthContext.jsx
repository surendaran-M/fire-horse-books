import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("guestId");
    setUser(null);
    navigate("/login");
  };

  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: login, 
      logout, 
      loading, 
      isBuyer, 
      isSeller 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);