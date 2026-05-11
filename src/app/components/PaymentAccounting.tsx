import { DollarSign, TrendingUp, AlertTriangle, Clock, FileText, ArrowDown, ArrowRight, CheckCircle, Users, Calendar, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PaymentAccounting() {
  const cashFlowData = [
    { week: 'Week 1', projected: 420000, actual: 380000 },
    { week: 'Week 2', projected: 560000, actual: 520000 },
    { week: 'Week 3', projected: 680000, actual: 0 },
    { week: 'Week 4', projected: 450000, actual: 0 },
  ];

  const invoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2026-001',
      client: 'Agency Epsilon',
      amount: 600000,
      dueDate: '04-Apr-2026',
      status: 'Overdue',
      daysOverdue: 3,
      agingBucket: '45+',
      risk: 'High',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2026-002',
      client: 'Agency Gamma',
      amount: 480000,
      dueDate: '05-Apr-2026',
      status: 'Overdue',
      daysOverdue: 2,
      agingBucket: '45+',
      risk: 'High',
    },
    {
      id: 3,
      invoiceNumber: 'INV-2026-003',
      client: 'Agency Alpha',
      amount: 350000,
      dueDate: '08-Apr-2026',
      status: 'Due Soon',
      daysOverdue: 0,
      agingBucket: '31-45',
      risk: 'Medium',
    },
    {
      id: 4,
      invoiceNumber: 'INV-2026-004',
      client: 'Agency Zeta',
      amount: 220000,
      dueDate: '09-Apr-2026',
      status: 'Pending',
      daysOverdue: 0,
      agingBucket: '16-30',
      risk: 'Low',
    },
    {
      id: 5,
      invoiceNumber: 'INV-2026-005',
      client: 'Agency Beta',
      amount: 120000,
      dueDate: '10-Apr-2026',
      status: 'Pending',
      daysOverdue: 0,
      agingBucket: '0-15',
      risk: 'Low',
    },
    {
      id: 6,
      invoiceNumber: 'INV-2026-006',
      client: 'Desai Group',
      amount: 280000,
      dueDate: '12-Apr-2026',
      status: 'Pending',
      daysOverdue: 0,
      agingBucket: '0-15',
      risk: 'Low',
    },
  ];

  const highRiskClients = [
    {
      client: 'Agency Epsilon',
      totalOutstanding: 600000,
      overdueAmount: 600000,
      daysOverdue: 52,
      paymentPattern: 'Inconsistent',
      lastPayment: '18-Mar-2026',
      actionRequired: 'Immediate escalation - Credit block',
    },
    {
      client: 'Agency Gamma',
      totalOutstanding: 480000,
      overdueAmount: 480000,
      daysOverdue: 48,
      paymentPattern: 'Declining',
      lastPayment: '20-Mar-2026',
      actionRequired: 'Legal notice - Credit block',
    },
    {
      client: 'Agency Alpha',
      totalOutstanding: 350000,
      overdueAmount: 200000,
      daysOverdue: 35,
      paymentPattern: 'Slow but steady',
      lastPayment: '29-Mar-2026',
      actionRequired: 'Follow-up call scheduled',
    },
  ];

  const recoveryTracking = [
    {
      action: 'Follow-up calls scheduled',
      count: 3,
      totalAmount: 1430000,
      status: 'In Progress',
      dueBy: 'Today',
    },
    {
      action: 'Legal notices sent',
      count: 2,
      totalAmount: 1080000,
      status: 'Pending Response',
      dueBy: '10-Apr-2026',
    },
    {
      action: 'Payment plans active',
      count: 1,
      totalAmount: 350000,
      status: 'On Track',
      dueBy: '08-Apr-2026',
    },
    {
      action: 'Credit blocked accounts',
      count: 2,
      totalAmount: 1080000,
      status: 'Blocked',
      dueBy: 'Immediate',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-600 text-white';
      case 'Due Soon':
        return 'bg-yellow-600 text-white';
      case 'Pending':
        return 'bg-blue-600 text-white';
      case 'Paid':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-300';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-300';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-300';
    }
  };

  const totalReceivables = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const projectedInflow = cashFlowData.reduce((sum, week) => sum + week.projected, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-6">Payment & Accounting Module</h2>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Receivables</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(totalReceivables)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-red-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Overdue Amount</p>
                <p className="text-2xl text-red-600 mt-1">{formatCurrency(overdueAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-green-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Projected 4-Week Inflow</p>
                <p className="text-2xl text-green-600 mt-1">{formatCurrency(projectedInflow)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">High-Risk Clients</p>
                <p className="text-2xl text-accent mt-1">{highRiskClients.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Processing Funnel */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent p-6 rounded-lg border border-border mb-6">
          <div className="text-center mb-6">
            <h3 className="text-foreground mb-2">Invoice Processing Funnel</h3>
            <p className="text-sm text-muted-foreground">Flow of invoices through tracking and aging system</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {/* Input Flow */}
            <div className="w-full max-w-3xl">
              <div className="bg-card p-4 rounded-lg border-2 border-primary shadow-md">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h4 className="text-foreground">Input: Incoming Invoices & Payments</h4>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-primary/10 rounded">
                    <p className="text-2xl text-primary mb-1">{invoices.length}</p>
                    <p className="text-muted-foreground">Active Invoices</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-2xl text-green-600 mb-1">4</p>
                    <p className="text-muted-foreground">Pending Payment</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <p className="text-2xl text-red-600 mb-1">2</p>
                    <p className="text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </div>
            </div>

            <ArrowDown className="w-6 h-6 text-primary animate-pulse" />

            {/* Processing Filter */}
            <div className="w-full max-w-2xl">
              <div className="bg-card p-4 rounded-lg border-2 border-secondary shadow-md">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-secondary" />
                  <h4 className="text-foreground">Processing: Aging & Classification</h4>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="text-center p-2 bg-green-50 rounded border border-green-300">
                    <p className="text-lg text-green-600 mb-1">2</p>
                    <p className="text-muted-foreground">0-15 Days</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded border border-blue-300">
                    <p className="text-lg text-blue-600 mb-1">1</p>
                    <p className="text-muted-foreground">16-30 Days</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-300">
                    <p className="text-lg text-yellow-600 mb-1">1</p>
                    <p className="text-muted-foreground">31-45 Days</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded border border-red-300">
                    <p className="text-lg text-red-600 mb-1">2</p>
                    <p className="text-muted-foreground">45+ Days</p>
                  </div>
                </div>
              </div>
            </div>

            <ArrowDown className="w-6 h-6 text-accent animate-pulse" />

            {/* Output Flow */}
            <div className="w-full max-w-xl">
              <div className="bg-card p-4 rounded-lg border-2 border-accent shadow-md">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <TrendingDown className="w-5 h-5 text-accent" />
                  <h4 className="text-foreground">Output: Status & Actions</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded border border-green-300">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-lg text-green-600 mb-1">{formatCurrency(totalReceivables - overdueAmount)}</p>
                    <p className="text-muted-foreground">Healthy Flow</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded border border-red-300">
                    <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="text-lg text-red-600 mb-1">{formatCurrency(overdueAmount)}</p>
                    <p className="text-muted-foreground">Late Payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Invoice List */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-foreground">Invoice Tracking & Receivables Aging</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Invoice #</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Client</th>
                    <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Aging</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-3 text-sm">{invoice.client}</td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(invoice.amount)}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {invoice.status === 'Overdue' && (
                          <span className="text-red-600">{invoice.dueDate} ({invoice.daysOverdue}d overdue)</span>
                        )}
                        {invoice.status !== 'Overdue' && invoice.dueDate}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{invoice.agingBucket} days</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs border ${getRiskColor(invoice.risk)}`}>
                          {invoice.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cash Flow Projection */}
          <div className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-foreground">Cash Flow Projection</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Weekly inflow prediction</p>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cashFlowData}>
                <CartesianGrid key="cashflow-grid" strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis key="cashflow-xaxis" dataKey="week" tick={{ fontSize: 11 }} stroke="#6b7280" />
                <YAxis key="cashflow-yaxis" tick={{ fontSize: 11 }} stroke="#6b7280" />
                <Tooltip key="cashflow-tooltip" />
                <Line key="projected" type="monotone" dataKey="projected" stroke="#22c55e" strokeWidth={2} name="Projected" />
                <Line key="actual" type="monotone" dataKey="actual" stroke="#4b49ac" strokeWidth={2} name="Actual" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Projected Total:</span>
                <span className="text-green-600">{formatCurrency(projectedInflow)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Actual to Date:</span>
                <span className="text-primary">{formatCurrency(900000)}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded mt-3">
                <ArrowRight className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600">Positive trend: Expected 15% increase in Week 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Tracking */}
        <div className="bg-card rounded-lg border border-border p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-secondary" />
            <h3 className="text-foreground">Recovery Tracking</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recoveryTracking.map((action, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-border bg-muted/20">
                <h4 className="text-sm text-foreground mb-3">{action.action}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Count:</span>
                    <span className="text-foreground">{action.count}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-primary">{formatCurrency(action.totalAmount)}</span>
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.status === 'Blocked' ? 'bg-red-600 text-white' :
                      action.status === 'In Progress' ? 'bg-yellow-600 text-white' :
                      action.status === 'On Track' ? 'bg-green-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {action.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Due: {action.dueBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Clients Diagnostic */}
        <div className="bg-red-50 rounded-lg border-2 border-red-300 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-foreground">High-Risk Clients - Diagnostic Output</h3>
              <p className="text-sm text-muted-foreground">Clients requiring immediate attention</p>
            </div>
          </div>

          <div className="space-y-4">
            {highRiskClients.map((client, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="text-foreground">{client.client}</h4>
                      <span className="px-2 py-1 rounded text-xs bg-red-600 text-white">HIGH RISK</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Outstanding</p>
                        <p className="text-red-600">{formatCurrency(client.totalOutstanding)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Overdue Amount</p>
                        <p className="text-red-600">{formatCurrency(client.overdueAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Overdue</p>
                        <p className="text-red-600">{client.daysOverdue} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment Pattern</p>
                        <p className="text-foreground">{client.paymentPattern}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Payment</p>
                        <p className="text-foreground">{client.lastPayment}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Action Required</p>
                        <p className="text-red-600">{client.actionRequired}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-red-200">
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Flagged due to: {client.daysOverdue}+ days overdue, {client.paymentPattern.toLowerCase()} payment pattern</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
