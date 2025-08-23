import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AccountType } from '../types';

const AccountTypeGrid: React.FC = () => {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/data/db.json')
      .then((res) => res.json())
      .then((data) => setAccountTypes(data.accountTypes || []));
  }, []);

  return (
    <div className="">
            {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold leading-6 text-gray-900">Manage Accounts</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          View and manage your trading accounts, modify settings, and monitor account performance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mt-6">
        {accountTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-lg  p-6 flex flex-col items-center hover:transform hover:scale-105 transition-transform shadow-lg ">
            <div className="flex items-center w-full mb-4">
              <img src="/src/assets/mt5logo.png" alt="Kantara" className="w-12 h-12 mr-4" />
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-semibold mb-0">{type.name}</h2>
                {type.markUp === 'Zero Spread Account' && (
                  <span className="text-green-600 text-xs font-bold leading-tight">Zero Spread Account</span>
                )}
              </div>
            </div>
            <div className="w-full mb-4">
              <div className="flex justify-between text-sm mb-1"><span>Mark up:</span><span>{type.markUp}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Commission:</span><span>{type.commission}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Swap:</span><span>{type.swap}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>IB:</span><span>{type.ib}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Min Deposit:</span><span>{type.minDeposit}</span></div>
            </div>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold mt-auto"
              onClick={() => navigate('/dashboard/trading-account')}
            >
              Open Account
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountTypeGrid;
