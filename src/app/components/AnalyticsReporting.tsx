import { useState } from 'react';
import {
  TrendingUp, DollarSign, Package, Users, Calendar,
  CheckCircle, AlertCircle, CreditCard, PieChart
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface TripData {
  tripId: string;
  tripName: string;
  guest: string;
  dates: string;
  pax: number;
  cost: number;
  sellingPrice: number;
  margin: number;
  status: 'CONFIRMED' | 'IN PROGRESS' | 'QUOTED' | 'PENDING' | 'PAID';
  paymentStatus: 'PAID' | 'PAYMENT PENDING' | 'PENDING';
}

interface BookingStatusData {
  status: string;
  count: number;
  color: string;
}

interface MarginTrendData {
  month: string;
  margin: number;
}

export function AnalyticsReporting() {
  const trips: TripData[] = [
    {
      tripId: '#TR-0842',
      tripName: 'Bali 7N - Group',
      guest: 'Ravi Mehta',
      dates: 'Apr 8–15',
      pax: 28,
      cost: 84000,
      sellingPrice: 840000,
      margin: 20,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      tripId: '#TR-0841',
      tripName: 'Ubud Retreat 5N',
      guest: 'Kirana Dewi',
      dates: 'Apr 9–14',
      pax: 2,
      cost: 64000,
      sellingPrice: 78000,
      margin: 18,
      status: 'IN PROGRESS',
      paymentStatus: 'PAYMENT PENDING',
    },
    {
      tripId: '#TR-0838',
      tripName: 'Seminyak Family 10N',
      guest: 'Singh Family',
      dates: 'Apr 11–21',
      pax: 5,
      cost: 220000,
      sellingPrice: 280000,
      margin: 21,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      tripId: '#TR-0835',
      tripName: 'Bali Honeymoon 7N',
      guest: 'Gupta Couple',
      dates: 'Apr 14–21',
      pax: 2,
      cost: 88000,
      sellingPrice: 110000,
      margin: 20,
      status: 'QUOTED',
      paymentStatus: 'PENDING',
    },
    {
      tripId: '#TR-0856',
      tripName: 'Seminyak Beach 6N',
      guest: 'Priya Sharma',
      dates: 'Apr 12–18',
      pax: 4,
      cost: 45000,
      sellingPrice: 58000,
      margin: 22,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      tripId: '#TR-0871',
      tripName: 'Nusa Dua Luxury 8N',
      guest: 'Anjali Desai',
      dates: 'Apr 15–23',
      pax: 15,
      cost: 125000,
      sellingPrice: 160000,
      margin: 22,
      status: 'CONFIRMED',
      paymentStatus: 'PAYMENT PENDING',
    },
  ];

  // Calculate summary stats
  const totalBookings = trips.length;
  const initializedCount = 44;
  const confirmedCount = 128;
  const paidCount = 96;
  const discrepanciesCount = 7;

  const totalCost = trips.reduce((sum, trip) => sum + trip.cost, 0);
  const totalRevenue = trips.reduce((sum, trip) => sum + trip.sellingPrice, 0);
  const averageMargin = trips.reduce((sum, trip) => sum + trip.margin, 0) / trips.length;

  const paidTrips = trips.filter(t => t.paymentStatus === 'PAID').length;
  const pendingPayments = trips.filter(t => t.paymentStatus !== 'PAID').length;

  // Revenue comparison data for bar chart
  const revenueComparisonData = trips.map(trip => ({
    name: trip.tripId,
    Cost: trip.cost / 1000,
    'Selling Price': trip.sellingPrice / 1000,
  }));

  // Booking status data for pie chart
  const bookingStatusData: BookingStatusData[] = [
    { status: 'Initialized', count: initializedCount, color: '#3b82f6' },
    { status: 'Confirmed', count: confirmedCount, color: '#22c55e' },
    { status: 'Paid', count: paidCount, color: '#10b981' },
    { status: 'Discrepancies', count: discrepanciesCount, color: '#ef4444' },
  ];

  // Margin trend data for line chart
  const marginTrendData: MarginTrendData[] = [
    { month: 'Jan', margin: 18 },
    { month: 'Feb', margin: 19 },
    { month: 'Mar', margin: 20 },
    { month: 'Apr', margin: 21 },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-600 text-white';
      case 'PAYMENT PENDING':
        return 'bg-orange-600 text-white';
      case 'PENDING':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getTripStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'IN PROGRESS':
        return 'bg-blue-600 text-white';
      case 'QUOTED':
        return 'bg-purple-600 text-white';
      case 'PAID':
        return 'bg-green-700 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-1">Analytics & Reporting</h2>
        <p className="text-sm text-muted-foreground">Comprehensive insights and metrics</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{totalBookings}</p>
          <p className="text-xs text-green-600">Active trips</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">
            {formatCurrency(totalCost)}
          </p>
          <p className="text-xs text-muted-foreground">Supplier costs</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-green-600">Selling price</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Margin</p>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">
            {averageMargin.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Profit margin</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending Payments</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{pendingPayments}</p>
          <p className="text-xs text-red-600">Action required</p>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Initialized</p>
              <p className="text-2xl font-semibold text-foreground">{initializedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-semibold text-foreground">{confirmedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-semibold text-foreground">{paidCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Discrepancies</p>
              <p className="text-2xl font-semibold text-foreground">{discrepanciesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Revenue Comparison Chart */}
        <div className="bg-white p-6 rounded-lg border border-border">
          <h3 className="text-foreground mb-4">Revenue Comparison</h3>
          <p className="text-sm text-muted-foreground mb-4">Cost vs Selling Price by Trip</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueComparisonData}>
              <CartesianGrid key="bar-grid" strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis key="bar-xaxis" dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis key="bar-yaxis" tick={{ fontSize: 12 }} label={{ value: '₹ (in thousands)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
              <Tooltip
                key="bar-tooltip"
                formatter={(value: number) => [`₹${value}K`, '']}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend key="bar-legend" wrapperStyle={{ fontSize: 12 }} />
              <Bar key="cost-bar" dataKey="Cost" fill="#f97316" name="Cost" />
              <Bar key="selling-bar" dataKey="Selling Price" fill="#22c55e" name="Selling Price" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg border border-border">
          <h3 className="text-foreground mb-4">Booking Status Overview</h3>
          <p className="text-sm text-muted-foreground mb-4">Distribution by Status</p>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                key="status-pie"
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.status}: ${entry.count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {bookingStatusData.map((entry) => (
                  <Cell key={`cell-${entry.status}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="pie-tooltip" contentStyle={{ fontSize: 12 }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Margin Trend Chart */}
      <div className="bg-white p-6 rounded-lg border border-border mb-6">
        <h3 className="text-foreground mb-4">Margin Trend</h3>
        <p className="text-sm text-muted-foreground mb-4">Average Margin % Over Time</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={marginTrendData}>
            <CartesianGrid key="line-grid" strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis key="line-xaxis" dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis key="line-yaxis" tick={{ fontSize: 12 }} label={{ value: 'Margin %', angle: -90, position: 'insideLeft', fontSize: 12 }} />
            <Tooltip
              key="line-tooltip"
              formatter={(value: number) => [`${value}%`, 'Margin']}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend key="line-legend" wrapperStyle={{ fontSize: 12 }} />
            <Line
              key="margin-line"
              type="monotone"
              dataKey="margin"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Margin %"
              dot={{ fill: '#8b5cf6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Overview Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-foreground mb-1">Payment Overview</h3>
          <p className="text-sm text-muted-foreground">Detailed trip and payment information</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sidebar-accent">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Trip ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Trip Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-foreground uppercase tracking-wider">
                  Pax
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-foreground uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-foreground uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-foreground uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {trips.map((trip, index) => (
                <tr key={index} className="hover:bg-sidebar-accent transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {trip.tripId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {trip.tripName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {trip.guest}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {trip.dates}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-foreground">
                    {trip.pax}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground">
                    {formatCurrency(trip.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground">
                    {formatCurrency(trip.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                      {trip.margin}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getTripStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getPaymentStatusColor(trip.paymentStatus)}`}>
                      {trip.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
