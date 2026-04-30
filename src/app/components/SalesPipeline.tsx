import { Filter, Users, TrendingUp, DollarSign, Clock, Mail, Phone, Calendar, MessageSquare, CheckCircle, AlertCircle, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';

interface Lead {
  id: number;
  name: string;
  destination: string;
  nights: number;
  pax: number;
  status: string;
  timeInfo: string;
  channel?: string;
  statusNote: string;
  value: number;
  isApproximate?: boolean;
  warning?: string;
}

export function SalesPipeline() {
  const [filters, setFilters] = useState({
    destination: '',
    stage: '',
  });
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  const initialNewLeads: Lead[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      destination: 'Bali',
      nights: 7,
      pax: 4,
      status: 'New',
      timeInfo: '2 hrs ago',
      channel: 'WhatsApp',
      statusNote: '',
      value: 120000,
      isApproximate: true,
    },
    {
      id: 2,
      name: 'Rajesh Iyer',
      destination: 'Bali',
      nights: 5,
      pax: 2,
      status: 'New',
      timeInfo: '4 hrs ago',
      channel: 'Email',
      statusNote: '',
      value: 68000,
      isApproximate: true,
    },
    {
      id: 3,
      name: 'Anita Bose',
      destination: 'Bali',
      nights: 10,
      pax: 6,
      status: 'New',
      timeInfo: '6 hrs ago',
      channel: 'Web Form',
      statusNote: '',
      value: 240000,
      isApproximate: true,
    },
  ];

  const initialQuotedLeads: Lead[] = [
    {
      id: 4,
      name: 'Mehta Family',
      destination: 'Bali',
      nights: 8,
      pax: 5,
      status: 'Quoted',
      timeInfo: 'Day 3',
      statusNote: 'Auto F/U sent',
      value: 184000,
    },
    {
      id: 5,
      name: 'Suresh Nair',
      destination: 'Ubud',
      nights: 4,
      pax: 2,
      status: 'Quoted',
      timeInfo: 'Day 1',
      statusNote: 'Opened quote',
      value: 52000,
    },
  ];

  const initialFollowUpLeads: Lead[] = [
    {
      id: 6,
      name: 'Vikram Joshi',
      destination: 'Seminyak',
      nights: 7,
      pax: 4,
      status: 'Follow-Up',
      timeInfo: 'Day 6',
      statusNote: 'COLD',
      value: 140000,
      warning: 'COLD',
    },
    {
      id: 7,
      name: 'Pooja Singh',
      destination: 'Bali',
      nights: 6,
      pax: 3,
      status: 'Follow-Up',
      timeInfo: 'Day 4',
      statusNote: 'Urgency sent',
      value: 96000,
    },
  ];

  const initialWonLeads: Lead[] = [
    {
      id: 8,
      name: 'Ravi Mehta',
      destination: 'Bali',
      nights: 7,
      pax: 28,
      status: 'Won',
      timeInfo: 'Apr 8 dep',
      statusNote: 'Paid 50%',
      value: 840000,
    },
    {
      id: 9,
      name: 'Gupta Family',
      destination: 'Ubud',
      nights: 5,
      pax: 4,
      status: 'Won',
      timeInfo: 'Confirmed',
      statusNote: 'Full paid',
      value: 110000,
    },
  ];

  const initialLostLeads: Lead[] = [
    {
      id: 10,
      name: 'Anil Kumar',
      destination: 'N/A',
      nights: 0,
      pax: 0,
      status: 'Lost',
      timeInfo: '',
      statusNote: 'Budget mismatch',
      value: 0,
    },
  ];

  const [newLeads, setNewLeads] = useState<Lead[]>(initialNewLeads);
  const [quotedLeads, setQuotedLeads] = useState<Lead[]>(initialQuotedLeads);
  const [followUpLeads, setFollowUpLeads] = useState<Lead[]>(initialFollowUpLeads);
  const [wonLeads, setWonLeads] = useState<Lead[]>(initialWonLeads);
  const [lostLeads, setLostLeads] = useState<Lead[]>(initialLostLeads);

  const [newLead, setNewLead] = useState({
    name: '',
    destination: '',
    nights: 1,
    pax: 1,
    status: 'New' as string,
    channel: '',
    value: 0,
  });

  const getNextId = () => {
    const allLeads = [...newLeads, ...quotedLeads, ...followUpLeads, ...wonLeads, ...lostLeads];
    return allLeads.length > 0 ? Math.max(...allLeads.map(l => l.id)) + 1 : 1;
  };

  const handleAddLead = () => {
    const lead: Lead = {
      id: getNextId(),
      name: newLead.name,
      destination: newLead.destination,
      nights: newLead.nights,
      pax: newLead.pax,
      status: newLead.status,
      timeInfo: 'Just now',
      channel: newLead.channel || undefined,
      statusNote: '',
      value: newLead.value,
      isApproximate: true,
    };

    // Add to appropriate list based on status
    switch (newLead.status) {
      case 'New':
        setNewLeads([...newLeads, lead]);
        break;
      case 'Quoted':
        setQuotedLeads([...quotedLeads, lead]);
        break;
      case 'Follow-Up':
        setFollowUpLeads([...followUpLeads, lead]);
        break;
      case 'Won':
        setWonLeads([...wonLeads, lead]);
        break;
      case 'Lost':
        setLostLeads([...lostLeads, lead]);
        break;
    }

    setShowNewLeadModal(false);
    setNewLead({
      name: '',
      destination: '',
      nights: 1,
      pax: 1,
      status: 'New',
      channel: '',
      value: 0,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <div className="bg-card p-3 rounded-lg border border-border hover:shadow-md transition-shadow cursor-move">
      <div className="mb-2">
        <h4 className="text-sm text-foreground mb-1">{lead.name}</h4>
        {lead.destination !== 'N/A' && (
          <p className="text-xs text-muted-foreground">
            {lead.destination} · {lead.nights}N · {lead.pax} pax
          </p>
        )}
      </div>

      <div className="space-y-1.5 mb-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{lead.timeInfo}</span>
          {lead.channel && (
            <span className="text-muted-foreground">{lead.channel}</span>
          )}
        </div>
        {lead.statusNote && (
          <div className={`text-xs px-2 py-1 rounded ${
            lead.warning === 'COLD'
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {lead.statusNote}
          </div>
        )}
      </div>

      <p className="text-sm text-primary">
        {lead.isApproximate && '~'}{formatCurrency(lead.value)}
      </p>

      {lead.warning && (
        <div className="mt-2 p-1.5 bg-red-50 rounded flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>⚠</span>
        </div>
      )}
    </div>
  );

  const allLeads = [...newLeads, ...quotedLeads, ...followUpLeads, ...wonLeads, ...lostLeads];
  const totalPipelineValue = [...newLeads, ...quotedLeads, ...followUpLeads, ...wonLeads]
    .reduce((sum, lead) => sum + lead.value, 0);

  const totalLeadsCount = 84 + 211 + 127 + 13 + 90; // Total across all stages
  const conversionRate = ((wonLeads.length / (newLeads.length + quotedLeads.length + followUpLeads.length + wonLeads.length + lostLeads.length)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-6">Sales Pipeline</h2>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Leads</p>
                <p className="text-2xl text-foreground mt-1">{totalLeadsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl text-foreground mt-1">{conversionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl text-foreground mt-1">{formatCurrency(totalPipelineValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-green-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Won This Month</p>
                <p className="text-2xl text-green-600 mt-1">{13}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-card p-4 rounded-lg border border-border mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>
              <select
                className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              >
                <option value="">All Destinations</option>
                <option value="bali">Bali</option>
                <option value="ubud">Ubud</option>
                <option value="seminyak">Seminyak</option>
              </select>
              <select
                className="px-3 py-1.5 border border-border rounded-lg text-sm bg-input-background"
                value={filters.stage}
                onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
              >
                <option value="">All Stages</option>
                <option value="new">New</option>
                <option value="quoted">Quoted</option>
                <option value="followup">Follow-Up</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <button
              onClick={() => setShowNewLeadModal(true)}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Lead
            </button>
          </div>
        </div>

        {/* AI Insights Banner */}
        <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <CheckCircle className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-foreground mb-1">AI-Driven Insights</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Vikram Joshi: Lead is COLD (Day 6) - Urgent follow-up or consider moving to lost</li>
                <li>• Mehta Family: Quote opened Day 3 - Send personalized follow-up today</li>
                <li>• High Bali demand: 7 active Bali inquiries - Consider creating promotional package</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pipeline Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* New */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-foreground">New</h3>
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                84
              </span>
            </div>
            <div className="space-y-2">
              {newLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>

          {/* Quoted */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-foreground">Quoted</h3>
              <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs">
                211
              </span>
            </div>
            <div className="space-y-2">
              {quotedLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>

          {/* Follow-Up */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-foreground">Follow-Up</h3>
              <span className="px-2 py-0.5 bg-yellow-600 text-white rounded-full text-xs">
                127
              </span>
            </div>
            <div className="space-y-2">
              {followUpLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>

          {/* Won */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-foreground">Won</h3>
              <span className="px-2 py-0.5 bg-green-600 text-white rounded-full text-xs">
                13
              </span>
            </div>
            <div className="space-y-2">
              {wonLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>

          {/* Lost */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-foreground">Lost</h3>
              <span className="px-2 py-0.5 bg-gray-600 text-white rounded-full text-xs">
                90
              </span>
            </div>
            <div className="space-y-2">
              {lostLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        </div>

        {/* New Lead Modal */}
        {showNewLeadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground">Add New Lead</h3>
                    <p className="text-sm text-muted-foreground">Enter lead details to add to your pipeline</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewLeadModal(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Lead Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newLead.name}
                      onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                      placeholder="e.g., Priya Sharma"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Destination <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newLead.destination}
                      onChange={(e) => setNewLead({ ...newLead, destination: e.target.value })}
                      placeholder="e.g., Bali"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Nights <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newLead.nights}
                        onChange={(e) => setNewLead({ ...newLead, nights: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Pax <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newLead.pax}
                        onChange={(e) => setNewLead({ ...newLead, pax: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Estimated Value (₹) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newLead.value || ''}
                      onChange={(e) => setNewLead({ ...newLead, value: parseFloat(e.target.value) || 0 })}
                      placeholder="120000"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Status <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={newLead.status}
                      onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="New">New</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Follow-Up">Follow-Up</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Channel (Optional)
                    </label>
                    <select
                      value={newLead.channel}
                      onChange={(e) => setNewLead({ ...newLead, channel: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Channel</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="Web Form">Web Form</option>
                      <option value="Phone">Phone</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLead}
                  disabled={
                    !newLead.name ||
                    !newLead.destination ||
                    newLead.nights <= 0 ||
                    newLead.pax <= 0 ||
                    newLead.value <= 0
                  }
                  className="px-6 py-2.5 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
