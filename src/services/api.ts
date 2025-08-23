import axios from 'axios';
import type { 
  User, 
  Account, 
  Transaction, 
  KYCDocument, 
  IBRequest
} from '../types';// Base URL for JSON server
const BASE_URL = 'http://localhost:3001';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Login user with email and password
   */
  login: async (email: string, password: string) => {
    const response = await api.get('/users');
    const user = response.data.find((u: User) => u.email === email && u.password === password);
    if (user) {
      return { token: 'demo-token-' + user.id, user };
    }
    throw new Error('Invalid credentials');
  },

  /**
   * Register new user
   */
  signup: async (userData: { name: string; email: string; password: string }) => {
    // Check if user already exists
    const existingUsers = await api.get('/users');
    const userExists = existingUsers.data.find((u: User) => u.email === userData.email);
    
    if (userExists) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      balance: 0,
      verified: false,
      twoFactorEnabled: false
    };

    const response = await api.post('/users', newUser);
    return { token: 'demo-token-' + newUser.id, user: response.data };
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get('/users/1');
    return response.data;
  },
};

/**
 * Dashboard API calls
 */
export const dashboardAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const response = await api.get('/dashboardStats');
    return response.data;
  },

  /**
   * Get recent transactions
   */
  getRecentTransactions: async () => {
    const response = await api.get('/transactions?_limit=5&_sort=date&_order=desc');
    return response.data;
  },

  /**
   * Get trading positions
   */
  getPositions: async () => {
    const response = await api.get('/positions');
    return response.data;
  },
};

/**
 * Accounts API calls
 */
export const accountsAPI = {
  /**
   * Get user accounts
   */
  getAccounts: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },

  /**
   * Create new trading account
   */
  createAccount: async (accountData: Partial<Account>) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },
};

/**
 * Transactions API calls
 */
export const transactionsAPI = {
  /**
   * Get all transactions
   */
  getTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  /**
   * Create deposit request
   */
  createDeposit: async (depositData: Partial<Transaction>) => {
    const response = await api.post('/transactions', {
      ...depositData,
      type: 'Deposit',
      status: 'Processing',
      date: new Date().toISOString(),
    });
    return response.data;
  },

  /**
   * Create internal transfer
   */
  createTransfer: async (transferData: Partial<Transaction>) => {
    const response = await api.post('/transactions', {
      ...transferData,
      type: 'Transfer',
      status: 'Completed',
      date: new Date().toISOString(),
    });
    return response.data;
  },
};

/**
 * KYC API calls
 */
export const kycAPI = {
  /**
   * Get KYC documents
   */
  getDocuments: async () => {
    const response = await api.get('/kycDocuments');
    return response.data;
  },

  /**
   * Upload KYC document
   */
  uploadDocument: async (documentData: Partial<KYCDocument>) => {
    const response = await api.post('/kycDocuments', {
      ...documentData,
      uploadDate: new Date().toISOString(),
      status: 'pending',
    });
    return response.data;
  },
};

/**
 * IB Request API calls
 */
export const ibAPI = {
  /**
   * Get IB requests
   */
  getRequests: async () => {
    const response = await api.get('/ibRequests');
    return response.data;
  },

  /**
   * Submit IB request
   */
  submitRequest: async (requestData: Partial<IBRequest>) => {
    const response = await api.post('/ibRequests', {
      ...requestData,
      submissionDate: new Date().toISOString(),
      status: 'Under Review',
    });
    return response.data;
  },
};

export default api;
