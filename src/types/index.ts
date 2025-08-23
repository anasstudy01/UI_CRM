import type { ReactNode } from 'react';

// AccountType for account type grids
export interface AccountType {
  id: string;
  name: string;
  markUp: string;
  commission: string;
  swap: string;
  ib: string;
  minDeposit: string;
}

// User type
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
  verified: boolean;
  twoFactorEnabled: boolean;
}

// Account type for user accounts
export interface Account {
  id: string;
  userId: string | number;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  leverage: string;
  status: string;
}

// Transaction type
export interface Transaction {
  id: string;
  userId: string | number;
  type: string;
  amount: number;
  currency: string;
  method?: string;
  status: string;
  date: string;
  fromAccount?: string;
  toAccount?: string;
}

// KYC Document type
export interface KycDocument {
  id: string;
  userId: string | number;
  documentType: string;
  status: string;
  uploadDate: string;
}

// IB Request type
export interface IBRequest {
  id: string;
  userId: string | number;
  companyName: string;
  contactPerson: string;
  status: string;
  submissionDate: string;
  email?: string;
  phone?: string;
  address?: string;
  experience?: string;
}

// Dashboard stats type
export interface DashboardStats {
  totalBalance: number;
  totalProfit: number;
  totalTrades: number;
  activeAccounts: number;
  monthlyGrowth: number;
}

// Position type
export interface Position {
  srNo: number;
  orderId: string;
  account: string;
  type: string;
  openPrice: number;
  symbol: string;
  volume: number;
  id: string;
}


//ib form data type
export interface IBFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
}

export interface AccountCreationFormData {
  platformType: string;
  accountVariant: string;
  accountType: string;
  currency: string;
  leverage: string;
  investorPassword: string;
  masterPassword: string;
  initialDeposit?: number;
}

export interface FundTransferFormData {
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  transferDate: string;
}


export interface KYCFormData {
  file: File | null;
  documentType: string;
  documentNumber: string;
  expiryDate: string;
  uploadDate: string;
}

export interface KYCDocument{
  id: string;
  userId: string | number;
  documentType: string;
  documentNumber: string;
  expiryDate: string;
  uploadDate: string;
  status: string;
}


export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  twoFactorEnabled ?: boolean;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}


export interface SidebarProps {
  onLogout: () => void;
}

export interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  responseTime: string;
}

export interface Message {
  id: string;
  ticketId: string;
  userId: string;
  departmentId?: string;
  sender: 'user' | 'agent';
  agentName?: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatTicket {
  id: string;
  userId: string;
  departmentId?: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastActivity: string;
  assignedAgent?: string;
}


export interface TradingPositionsProps {
  positions: Position[];
  closedPositions: Position[];
  showOpenPositions: boolean;
  setShowOpenPositions: (show: boolean) => void;
}

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
export interface OutletContext {
  isAuthenticated: boolean;
  handleLogin: (token: string) => void;
  handleSignup: (token: string) => void;
  handleLogout: () => void;
}
export interface DashboardLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}


export interface Department {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  responseTime: string;
}

export interface Ticket {
  id: string;
  userId: string;
  departmentId?: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  lastActivity: string;
  assignedAgent?: string;
}

export interface Message {
  id: string;
  ticketId: string;
  userId: string;
  departmentId?: string;
  sender: 'user' | 'agent';
  agentName?: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface DepositFormData{
  accountId: string;
  amount: number;
  method: 'bank' | 'usdt' | 'crypto' | undefined;
  currency: string;
  depositDate: string;
}

export interface DashboardLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

// Profile types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface ProfilePictureData {
  profilePicture: File | null;
}