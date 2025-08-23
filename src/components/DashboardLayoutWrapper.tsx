import React from 'react';
import { useOutletContext, Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import type{OutletContext} from '../types/index'


const DashboardLayoutWrapper: React.FC = () => {
  const { handleLogout } = useOutletContext<OutletContext>();

  return (
    <DashboardLayout onLogout={handleLogout}>
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardLayoutWrapper;
