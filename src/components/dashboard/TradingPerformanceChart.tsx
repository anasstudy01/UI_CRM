import React from 'react';
import { TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import type { DashboardStats } from '../../types';

interface TradingPerformanceChartProps {
  stats: DashboardStats | null;
}

const TradingPerformanceChart: React.FC<TradingPerformanceChartProps> = ({ stats }) => {
  return (
    <Card title="Trading Performance" subtitle="Monthly growth overview">
      <div className="h-64 relative bg-gradient-to-br from-green-50 to-white rounded-lg overflow-hidden">
        {/* Chart Container */}
        <div className="absolute h-full w-full inset-4">
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Grid Background */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="25"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 25"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
              </pattern>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient
                id="areaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Y-axis labels */}
            <text x="15" y="25" className="text-xs fill-gray-500" fontSize="10">20%</text>
            <text x="15" y="60" className="text-xs fill-gray-500" fontSize="10">15%</text>
            <text x="15" y="95" className="text-xs fill-gray-500" fontSize="10">10%</text>
            <text x="15" y="130" className="text-xs fill-gray-500" fontSize="10">5%</text>
            <text x="15" y="165" className="text-xs fill-gray-500" fontSize="10">0%</text>

            {/* X-axis labels */}
            <text x="50" y="185" className="text-xs fill-gray-500" fontSize="10">Jan</text>
            <text x="90" y="185" className="text-xs fill-gray-500" fontSize="10">Feb</text>
            <text x="130" y="185" className="text-xs fill-gray-500" fontSize="10">Mar</text>
            <text x="170" y="185" className="text-xs fill-gray-500" fontSize="10">Apr</text>
            <text x="210" y="185" className="text-xs fill-gray-500" fontSize="10">May</text>
            <text x="250" y="185" className="text-xs fill-gray-500" fontSize="10">Jun</text>

            {/* Area under curve */}
            <path
              d="M 45 145 L 85 125 L 125 105 L 165 85 L 205 75 L 245 60 L 285 45 L 285 165 L 45 165 Z"
              fill="url(#areaGradient)"
              className="fade-in-up"
            />

            {/* Main chart line */}
            <path
              d="M 45 145 L 85 125 L 125 105 L 165 85 L 205 75 L 245 60 L 285 45"
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chart-line"
              strokeDasharray="1000"
            />

            {/* Data points */}
            <circle cx="45" cy="145" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" className="chart-point" />
            <circle cx="85" cy="125" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" className="chart-point" />
            <circle cx="125" cy="105" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" className="chart-point" />
            <circle cx="165" cy="85" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" className="chart-point" />
            <circle cx="205" cy="75" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" className="chart-point" />
            <circle cx="245" cy="60" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" className="chart-point" />
            <circle cx="285" cy="45" r="5" fill="#059669" stroke="#fff" strokeWidth="2" className="chart-point" />
          </svg>
        </div>

        {/* Current Value Display - Top Right */}
        <div className="absolute top-3 right-3 text-right bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm fade-in-up">
          <div className="flex items-center justify-end space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              +{stats?.monthlyGrowth || 12.5}%
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Monthly Growth</p>
          <p className="text-xs text-green-600 font-medium">
            ↗ +2.3% vs last month
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TradingPerformanceChart;
