import { Phone, AlertCircle, TrendingUp, Filter, DollarSign, Clock, Users, Calendar } from 'lucide-react';
import { useState } from 'react';

export function CreditControlDashboard() {
  const [filters, setFilters] = useState({
    region: '',
    salesOwner: '',
    creditStatus: '',
    overdueBucket: '',
  });

  const agencies = [
    {
      id: 1,
      agency: 'Agency Alpha',
      city: 'Ahmedabad',
      salesOwner: 'Manish',
      outstanding: 350000,
      bucket_0_15: 150000,
      bucket_16_30: 100000,
      bucket_31_45: 50000,
      bucket_45_plus: 50000,
      creditLimit: 400000,
      usedPercent: 88,
      lastPayment: '29-Mar-2026',
      nextExpected: '08-Apr-2026',
      status: 'Red',
      action: 'Escalate',
      disputeFlag: false,
      remarks: 'High exposure',
    },
    {
      id: 2,
      agency: 'Agency Beta',
      city: 'Surat',
      salesOwner: 'Aditya',
      outstanding: 120000,
      bucket_0_15: 120000,
      bucket_16_30: 0,
      bucket_31_45: 0,
      bucket_45_plus: 0,
      creditLimit: 250000,
      usedPercent: 48,
      lastPayment: '01-Apr-2026',
      nextExpected: '10-Apr-2026',
      status: 'Green',
      action: 'Monitor',
      disputeFlag: false,
      remarks: 'Healthy',
    },
    {
      id: 3,
      agency: 'Agency Gamma',
      city: 'Baroda',
      salesOwner: 'Aditya',
      outstanding: 480000,
      bucket_0_15: 100000,
      bucket_16_30: 150000,
      bucket_31_45: 80000,
      bucket_45_plus: 150000,
      creditLimit: 350000,
      usedPercent: 137,
      lastPayment: '20-Mar-2026',
      nextExpected: '05-Apr-2026',
      status: 'Red',
      action: 'Block Credit',
      disputeFlag: true,
      remarks: 'Needs founder attention',
    },
    {
      id: 4,
      agency: 'Agency Delta',
      city: 'Rajkot',
      salesOwner: 'New Hire',
      outstanding: 90000,
      bucket_0_15: 40000,
      bucket_16_30: 50000,
      bucket_31_45: 0,
      bucket_45_plus: 0,
      creditLimit: 150000,
      usedPercent: 60,
      lastPayment: '31-Mar-2026',
      nextExpected: '11-Apr-2026',
      status: 'Green',
      action: 'Monitor',
      disputeFlag: false,
      remarks: 'On track',
    },
    {
      id: 5,
      agency: 'Agency Epsilon',
      city: 'Ahmedabad',
      salesOwner: 'Manish',
      outstanding: 600000,
      bucket_0_15: 180000,
      bucket_16_30: 170000,
      bucket_31_45: 100000,
      bucket_45_plus: 150000,
      creditLimit: 500000,
      usedPercent: 120,
      lastPayment: '18-Mar-2026',
      nextExpected: '04-Apr-2026',
      status: 'Red',
      action: 'Block Credit',
      disputeFlag: true,
      remarks: 'Breach risk',
    },
    {
      id: 6,
      agency: 'Agency Zeta',
      city: 'Surat',
      salesOwner: 'Aditya',
      outstanding: 220000,
      bucket_0_15: 120000,
      bucket_16_30: 100000,
      bucket_31_45: 0,
      bucket_45_plus: 0,
      creditLimit: 250000,
      usedPercent: 88,
      lastPayment: '27-Mar-2026',
      nextExpected: '09-Apr-2026',
      status: 'Yellow',
      action: 'Call Today',
      disputeFlag: false,
      remarks: 'Follow up',
    },
  ];

  const collectionCalls = [
    { agency: 'Agency Epsilon', amount: 600000, priority: 'High', time: '10:00 AM' },
    { agency: 'Agency Gamma', amount: 480000, priority: 'High', time: '11:00 AM' },
    { agency: 'Agency Alpha', amount: 350000, priority: 'Medium', time: '2:00 PM' },
  ];

  const accountsToBlock = [
    { agency: 'Agency Epsilon', overdue: 150000, days: '45+ days' },
    { agency: 'Agency Gamma', overdue: 150000, days: '45+ days' },
  ];

  const escalations = [
    { agency: 'Agency Gamma', issue: 'Credit limit breach - dispute', assignedTo: 'Founder' },
    { agency: 'Agency Epsilon', issue: 'Breach risk - dispute', assignedTo: 'Founder' },
    { agency: 'Agency Alpha', issue: 'High exposure escalation', assignedTo: 'Manager' },
  ];

  const expectedInflow = [
    { date: 'Apr 4', amount: 600000, agencies: 'Agency Epsilon' },
    { date: 'Apr 5', amount: 480000, agencies: 'Agency Gamma' },
    { date: 'Apr 8', amount: 350000, agencies: 'Agency Alpha' },
    { date: 'Apr 9', amount: 220000, agencies: 'Agency Zeta' },
    { date: 'Apr 10', amount: 120000, agencies: 'Agency Beta' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Green':
        return 'bg-green-600 text-white';
      case 'Yellow':
        return 'bg-yellow-600 text-white';
      case 'Red':
        return 'bg-red-600 text-white';
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
        <h2 className="mb-6">Credit Control Dashboard</h2>

        {/* KPI Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Receivable</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(1860000)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Due This Week</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(1860000)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Overdue 45+</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(350000)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-red-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Red Accounts</p>
                <p className="text-2xl text-foreground mt-1">3</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Expected 7D Inflow</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(1770000)}</p>
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
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            >
              <option value="">All Regions</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.salesOwner}
              onChange={(e) => setFilters({ ...filters, salesOwner: e.target.value })}
            >
              <option value="">All Sales Owners</option>
              <option value="manish">Manish</option>
              <option value="aditya">Aditya</option>
              <option value="newhire">New Hire</option>
            </select>
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.creditStatus}
              onChange={(e) => setFilters({ ...filters, creditStatus: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
            </select>
            <select
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
              value={filters.overdueBucket}
              onChange={(e) => setFilters({ ...filters, overdueBucket: e.target.value })}
            >
              <option value="">All Overdue</option>
              <option value="0-15">0-15 days</option>
              <option value="16-30">16-30 days</option>
              <option value="31-45">31-45 days</option>
              <option value="45+">45+ days</option>
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
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Agency</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">City</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Sales Owner</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Outstanding</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">0-15</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">16-30</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">31-45</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">45+</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Credit Limit</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Used %</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Last Payment</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Next Expected</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Action</th>
                    <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Dispute</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm">{agency.agency}</td>
                      <td className="px-4 py-3 text-sm">{agency.city}</td>
                      <td className="px-4 py-3 text-sm">{agency.salesOwner}</td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(agency.outstanding)}</td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(agency.bucket_0_15)}</td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                        {agency.bucket_16_30 > 0 ? formatCurrency(agency.bucket_16_30) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                        <span className={agency.bucket_31_45 > 0 ? 'text-orange-600' : ''}>
                          {agency.bucket_31_45 > 0 ? formatCurrency(agency.bucket_31_45) : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                        <span className={agency.bucket_45_plus > 0 ? 'text-red-600' : ''}>
                          {agency.bucket_45_plus > 0 ? formatCurrency(agency.bucket_45_plus) : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(agency.creditLimit)}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                agency.usedPercent > 100 ? 'bg-red-600' :
                                agency.usedPercent > 80 ? 'bg-yellow-600' :
                                'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(agency.usedPercent, 100)}%` }}
                            ></div>
                          </div>
                          <span className={agency.usedPercent > 100 ? 'text-red-600' : ''}>{agency.usedPercent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{agency.lastPayment}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span className={agency.nextExpected === 'Overdue' ? 'text-red-600' : ''}>
                          {agency.nextExpected}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(agency.status)}`}>
                          {agency.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{agency.action}</td>
                      <td className="px-4 py-3 text-center">
                        {agency.disputeFlag && <AlertCircle className="w-4 h-4 text-red-500 mx-auto" />}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{agency.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Collection Calls */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-primary" />
                <h4 className="text-sm text-foreground">Today's Collection Calls</h4>
              </div>
              <div className="space-y-2">
                {collectionCalls.map((call, idx) => (
                  <div key={idx} className="p-2 bg-primary/5 rounded border border-primary/20">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm text-foreground">{call.agency}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${call.priority === 'High' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {call.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-accent">{formatCurrency(call.amount)}</span>
                      <span className="text-muted-foreground">{call.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accounts to Block */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-accent" />
                <h4 className="text-sm text-foreground">Accounts to Block</h4>
              </div>
              <div className="space-y-2">
                {accountsToBlock.map((account, idx) => (
                  <div key={idx} className="p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-sm text-foreground mb-1">{account.agency}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-600">{formatCurrency(account.overdue)}</span>
                      <span className="text-muted-foreground">{account.days}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escalations */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <h4 className="text-sm text-foreground">Escalations</h4>
              </div>
              <div className="space-y-2">
                {escalations.map((escalation, idx) => (
                  <div key={idx} className="p-2 bg-secondary/5 rounded">
                    <p className="text-sm text-foreground mb-1">{escalation.agency}</p>
                    <p className="text-xs text-muted-foreground mb-1">{escalation.issue}</p>
                    <span className="text-xs text-secondary">→ {escalation.assignedTo}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Inflow */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h4 className="text-sm text-foreground mb-3">Expected Inflow This Week</h4>
              <div className="space-y-2">
                {expectedInflow.map((inflow, idx) => (
                  <div key={idx} className="p-2 bg-green-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-foreground">{inflow.date}</span>
                      <span className="text-sm text-green-600">{formatCurrency(inflow.amount)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{inflow.agencies}</p>
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
