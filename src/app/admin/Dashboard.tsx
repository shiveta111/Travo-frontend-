import { TrendingUp, Plane, Package, AlertCircle, IndianRupee, Percent, ChevronRight, Bot } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  // Sparkline data
  const revenueSparkline = [
    { value: 6.2 }, { value: 6.8 }, { value: 7.1 }, { value: 6.9 }, { value: 7.5 }, { value: 8.1 }, { value: 8.4 }
  ];
  const conversionSparkline = [
    { value: 2.5 }, { value: 2.7 }, { value: 3.2 }, { value: 3.8 }, { value: 4.2 }, { value: 4.7 }, { value: 5.0 }
  ];
  const tripsSparkline = [
    { value: 28 }, { value: 30 }, { value: 29 }, { value: 31 }, { value: 30 }, { value: 32 }, { value: 32 }
  ];
  const marginSparkline = [
    { value: 15 }, { value: 16 }, { value: 16 }, { value: 17 }, { value: 17 }, { value: 18 }, { value: 18 }
  ];

  // Business performance chart data
  const performanceData = [
    { month: 'Oct', conversion: 2.5, aiImpact: false },
    { month: 'Nov', conversion: 2.7, aiImpact: false },
    { month: 'Dec', conversion: 3.2, aiImpact: true },
    { month: 'Jan', conversion: 3.8, aiImpact: true },
    { month: 'Feb', conversion: 4.2, aiImpact: true },
    { month: 'Mar', conversion: 4.7, aiImpact: true },
    { month: 'Apr', conversion: 5.0, aiImpact: true },
  ];

  return (
    <div className="space-y-5 max-h-screen p-4 md:p-0">
      {/* ROW 1 - KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Revenue MTD */}
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Revenue (MTD)</p>
              <p className="text-xl md:text-2xl mt-1">₹8.4L</p>
              <p className="text-xs text-green-600 mt-1">↑ +22%</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <IndianRupee className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={30}>
            <LineChart data={revenueSparkline}>
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Conversion Rate</p>
              <p className="text-xl md:text-2xl mt-1">5%</p>
              <p className="text-xs text-gray-400 mt-1">(was 2.5%)</p>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={30}>
            <LineChart data={conversionSparkline}>
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active Trips */}
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Active Trips</p>
              <p className="text-xl md:text-2xl mt-1">32</p>
              <p className="text-xs text-gray-400 mt-1">8 in Bali</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50">
              <Plane className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={30}>
            <LineChart data={tripsSparkline}>
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Health */}
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Bookings Health</p>
              <p className="text-base md:text-xl mt-1">128 Confirmed</p>
              <p className="text-xs text-orange-600 mt-1">⚠ 44 Initialized</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50">
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <div className="h-1 flex-1 bg-green-500 rounded"></div>
            <div className="h-1 flex-1 bg-green-500 rounded"></div>
            <div className="h-1 flex-1 bg-green-500 rounded"></div>
            <div className="h-1 w-8 bg-orange-400 rounded"></div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-red-100 border-l-4 border-l-red-500">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Pending Payments</p>
              <p className="text-xl md:text-2xl mt-1 text-red-600">₹1.26L</p>
              <p className="text-xs text-red-500 mt-1">🔴 Overdue</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <div className="h-1 flex-1 bg-red-500 rounded"></div>
            <div className="h-1 flex-1 bg-red-500 rounded"></div>
            <div className="h-1 flex-1 bg-red-400 rounded"></div>
            <div className="h-1 flex-1 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Avg Margin */}
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Avg Margin</p>
              <p className="text-xl md:text-2xl mt-1">18%</p>
              <p className="text-xs text-green-600 mt-1">↑ Improving</p>
            </div>
            <div className="p-2 rounded-lg bg-cyan-50">
              <Percent className="w-4 h-4 text-cyan-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={30}>
            <LineChart data={marginSparkline}>
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 2 - FOCUS + GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* LEFT - Business Performance Graph (70%) */}
        <div className="lg:col-span-7 bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="text-base md:text-lg">Business Performance</h3>
            <p className="text-xs text-gray-500 mt-1">Conversion growth with AI impact highlighted</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="conversion"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorConversion)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Conversion Rate (%)</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
              <Bot className="w-3 h-3 text-blue-600" />
              <span className="text-blue-700">AI Impact: 2.5% → 5%</span>
            </div>
          </div>
        </div>

        {/* RIGHT - AI Priority Alerts (30%) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-5 rounded-xl shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm md:text-base">Needs Attention Today</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-2 bg-white rounded-lg border-l-2 border-red-500">
              <span className="text-sm">🔴</span>
              <div>
                <p className="text-sm">₹84K overdue payment</p>
                <p className="text-xs text-gray-500">Agency Epsilon</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-white rounded-lg border-l-2 border-red-500">
              <span className="text-sm">🔴</span>
              <div>
                <p className="text-sm">3 check-ins in &lt;5 days</p>
                <p className="text-xs text-gray-500">Not confirmed</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-white rounded-lg border-l-2 border-orange-400">
              <span className="text-sm">⚠</span>
              <div>
                <p className="text-sm">44 bookings initialized</p>
                <p className="text-xs text-gray-500">Pending confirmation</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-white rounded-lg border-l-2 border-orange-400">
              <span className="text-sm">⚠</span>
              <div>
                <p className="text-sm">7 discrepancies found</p>
                <p className="text-xs text-gray-500">Inventory mismatch</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-white rounded-lg border-l-2 border-blue-400">
              <span className="text-sm">📞</span>
              <div>
                <p className="text-sm">Cold leads pending</p>
                <p className="text-xs text-gray-500">18 follow-ups due</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-white hover:bg-gray-50 text-sm py-2 px-4 rounded-lg border border-gray-200 flex items-center justify-center gap-2 transition-colors">
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ROW 3 - BUSINESS SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trips Snapshot */}
        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm md:text-base">Trips Snapshot</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl md:text-3xl text-blue-600">32</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl text-purple-600">18</p>
              <p className="text-xs text-gray-500 mt-1">Upcoming</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl text-green-600">284</p>
              <p className="text-xs text-gray-500 mt-1">Pax</p>
            </div>
          </div>
        </div>

        {/* Cashflow Mini View */}
        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="w-5 h-5 text-green-600" />
            <h3 className="text-sm md:text-base">Cashflow Mini View</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paid</span>
              <span className="text-sm text-green-600">₹3.4L 🟢</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '73%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm text-red-600">₹1.26L 🔴</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Due soon</span>
              <span className="text-sm text-orange-600">₹84K ⚠</span>
            </div>
          </div>
        </div>

        {/* Inventory Health */}
        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm md:text-base">Inventory Health</h3>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Load Factor</p>
            <p className="text-2xl md:text-3xl mb-3">80%</p>
            <div className="grid grid-cols-8 gap-1">
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-red-500 rounded"></div>
              <div className="h-8 bg-red-500 rounded"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">🔴 Red = critical departures</p>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP - AI Insight */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 md:p-4 rounded-xl border border-blue-100">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
            <Bot className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">AI Insight</p>
            <p className="text-xs md:text-sm">Conversions improving due to faster response time • Bali demand rising — lock inventory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
