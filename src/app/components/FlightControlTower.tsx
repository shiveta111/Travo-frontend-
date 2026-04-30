import { AlertTriangle, TrendingUp, Calendar as CalendarIcon, Filter, Armchair, Users, DollarSign } from 'lucide-react';
import { useState } from 'react';

export function FlightControlTower() {
  const [filters, setFilters] = useState({
    dateRange: '',
    airline: '',
    city: '',
    status: '',
    action: '',
  });

  const flights = [
    {
      id: 1,
      departureDate: '16-Apr-2026',
      sector: 'BOM-BALI',
      airline: 'SQ',
      city: 'Mumbai',
      seatsBlocked: 30,
      seatsSold: 18,
      seatsAvailable: 12,
      loadPercent: 60,
      avgSellingPrice: 59999,
      totalRevenue: 1079982,
      airlineCost: 1150000,
      exposure: 460000,
      daysToDeparture: 13,
      pipeline: 9,
      cityContribution: 3800,
      status: 'Yellow',
      recommendedAction: 'Push Distribution',
      finalDecision: 'Hold',
      owner: 'Mumbai Team',
      remarks: '',
    },
    {
      id: 2,
      departureDate: '19-Apr-2026',
      sector: 'BOM-BALI',
      airline: 'SQ',
      city: 'Mumbai',
      seatsBlocked: 30,
      seatsSold: 12,
      seatsAvailable: 18,
      loadPercent: 40,
      avgSellingPrice: 59999,
      totalRevenue: 719988,
      airlineCost: 1150000,
      exposure: 690000,
      daysToDeparture: 16,
      pipeline: 8,
      cityContribution: 3200,
      status: 'Yellow',
      recommendedAction: 'Push Distribution',
      finalDecision: 'Hold',
      owner: 'Mumbai Team',
      remarks: '',
    },
    {
      id: 3,
      departureDate: '22-Apr-2026',
      sector: 'CCU-BALI',
      airline: 'SQ',
      city: 'Kolkata',
      seatsBlocked: 20,
      seatsSold: 3,
      seatsAvailable: 17,
      loadPercent: 15,
      avgSellingPrice: 58500,
      totalRevenue: 175500,
      airlineCost: 780000,
      exposure: 663000,
      daysToDeparture: 19,
      pipeline: 2,
      cityContribution: 600,
      status: 'Red',
      recommendedAction: 'Discount Support',
      finalDecision: 'Hold',
      owner: 'East Team',
      remarks: '',
    },
    {
      id: 4,
      departureDate: '08-May-2026',
      sector: 'AMD-VIETNAM',
      airline: 'VJ',
      city: 'Ahmedabad',
      seatsBlocked: 40,
      seatsSold: 4,
      seatsAvailable: 36,
      loadPercent: 10,
      avgSellingPrice: 115000,
      totalRevenue: 460000,
      airlineCost: 3200000,
      exposure: 2880000,
      daysToDeparture: 35,
      pipeline: 5,
      cityContribution: 1200,
      status: 'Red',
      recommendedAction: 'Discount Support',
      finalDecision: 'Hold',
      owner: 'Gujarat Team',
      remarks: '',
    },
    {
      id: 5,
      departureDate: '15-May-2026',
      sector: 'DEL-BALI',
      airline: 'SQ',
      city: 'Delhi',
      seatsBlocked: 30,
      seatsSold: 9,
      seatsAvailable: 21,
      loadPercent: 30,
      avgSellingPrice: 61999,
      totalRevenue: 557991,
      airlineCost: 1180000,
      exposure: 826000,
      daysToDeparture: 42,
      pipeline: 6,
      cityContribution: 2800,
      status: 'Red',
      recommendedAction: 'Discount Support',
      finalDecision: 'Hold',
      owner: 'Delhi Team',
      remarks: '',
    },
    {
      id: 6,
      departureDate: '24-May-2026',
      sector: 'LKO-BALI',
      airline: 'AirAsia',
      city: 'Lucknow',
      seatsBlocked: 25,
      seatsSold: 7,
      seatsAvailable: 18,
      loadPercent: 28,
      avgSellingPrice: 54999,
      totalRevenue: 384993,
      airlineCost: 900000,
      exposure: 648000,
      daysToDeparture: 51,
      pipeline: 4,
      cityContribution: 1600,
      status: 'Red',
      recommendedAction: 'Discount Support',
      finalDecision: 'Hold',
      owner: 'UP Team',
      remarks: '',
    },
    {
      id: 7,
      departureDate: '05-Jun-2026',
      sector: 'AMD-BALI',
      airline: 'VJ',
      city: 'Ahmedabad',
      seatsBlocked: 35,
      seatsSold: 15,
      seatsAvailable: 20,
      loadPercent: 43,
      avgSellingPrice: 62500,
      totalRevenue: 937500,
      airlineCost: 2450000,
      exposure: 1400000,
      daysToDeparture: 63,
      pipeline: 10,
      cityContribution: 3400,
      status: 'Yellow',
      recommendedAction: 'Push Distribution',
      finalDecision: 'Hold',
      owner: 'Gujarat Team',
      remarks: '',
    },
    {
      id: 8,
      departureDate: '18-Jun-2026',
      sector: 'BOM-VIETNAM',
      airline: 'Batik',
      city: 'Mumbai',
      seatsBlocked: 40,
      seatsSold: 10,
      seatsAvailable: 30,
      loadPercent: 25,
      avgSellingPrice: 105000,
      totalRevenue: 1050000,
      airlineCost: 2800000,
      exposure: 2100000,
      daysToDeparture: 76,
      pipeline: 7,
      cityContribution: 2400,
      status: 'Red',
      recommendedAction: 'Discount Support',
      finalDecision: 'Hold',
      owner: 'Mumbai Team',
      remarks: '',
    },
  ];

  const riskDepartures = [
    { sector: 'AMD-VIETNAM', date: '08-May', exposure: 2880000, load: '10%' },
    { sector: 'BOM-VIETNAM', date: '18-Jun', exposure: 2100000, load: '25%' },
    { sector: 'AMD-BALI', date: '05-Jun', exposure: 1400000, load: '43%' },
    { sector: 'DEL-BALI', date: '15-May', exposure: 826000, load: '30%' },
    { sector: 'BOM-BALI', date: '19-Apr', exposure: 690000, load: '40%' },
  ];

  const upcomingAlerts = [
    { type: 'D-15', sector: 'BOM-BALI', date: '16-Apr', action: 'Review seat strategy' },
    { type: 'D-15', sector: 'BOM-BALI', date: '19-Apr', action: 'Final decision due' },
    { type: 'D-21', sector: 'AMD-VIETNAM', date: '08-May', action: 'Discount campaign launch' },
  ];

  const paymentCommitments = [
    { airline: 'SQ', amount: 4260000, dueDate: '30-Apr-2026', status: 'Pending' },
    { airline: 'VJ', amount: 5650000, dueDate: '15-May-2026', status: 'Pending' },
    { airline: 'AirAsia', amount: 900000, dueDate: '20-May-2026', status: 'Confirmed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Red':
        return 'bg-red-600 text-white';
      case 'Yellow':
        return 'bg-yellow-600 text-white';
      case 'Green':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-6">Flight Control Tower</h2>

        {/* KPI Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Armchair className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Seats Blocked</p>
                <p className="text-2xl text-foreground mt-1">250</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Seats Sold</p>
                <p className="text-2xl text-foreground mt-1">78</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Overall Load</p>
                <p className="text-2xl text-foreground mt-1">31%</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Exposure at Risk</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(7117000)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-red-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Red Departures</p>
                <p className="text-2xl text-foreground mt-1">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-card p-4 rounded-lg border border-border mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            <input
              type="date"
              placeholder="Date Range"
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            />
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.airline}
              onChange={(e) => setFilters({ ...filters, airline: e.target.value })}
            >
              <option value="">All Airlines</option>
              <option value="sq">SQ</option>
              <option value="vj">VJ</option>
              <option value="airasia">AirAsia</option>
              <option value="batik">Batik</option>
            </select>
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">All Cities</option>
              <option value="mumbai">Mumbai</option>
              <option value="kolkata">Kolkata</option>
              <option value="ahmedabad">Ahmedabad</option>
              <option value="delhi">Delhi</option>
              <option value="lucknow">Lucknow</option>
            </select>
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
            </select>
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              <option value="">All Actions</option>
              <option value="discount">Discount Support</option>
              <option value="push">Push Distribution</option>
              <option value="monitor">Monitor</option>
            </select>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-3 bg-card rounded-lg border border-border overflow-hidden">
<div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase whitespace-nowrap">Departure Date</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Sector</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Airline</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">City</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Seats Blocked</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Seats Sold</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Seats Avail</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Load %</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Avg Price</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Total Revenue</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Airline Cost</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Exposure</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">Days to Dep</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Pipeline</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase whitespace-nowrap">City %</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase whitespace-nowrap">Recommended Action</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase whitespace-nowrap">Final Decision</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Owner</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {flights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{flight.departureDate}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{flight.sector}</td>
                      <td className="px-4 py-3 text-sm">{flight.airline}</td>
                      <td className="px-4 py-3 text-sm">{flight.city}</td>
                      <td className="px-4 py-3 text-sm text-right">{flight.seatsBlocked}</td>
                      <td className="px-4 py-3 text-sm text-right">{flight.seatsSold}</td>
                      <td className="px-4 py-3 text-sm text-right">{flight.seatsAvailable}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          flight.loadPercent < 30 ? 'bg-red-600 text-white' :
                          flight.loadPercent < 50 ? 'bg-yellow-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {flight.loadPercent}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(flight.avgSellingPrice)}</td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(flight.totalRevenue)}</td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(flight.airlineCost)}</td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                        <span className={flight.exposure > 1000000 ? 'text-red-600' : flight.exposure > 500000 ? 'text-yellow-600' : ''}>
                          {formatCurrency(flight.exposure)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className={`px-2 py-1 rounded text-xs ${flight.daysToDeparture <= 15 ? 'bg-red-100 text-red-700' : flight.daysToDeparture <= 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                          {flight.daysToDeparture}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">{flight.pipeline}</td>
                      <td className="px-4 py-3 text-sm text-right">{flight.cityContribution}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{flight.recommendedAction}</td>
                      <td className="px-4 py-3 text-sm">{flight.finalDecision}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{flight.owner}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{flight.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Top Risk Departures */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent" />
                <h4 className="text-sm text-foreground">Top Risk Departures</h4>
              </div>
              <div className="space-y-2">
                {riskDepartures.map((departure, idx) => (
                  <div key={idx} className="p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm text-foreground">{departure.sector}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-red-600 text-white">{departure.load}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{departure.date}</span>
                      <span className="text-red-600">{formatCurrency(departure.exposure)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming D-21/D-15 Alerts */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-secondary" />
                <h4 className="text-sm text-foreground">Upcoming D-21/D-15 Alerts</h4>
              </div>
              <div className="space-y-2">
                {upcomingAlerts.map((alert, idx) => (
                  <div key={idx} className="p-2 bg-yellow-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-600 text-white">{alert.type}</span>
                      <span className="text-sm text-foreground">{alert.sector}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{alert.date}</p>
                    <p className="text-xs text-secondary">{alert.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Airline Payment Commitments */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-primary" />
                <h4 className="text-sm text-foreground">Airline Payment Commitments</h4>
              </div>
              <div className="space-y-2">
                {paymentCommitments.map((payment, idx) => (
                  <div key={idx} className={`p-2 rounded ${
                    payment.status === 'Pending' ? 'bg-yellow-50' : 'bg-green-50'
                  }`}>
                    <p className="text-sm text-foreground mb-1">{payment.airline}</p>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className={payment.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}>
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className="text-muted-foreground">{payment.dueDate}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      payment.status === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
