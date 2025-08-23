import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Main App component that handles authentication state
 * Provides authentication context to child components
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  /**
   * Handle user login
   * @param token - Authentication token
   */
  const handleLogin = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  /**
   * Handle user signup
   * @param token - Authentication token
   */
  const handleSignup = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If authenticated and on login/signup page, redirect to dashboard
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet context={{ 
        isAuthenticated, 
        handleLogin, 
        handleSignup, 
        handleLogout 
      }} />
    </div>
  );
}

export default App;
