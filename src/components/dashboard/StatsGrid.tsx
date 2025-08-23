import React from 'react';
import { TrendingUp, DollarSign, Activity, Users } from 'lucide-react';
import Card from '../ui/Card';
import type { DashboardStats } from '../../types';

interface StatsGridProps {
  stats: DashboardStats | null;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats?.totalBalance.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Profit</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats?.totalProfit.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Trades</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalTrades.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="h-8 w-8 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Accounts</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.activeAccounts || "0"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsGrid;
