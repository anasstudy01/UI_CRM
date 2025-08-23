import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../ui/Card';
import type { Transaction } from '../../types';

interface RecentTransactionsProps {
  recentTransactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ recentTransactions }) => {
  return (
    <Card title="Recent Transactions" subtitle="Latest account activity">
      <div className="space-y-1">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-1 border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-lg p-2 transition-all duration-200"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "Deposit"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "Deposit" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.method}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${
                    transaction.type === "Deposit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "Deposit" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
                </p>
                <p
                  className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {transaction.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No recent transactions
          </p>
        )}
      </div>
    </Card>
  );
};

export default RecentTransactions;
