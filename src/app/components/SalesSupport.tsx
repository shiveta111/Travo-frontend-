import { Clock, AlertTriangle, CheckCircle, User, Edit3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Query {
  id: number;
  customer: string;
  query: string;
  assignedTo: string;
  receivedTime: string;
  elapsedMinutes: number;
  amendmentCount: number;
  status: 'Safe' | 'Warning' | 'Breach';
  value: number;
  priority: 'High' | 'Medium' | 'Low';
}

export function SalesSupport() {
  const [queries, setQueries] = useState<Query[]>([
    {
      id: 1,
      customer: 'Patel Family',
      query: 'Bali package for 4 - Need itinerary details',
      assignedTo: 'Rajesh K',
      receivedTime: '2026-04-07 09:45:00',
      elapsedMinutes: 15,
      amendmentCount: 0,
      status: 'Safe',
      value: 240000,
      priority: 'Medium',
    },
    {
      id: 2,
      customer: 'TechCorp HR',
      query: 'Team outing quote - 25 pax Goa',
      assignedTo: 'Amit S',
      receivedTime: '2026-04-07 06:15:00',
      elapsedMinutes: 225,
      amendmentCount: 2,
      status: 'Warning',
      value: 500000,
      priority: 'High',
    },
    {
      id: 3,
      customer: 'Sharma Wedding',
      query: 'Vietnam honeymoon customization',
      assignedTo: 'Priya M',
      receivedTime: '2026-04-06 10:00:00',
      elapsedMinutes: 1440,
      amendmentCount: 5,
      status: 'Breach',
      value: 180000,
      priority: 'High',
    },
    {
      id: 4,
      customer: 'Reddy Family',
      query: 'Discount request for 12 pax booking',
      assignedTo: 'Rajesh K',
      receivedTime: '2026-04-07 08:30:00',
      elapsedMinutes: 90,
      amendmentCount: 1,
      status: 'Safe',
      value: 680000,
      priority: 'High',
    },
    {
      id: 5,
      customer: 'Khan Family',
      query: 'Payment link not working - urgent',
      assignedTo: 'Neha P',
      receivedTime: '2026-04-07 05:00:00',
      elapsedMinutes: 300,
      amendmentCount: 3,
      status: 'Warning',
      value: 450000,
      priority: 'High',
    },
    {
      id: 6,
      customer: 'Desai Group',
      query: 'Flight time change request',
      assignedTo: 'Amit S',
      receivedTime: '2026-04-06 09:00:00',
      elapsedMinutes: 1500,
      amendmentCount: 7,
      status: 'Breach',
      value: 280000,
      priority: 'Medium',
    },
  ]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
  };

  const getTimerColor = (status: string) => {
    switch (status) {
      case 'Safe':
        return 'text-green-600 bg-green-50 border-green-300';
      case 'Warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-300';
      case 'Breach':
        return 'text-red-600 bg-red-50 border-red-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Safe':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Warning':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Breach':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const safeQueries = queries.filter(q => q.status === 'Safe').length;
  const warningQueries = queries.filter(q => q.status === 'Warning').length;
  const breachedQueries = queries.filter(q => q.status === 'Breach').length;
  const avgResponseTime = Math.round(queries.reduce((sum, q) => sum + q.elapsedMinutes, 0) / queries.length);
  const atRiskValue = queries.filter(q => q.status === 'Breach').reduce((sum, q) => sum + q.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4">
          <h2 className="mb-2">Sales Support - TAT Tracker</h2>
          <p className="text-sm text-accent italic">"Where your conversion game is won or lost"</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Active Queries</p>
                <p className="text-2xl text-foreground mt-1">{queries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-green-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Safe (On Time)</p>
                <p className="text-2xl text-foreground mt-1">{safeQueries}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-yellow-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Warning</p>
                <p className="text-2xl text-foreground mt-1">{warningQueries}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-red-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">System Red (Breach)</p>
                <p className="text-2xl text-foreground mt-1">{breachedQueries}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">At Risk Value</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(atRiskValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TAT Guidelines */}
        <div className="bg-muted/30 p-4 rounded-lg border border-border mb-6">
          <h4 className="text-sm text-foreground mb-3">TAT Performance Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <div className="text-xs">
                <p className="text-foreground">Safe Zone</p>
                <p className="text-muted-foreground">0-4 hours response time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <div className="text-xs">
                <p className="text-foreground">Warning Zone</p>
                <p className="text-muted-foreground">4-12 hours response time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div className="text-xs">
                <p className="text-foreground">Breach (System Red)</p>
                <p className="text-muted-foreground">12+ hours - Immediate action required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Queries Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Query</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Assigned Executive</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">TAT Timer</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Amendment Count</th>
                  <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Value</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queries.sort((a, b) => {
                  if (a.status === 'Breach' && b.status !== 'Breach') return -1;
                  if (a.status !== 'Breach' && b.status === 'Breach') return 1;
                  if (a.status === 'Warning' && b.status === 'Safe') return -1;
                  if (a.status === 'Safe' && b.status === 'Warning') return 1;
                  return b.elapsedMinutes - a.elapsedMinutes;
                }).map((query) => (
                  <tr key={query.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(query.status)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{query.customer}</td>
                    <td className="px-4 py-4 text-sm max-w-xs">
                      <p className="line-clamp-2">{query.query}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{query.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded border ${getTimerColor(query.status)}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-mono">{formatTime(query.elapsedMinutes)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <Edit3 className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-sm ${query.amendmentCount > 3 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                          {query.amendmentCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-right whitespace-nowrap">{formatCurrency(query.value)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        query.priority === 'High' ? 'bg-red-100 text-red-700' :
                        query.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {query.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-5 rounded-lg border border-border">
            <h4 className="text-sm text-muted-foreground mb-2">Avg Response Time</h4>
            <p className="text-2xl text-foreground">{formatTime(avgResponseTime)}</p>
            <p className="text-xs text-muted-foreground mt-1">Target: Under 4 hours</p>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <h4 className="text-sm text-muted-foreground mb-2">Breach Rate</h4>
            <p className="text-2xl text-red-600">{((breachedQueries / queries.length) * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Target: Below 10%</p>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <h4 className="text-sm text-muted-foreground mb-2">High Amendment Queries</h4>
            <p className="text-2xl text-orange-600">{queries.filter(q => q.amendmentCount > 3).length}</p>
            <p className="text-xs text-muted-foreground mt-1">Queries with 3+ amendments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
