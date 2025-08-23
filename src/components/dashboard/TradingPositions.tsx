import React from 'react';
import type { TradingPositionsProps } from '../../types';



const TradingPositions: React.FC<TradingPositionsProps> = ({
  positions,
  closedPositions,
  showOpenPositions,
  setShowOpenPositions,
}) => {
  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        {/* Custom Header with Title and Toggle Buttons */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trading Positions</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your trading positions</p>
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                showOpenPositions
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setShowOpenPositions(true)}
            >
              Open ({positions.length})
            </button>
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                !showOpenPositions
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setShowOpenPositions(false)}
            >
              Closed ({closedPositions.length})
            </button>
          </div>
        </div>
        
        {/* Card Content with Scroll */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Sr No.</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Order ID</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Account</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">
                    {showOpenPositions ? "Open Price" : "Close Price"}
                  </th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Symbol</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Volume</th>
                </tr>
              </thead>
              <tbody>
                {showOpenPositions ? (
                  positions.length > 0 ? (
                    positions.map((pos) => (
                      <tr key={pos.orderId} className="">
                        <td className="px-2 py-2">{pos.srNo}</td>
                        <td className="px-2 py-2">{pos.orderId}</td>
                        <td className="px-2 py-2">{pos.account}</td>
                        <td className="px-2 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pos.type === "Buy"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {pos.type}
                          </span>
                        </td>
                        <td className="px-2 py-2">{pos.openPrice}</td>
                        <td className="px-2 py-2 font-bold">{pos.symbol}</td>
                        <td className="px-2 py-2">{pos.volume}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-2 py-4 text-center text-gray-500">
                        No open positions
                      </td>
                    </tr>
                  )
                ) : closedPositions.length > 0 ? (
                  closedPositions.map((pos) => (
                    <tr key={`closed-${pos.orderId}`} className="">
                      <td className="px-2 py-2">{pos.srNo}</td>
                      <td className="px-2 py-2">{pos.orderId}</td>
                      <td className="px-2 py-2">{pos.account}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pos.type === "Buy"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pos.type}
                        </span>
                      </td>
                      <td className="px-2 py-2">{pos.openPrice}</td>
                      <td className="px-2 py-2 font-bold">{pos.symbol}</td>
                      <td className="px-2 py-2">{pos.volume}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-2 py-4 text-center text-gray-500">
                      No closed positions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer outside scroll area */}
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600 flex-shrink-0">
            <span>
              Showing{" "}
              {showOpenPositions ? positions.length : closedPositions.length}{" "}
              {showOpenPositions ? "open" : "closed"} positions
            </span>
            {showOpenPositions && (
              <span>
                Total:{" "}
                <span className="font-bold text-lg text-gray-900">
                  $12,345.67
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPositions;
