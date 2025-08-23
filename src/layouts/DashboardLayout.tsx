import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileSidebar from '../components/layout/MobileSidebar';
import  type{ DashboardLayoutProps } from '../types/index';




/**
 * Main dashboard layout component
 * Provides consistent sidebar, header, and content area structure
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/live-accounts': 'Live Accounts',
      '/trading-account': 'Trading Account Creation',
      '/kyc': 'KYC Verification',
      '/deposits': 'Deposits',
      '/internal-transfer': 'Internal Transfer',
      '/ib-request': 'IB Request',
      '/2fa': 'Two Factor Authentication',
    };
    return titleMap[path] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <Sidebar onLogout={onLogout} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          title={getPageTitle()}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
