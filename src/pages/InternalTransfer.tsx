import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowRightLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { accountsAPI, transactionsAPI } from '../services/api';
import type { Account, FundTransferFormData } from '../types';

/**
 * Internal Transfer page component
 * Allows users to transfer funds between their accounts
 */
const InternalTransfer: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch user accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountsAPI.getAccounts();
        setAccounts(data);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  // Validation schema for transfer form
  const validationSchema = Yup.object({
    fromAccount: Yup.string().required('From account is required'),
    toAccount: Yup.string()
      .required('To account is required')
      .test('different-accounts', 'From and To accounts must be different', function(value) {
        return value !== this.parent.fromAccount;
      }),
    amount: Yup.number()
      .positive('Amount must be positive')
      .test('sufficient-balance', 'Insufficient balance', function(value) {
        const fromAccount = accounts.find(acc => acc.accountNumber === this.parent.fromAccount);
        return !fromAccount || !value || value <= fromAccount.balance;
      })
      .required('Amount is required'),
  });

  // Form handling with Formik
  const formik = useFormik<FundTransferFormData>({
    initialValues: {
      fromAccount: '',
      toAccount: '',
      amount: 0,
      currency: 'USD',
      transferDate: new Date().toISOString().split('T')[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await transactionsAPI.createTransfer({
          ...values,
          userId: 1,
        });
        setSuccess(true);
        formik.resetForm();
      } catch (error) {
        console.error('Failed to create transfer:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Get account balance
  const getAccountBalance = (accountNumber: string) => {
    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    return account ? account.balance : 0;
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Completed!</h2>
            <p className="text-gray-600 mb-6">
              Your funds have been successfully transferred between accounts.
            </p>
            <Button onClick={() => setSuccess(false)}>
              Make Another Transfer
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Internal Transfer</h1>
        <p className="text-gray-600">Transfer funds between your trading accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Form */}
        <Card title="Transfer Funds" subtitle="Move money between your accounts">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Account <span className="text-red-500">*</span>
              </label>
              <select
                name="fromAccount"
                value={formik.values.fromAccount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - {account.accountType} (${account.balance.toLocaleString()})
                  </option>
                ))}
              </select>
              {formik.touched.fromAccount && formik.errors.fromAccount && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.fromAccount}</p>
              )}
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Account <span className="text-red-500">*</span>
              </label>
              <select
                name="toAccount"
                value={formik.values.toAccount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select account</option>
                {accounts
                  .filter(account => account.accountNumber !== formik.values.fromAccount)
                  .map((account) => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountNumber} - {account.accountType} (${account.balance.toLocaleString()})
                    </option>
                  ))}
              </select>
              {formik.touched.toAccount && formik.errors.toAccount && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.toAccount}</p>
              )}
            </div>

            {/* Amount */}
            <Input
              label="Transfer Amount"
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formik.values.amount || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.amount && formik.errors.amount ? formik.errors.amount : undefined}
              required
            />

            {/* Available Balance */}
            {formik.values.fromAccount && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Available Balance: ${getAccountBalance(formik.values.fromAccount).toLocaleString()}
                </p>
              </div>
            )}

            {/* Transfer Preview */}
            {formik.values.fromAccount && formik.values.toAccount && formik.values.amount > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Transfer Preview:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{formik.values.fromAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{formik.values.toAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-green-600">
                      ${formik.values.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Fee:</span>
                    <span className="font-medium">Free</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting ? 'Processing Transfer...' : 'Transfer Funds'}
            </Button>
          </form>
        </Card>

        {/* Account Overview */}
        <Card title="Account Overview" subtitle="Your available trading accounts">
          <div className="space-y-4">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div key={account.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {account.accountNumber}
                      </h3>
                      <p className="text-xs text-gray-500">{account.accountType} Account</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Balance:</span>
                      <span className="font-medium">
                        ${account.balance.toLocaleString()} {account.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Leverage:</span>
                      <span className="font-medium">{account.leverage}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <ArrowRightLeft className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No accounts available</p>
              </div>
            )}
          </div>

          {/* Transfer Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Transfer Information:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Transfers are processed instantly</li>
              <li>• No fees for internal transfers</li>
              <li>• Available 24/7</li>
              <li>• Minimum transfer: $10</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Recent Transfers */}
      <Card title="Recent Transfers" subtitle="Your latest internal transfers">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <ArrowRightLeft className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">AMB001 → AMB002</p>
                <p className="text-xs text-gray-500">Aug 10, 2025 - 14:30</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">$2,500</p>
              <p className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded-full">
                Completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <ArrowRightLeft className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">AMB002 → AMB001</p>
                <p className="text-xs text-gray-500">Aug 09, 2025 - 10:15</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">$1,000</p>
              <p className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded-full">
                Completed
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InternalTransfer;
