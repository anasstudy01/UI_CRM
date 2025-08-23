import React from 'react';
import { Rss } from 'lucide-react';
import TickerDisplay from '../ui/TickerDisplay';

const MarketTicker: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center py-3 shadow-lg rounded-lg gap-2 sm:gap-0">
      <div className="flex-shrink-0 px-3 hidden md:block">
        <Rss className="w-10 h-10 text-orange-600" />
      </div>
      <div className="w-full sm:flex-1 overflow-hidden">
        <TickerDisplay />
      </div>
    </div>
  );
};

export default MarketTicker;
