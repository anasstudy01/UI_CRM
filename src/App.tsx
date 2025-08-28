import { Outlet } from "react-router-dom";

/**
 * Main App component - Pure UI routing without authentication
 * Simplified to handle only routing and layout
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

export default App;
