import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Settings, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { accountsAPI } from '../services/api';
import type { Account } from '../types';

/**
 * Manage Account page component
 * Allows users to view, edit, and manage their trading accounts
 */
const MyAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountsAPI.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    return type === 'Live' ? (
      <TrendingUp className="h-5 w-5 text-green-600" />
    ) : (
      <Settings className="h-5 w-5 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold leading-6 text-gray-900">My Accounts</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          View and manage your trading accounts, modify settings, and monitor account performance.
        </p>
      </div>

      {/* Account Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Account Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getAccountTypeIcon(account.accountType)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {account.accountNumber}
                    </h3>
                    <p className="text-sm text-gray-500">{account.accountType} Account</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    account.status
                  )}`}
                >
                  {account.status}
                </span>
              </div>

              {/* Account Details */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Balance</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${account.balance.toLocaleString()} {account.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Leverage</p>
                    <p className="text-lg font-semibold text-gray-900">{account.leverage}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Currency</p>
                  <p className="text-sm text-gray-900">{account.currency}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={account.status !== 'Active'}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={account.status === 'Active'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

   

      {/* Empty State */}
      {accounts.length === 0 && !loading && (
        <Card className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any trading accounts yet. Create your first account to get started.
          </p>
          <div className="mt-6">
            <Button>Create Account</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyAccounts;
