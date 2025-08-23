import{
  useState, useEffect,
  dashboardAPI,
  type DashboardStats, type Transaction, type Position,
  StatsGrid,
  TradingPerformanceChart,
  RecentTransactions,
  MarketTicker,
  TradingPositions,
  ReferEarn,
} from "../../index";

/**
 * Main Dashboard component displaying key metrics and recent activities
 * Implements data fetching and responsive layout
 */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [closedPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOpenPositions, setShowOpenPositions] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, transactionsData, positionsData] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentTransactions(),
          dashboardAPI.getPositions(),
        ]);
        setStats(statsData);
        setRecentTransactions(transactionsData);
        setPositions(positionsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingPerformanceChart stats={stats} />
        <RecentTransactions recentTransactions={recentTransactions} />
      </div>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Trading Positions and Refer & Earn Cards */}
      <div className="flex flex-col lg:flex-row gap-5 min-h-96">
        <div className="w-full lg:w-1/2">
          <TradingPositions
            positions={positions}
            closedPositions={closedPositions}
            showOpenPositions={showOpenPositions}
            setShowOpenPositions={setShowOpenPositions}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <ReferEarn />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
