// =============================================================================
// MAIN BARREL FILE - Central Export Hub
// =============================================================================
// This file serves as the single source of truth for all imports/exports
// Replace all existing index files with this comprehensive barrel file

// =============================================================================
// REACT & CORE DEPENDENCIES
// =============================================================================
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
} from 'react';

// =============================================================================
// ROUTING
// =============================================================================
export {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
  Link,
} from 'react-router-dom';

// =============================================================================
// FORM HANDLING & VALIDATION
// =============================================================================
export { useFormik } from 'formik';
export * as Yup from 'yup';

// =============================================================================
// ICONS - Lucide React (Primary)
// =============================================================================
export {
  // Navigation & Layout
  Menu,
  X,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,

  // Financial & Trading
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,

  // User & Account
  Users,
  UserIcon,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,

  // Status & Feedback
  CheckCircle,
  XCircle,
  Clock,
  Shield,

  // Forms & Input
  Mail,
  Lock,
  Upload,
  FileText,

  // Business & Communication
  Building,
  Phone,
  MapPin,
  Briefcase,

  // Security & Verification
  Key,
  QrCode,
  Copy,
  Smartphone,

  // Media & Content
  Rss,

  // Additional UI Icons
  CheckSquare,
  Square,
} from 'lucide-react';

// =============================================================================
// ICONS - React Icons (Social Media)
// =============================================================================
export {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';

// =============================================================================
// UI COMPONENTS
// =============================================================================
export { default as Button } from './src/components/ui/Button';
export { default as Card } from './src/components/ui/Card';
export { default as Input } from './src/components/ui/Input';
export { default as TickerDisplay } from './src/components/ui/TickerDisplay';

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================
export { default as Header } from './src/components/layout/Header';
export { default as Sidebar } from './src/components/layout/Sidebar';
export { default as MobileSidebar } from './src/components/layout/MobileSidebar';
export { default as DashboardLayout } from './src/layouts/DashboardLayout';

// =============================================================================
// DASHBOARD COMPONENTS
// =============================================================================
export { default as StatsGrid } from './src/components/dashboard/StatsGrid';
export { default as TradingPerformanceChart } from './src/components/dashboard/TradingPerformanceChart';
export { default as RecentTransactions } from './src/components/dashboard/RecentTransactions';
export { default as MarketTicker } from './src/components/dashboard/MarketTicker';
export { default as TradingPositions } from './src/components/dashboard/TradingPositions';
export { default as ReferEarn } from './src/components/dashboard/ReferEarn';

// =============================================================================
// PAGE COMPONENTS
// =============================================================================
export { default as Dashboard } from './src/pages/Dashboard';
export { default as LoginPage } from './src/pages/LoginPage';
export { default as SignupPage } from './src/pages/SignupPage';
export { default as LiveAccounts } from './src/pages/LiveAccounts';
export { default as TradingAccountCreation } from './src/pages/TradingAccountCreation';
export { default as ManageAccount } from './src/pages/MyAccount';
export { default as KYCVerification } from './src/pages/KYCVerification';
export { default as Deposits } from './src/pages/Deposits';
export { default as InternalTransfer } from './src/pages/InternalTransfer';
export type { default as IBRequestPage } from './src/pages/IBRequest';
export { default as TwoFactorAuth } from './src/pages/TwoFactorAuth';

// =============================================================================
// API SERVICES
// =============================================================================
export {
  authAPI,
  dashboardAPI,
  accountsAPI,
  transactionsAPI,
  kycAPI,
  ibAPI,
} from './src/services/api';

// =============================================================================
// UTILITIES
// =============================================================================
export { cn } from './src/utils/cn';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================
export type {
  // User & Authentication
  User as UserType,
  LoginFormData,
  SignupFormData,

  // Account & Trading
  Account,
  Position,
  Transaction,
  DashboardStats,

  // Forms

  AccountCreationFormData,
  KYCFormData,
  IBFormData,

  // Documents & Verification
  KYCDocument,
  IBRequest as IBRequestType,
} from './src/types';

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
BEFORE (Multiple imports - 8+ lines):
import React, { useState, useEffect } from 'react';
import { Plus, Eye, Settings, CheckCircle } from 'lucide-react';
import { FaTwitter, FaFacebook } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { accountsAPI } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Account } from '../types';

AFTER (Single barrel import - 1 line):
import {
  useState, useEffect,
  Plus, Eye, Settings, CheckCircle,
  FaTwitter, FaFacebook,
  Card, Button,
  accountsAPI,
  useFormik, Yup,
  Account
} from './index';
*/

// =============================================================================
// MAINTENANCE GUIDELINES
// =============================================================================

/*
📋 How to maintain this barrel file:

1. ADD NEW EXPORTS:
   - Add new components/utilities as they're created
   - Keep grouped by category
   - Maintain alphabetical order within groups

2. REMOVE UNUSED EXPORTS:
   - Regularly audit for unused exports
   - Use tree-shaking to eliminate dead code

3. PERFORMANCE:
   - Monitor bundle size impact
   - Consider code splitting for heavy components
   - Use dynamic imports for rarely used items

4. ORGANIZATION:
   - Keep exports grouped by type/purpose
   - Update examples when adding new patterns
   - Document any breaking changes
*/
