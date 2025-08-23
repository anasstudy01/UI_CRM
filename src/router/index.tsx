import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import LoginPageWrapper from '../components/LoginPageWrapper';
import SignupPageWrapper from '../components/SignupPageWrapper';
import DashboardLayoutWrapper from '../components/DashboardLayoutWrapper';
import Dashboard from '../pages/Dashboard';
import LiveAccounts from '../pages/LiveAccounts';
import TradingAccountCreation from '../pages/TradingAccountCreation';
import KYCVerification from '../pages/KYCVerification';
import Deposits from '../pages/Deposits';
import InternalTransfer from '../pages/InternalTransfer';
import IBRequest from '../pages/IBRequest';
import TwoFactorAuth from '../pages/TwoFactorAuth';
import MyAccounts from '../pages/MyAccount';
import ManageAccounts from '../pages/ManageAccounts';
import Support from '../pages/Support';
import CreateTicket from '../pages/CreateTicket';
import AdminSupport from '../pages/AdminSupport';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: <LoginPageWrapper />,
      },
      {
        path: 'signup',
        element: <SignupPageWrapper />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayoutWrapper />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'live-accounts',
            element: <LiveAccounts />,
          },
          {
            path: 'my-accounts',
            element: <MyAccounts />,
          },
          {
            path: 'manage-accounts',
            element: <ManageAccounts />,
          },
          {
            path: 'trading-account',
            element: <TradingAccountCreation />,
          },
          {
            path: 'kyc',
            element: <KYCVerification />,
          },
          {
            path: 'deposits',
            element: <Deposits />,
          },
          {
            path: 'internal-transfer',
            element: <InternalTransfer />,
          },
          {
            path: 'ib-request',
            element: <IBRequest />,
          },
          {
            path: '2fa',
            element: <TwoFactorAuth />,
          },
          {
            path: 'support',
            element: <Support />,
          },
          {
            path: 'support/create-ticket',
            element: <CreateTicket />,
          },
        ],
      },
      {
        path: 'admin',
        element: <DashboardLayoutWrapper />, // You might want a separate admin layout
        children: [
          {
            path: 'support',
            element: <AdminSupport />,
          },
        ],
      },
    ],
  },
]);
