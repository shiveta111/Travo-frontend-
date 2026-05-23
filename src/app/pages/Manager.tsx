import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  IndianRupee,
  CalendarDays,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  UserCheck,
  Package,
  FileText,
  Clock,
  Bot,
  ClipboardList,
} from "lucide-react";

type LeadStage =
  | "new"
  | "quotation_preparation"
  | "approval_pending"
  | "quotation_sent"
  | "follow_up"
  | "converted"
  | "lost";

type LeadStatus =
  | "new"
  | "contacted"
  | "approval_pending"
  | "quotation_sent"
  | "follow_up"
  | "not_reachable"
  | "converted"
  | "lost";

type FollowUpMode = "Call" | "WhatsApp" | "Email" | "Meeting";

type ManagerLead = {
  id: string;
  client: string;
  phone: string;
  email: string;
  destination: string;
  travelDate: string;
  nights: number;
  pax: number;
  source: string;
  stage: LeadStage;
  status: LeadStatus;
  priority: "Normal" | "High" | "Urgent";
  teamLeader: string;
  supportExecutive: string;
  fieldExecutive: string;
  selectedPackage: string;
  packageDuration: string;
  quotationAmount: number;
  clientBudget: number;
  quotationStatus: "not_prepared" | "approval_pending" | "approved" | "sent";
  sentVia: "Not Sent" | "Email" | "WhatsApp" | "Email + WhatsApp";
  nextFollowUp: string;
  attempts: number;
  lastActivity: string;
  reason: string;
  remarks: string;
  lossReason: string;
};

type Activity = {
  id: string;
  leadId: string;
  title: string;
  mode: FollowUpMode | "System";
  note: string;
  date: string;
  time: string;
};

const today = new Date().toISOString().split("T")[0];

const LEADS: ManagerLead[] = [
  {
    id: "L001",
    client: "Arjun Sharma",
    phone: "9876543210",
    email: "arjun@test.com",
    destination: "Shimla-Manali",
    travelDate: "2026-06-10",
    nights: 5,
    pax: 4,
    source: "WhatsApp",
    stage: "quotation_sent",
    status: "quotation_sent",
    priority: "High",
    teamLeader: "Sales Team Leader - North",
    supportExecutive: "Priya K",
    fieldExecutive: "Ravi Field Executive",
    selectedPackage: "Shimla Manali Family Tour",
    packageDuration: "6 Days / 5 Nights",
    quotationAmount: 124500,
    clientBudget: 120000,
    quotationStatus: "sent",
    sentVia: "Email + WhatsApp",
    nextFollowUp: "2026-05-21",
    attempts: 2,
    lastActivity: "Package shared with client",
    reason: "Client asked for hotel upgrade option.",
    remarks: "Quotation sent. Waiting for client response.",
    lossReason: "",
  },
  {
    id: "L002",
    client: "Meera Gupta",
    phone: "9876543211",
    email: "meera@test.com",
    destination: "Kerala 7N",
    travelDate: "2026-06-18",
    nights: 4,
    pax: 2,
    source: "Website",
    stage: "approval_pending",
    status: "approval_pending",
    priority: "Normal",
    teamLeader: "Sales Team Leader - South",
    supportExecutive: "Rahul M",
    fieldExecutive: "Amit Field Executive",
    selectedPackage: "Kerala Honeymoon Package",
    packageDuration: "5 Days / 4 Nights",
    quotationAmount: 98000,
    clientBudget: 280000,
    quotationStatus: "approval_pending",
    sentVia: "Not Sent",
    nextFollowUp: "2026-05-22",
    attempts: 1,
    lastActivity: "Quotation prepared",
    reason: "Waiting for Team Leader approval.",
    remarks: "Quotation prepared and sent for approval.",
    lossReason: "",
  },
  {
    id: "L003",
    client: "Dev Patel",
    phone: "9876543212",
    email: "dev@test.com",
    destination: "Goa Package",
    travelDate: "2026-06-05",
    nights: 3,
    pax: 5,
    source: "Campaign",
    stage: "follow_up",
    status: "not_reachable",
    priority: "Urgent",
    teamLeader: "Sales Team Leader - West",
    supportExecutive: "Sneha Support",
    fieldExecutive: "Karan Field Executive",
    selectedPackage: "Goa Beach Holiday",
    packageDuration: "4 Days / 3 Nights",
    quotationAmount: 85000,
    clientBudget: 85000,
    quotationStatus: "not_prepared",
    sentVia: "Not Sent",
    nextFollowUp: today,
    attempts: 3,
    lastActivity: "Call attempt failed",
    reason: "Client not reachable after 3 attempts.",
    remarks: "Need urgent follow-up today evening.",
    lossReason: "",
  },
  {
    id: "L004",
    client: "Sneha Rao",
    phone: "9876543213",
    email: "sneha@test.com",
    destination: "Rajasthan Tour",
    travelDate: "2026-07-01",
    nights: 6,
    pax: 3,
    source: "Field Visit",
    stage: "converted",
    status: "converted",
    priority: "High",
    teamLeader: "Sales Team Leader - North",
    supportExecutive: "Priya K",
    fieldExecutive: "Ravi Field Executive",
    selectedPackage: "Rajasthan Heritage Tour",
    packageDuration: "7 Days / 6 Nights",
    quotationAmount: 348000,
    clientBudget: 350000,
    quotationStatus: "sent",
    sentVia: "WhatsApp",
    nextFollowUp: "",
    attempts: 4,
    lastActivity: "Booking confirmed",
    reason: "Client accepted quotation and paid advance.",
    remarks: "Booking confirmed.",
    lossReason: "",
  },
  {
    id: "L005",
    client: "Anil Kumar",
    phone: "9876543214",
    email: "anil@test.com",
    destination: "Dubai",
    travelDate: "2026-06-25",
    nights: 4,
    pax: 2,
    source: "Reference",
    stage: "lost",
    status: "lost",
    priority: "Normal",
    teamLeader: "Sales Team Leader - West",
    supportExecutive: "Sneha Support",
    fieldExecutive: "Karan Field Executive",
    selectedPackage: "Dubai Short Break",
    packageDuration: "5 Days / 4 Nights",
    quotationAmount: 145000,
    clientBudget: 90000,
    quotationStatus: "sent",
    sentVia: "Email",
    nextFollowUp: "",
    attempts: 5,
    lastActivity: "Lead marked lost",
    reason: "Budget mismatch.",
    remarks: "Client found package expensive.",
    lossReason: "Budget mismatch",
  },
];

const ACTIVITIES: Activity[] = [
  {
    id: "A001",
    leadId: "L001",
    title: "Package Shared",
    mode: "WhatsApp",
    note: "Shimla Manali Family Tour shared with client via Email and WhatsApp.",
    date: "2026-05-20",
    time: "10:15 AM",
  },
  {
    id: "A002",
    leadId: "L002",
    title: "Quotation Prepared",
    mode: "System",
    note: "Kerala Honeymoon Package quotation sent for Team Leader approval.",
    date: "2026-05-20",
    time: "11:05 AM",
  },
  {
    id: "A003",
    leadId: "L003",
    title: "Call Attempt",
    mode: "Call",
    note: "Client did not answer. Marked as not reachable.",
    date: "2026-05-20",
    time: "12:20 PM",
  },
  {
    id: "A004",
    leadId: "L004",
    title: "Booking Confirmed",
    mode: "System",
    note: "Client confirmed booking and paid advance.",
    date: "2026-05-19",
    time: "05:30 PM",
  },
];

const getLeadProgress = (lead: ManagerLead) => {
  if (lead.status === "converted") return 100;
  if (lead.status === "lost") return 100;

  if (lead.quotationStatus === "sent") return 70;
  if (lead.quotationStatus === "approved") return 60;
  if (lead.quotationStatus === "approval_pending") return 50;

  const stageProgress: Record<LeadStage, number> = {
    new: 10,
    quotation_preparation: 30,
    approval_pending: 50,
    quotation_sent: 70,
    follow_up: 80,
    converted: 100,
    lost: 100,
  };

  return stageProgress[lead.stage] || 0;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatText = (value: string) => {
  return value.replace(/_/g, " ").toUpperCase();
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-cyan-100 text-cyan-700",
    approval_pending: "bg-purple-100 text-purple-700",
    quotation_sent: "bg-indigo-100 text-indigo-700",
    follow_up: "bg-orange-100 text-orange-700",
    not_reachable: "bg-gray-100 text-gray-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };

  return map[status] || "bg-gray-100 text-gray-700";
};

const getStageColor = (stage: string) => {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    quotation_preparation: "bg-amber-100 text-amber-700",
    approval_pending: "bg-purple-100 text-purple-700",
    quotation_sent: "bg-indigo-100 text-indigo-700",
    follow_up: "bg-orange-100 text-orange-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };

  return map[stage] || "bg-gray-100 text-gray-700";
};

const getPriorityColor = (priority: string) => {
  const map: Record<string, string> = {
    Normal: "bg-gray-100 text-gray-700",
    High: "bg-amber-100 text-amber-700",
    Urgent: "bg-red-100 text-red-700",
  };

  return map[priority] || "bg-gray-100 text-gray-700";
};

export function Manager() {
  const [leads] = useState<ManagerLead[]>(LEADS);
  const [activities] = useState<Activity[]>(ACTIVITIES);

  const [searchQuery, setSearchQuery] = useState("");
  const [teamLeaderFilter, setTeamLeaderFilter] = useState("all");
  const [supportFilter, setSupportFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<ManagerLead | null>(null);

  const teamLeaders = Array.from(new Set(leads.map((lead) => lead.teamLeader)));
  const supportExecutives = Array.from(
    new Set(leads.map((lead) => lead.supportExecutive))
  );
  const destinations = Array.from(new Set(leads.map((lead) => lead.destination)));

  const filteredLeads = leads.filter((lead) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      lead.client.toLowerCase().includes(search) ||
      lead.phone.toLowerCase().includes(search) ||
      lead.destination.toLowerCase().includes(search) ||
      lead.id.toLowerCase().includes(search) ||
      lead.selectedPackage.toLowerCase().includes(search) ||
      lead.supportExecutive.toLowerCase().includes(search) ||
      lead.teamLeader.toLowerCase().includes(search);

    const matchesTeamLeader =
      teamLeaderFilter === "all" || lead.teamLeader === teamLeaderFilter;

    const matchesSupport =
      supportFilter === "all" || lead.supportExecutive === supportFilter;

    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    const matchesDestination =
      destinationFilter === "all" || lead.destination === destinationFilter;

    return (
      matchesSearch &&
      matchesTeamLeader &&
      matchesSupport &&
      matchesStage &&
      matchesStatus &&
      matchesDestination
    );
  });

  const groupedLeads = {
    new: filteredLeads.filter((lead) => lead.stage === "new"),
    quotation: filteredLeads.filter(
      (lead) =>
        lead.stage === "quotation_preparation" ||
        lead.stage === "approval_pending"
    ),
    sent: filteredLeads.filter((lead) => lead.stage === "quotation_sent"),
    followUp: filteredLeads.filter((lead) => lead.stage === "follow_up"),
    converted: filteredLeads.filter((lead) => lead.stage === "converted"),
    lost: filteredLeads.filter((lead) => lead.stage === "lost"),
  };

  const stats = useMemo(() => {
    const activeLeads = leads.filter(
      (lead) => !["converted", "lost"].includes(lead.status)
    );

    const wonValue = leads
      .filter((lead) => lead.status === "converted")
      .reduce((sum, lead) => sum + lead.quotationAmount, 0);

    const pipelineValue = activeLeads.reduce(
      (sum, lead) => sum + lead.quotationAmount,
      0
    );

    const conversionRate =
      leads.length > 0
        ? ((leads.filter((lead) => lead.status === "converted").length /
            leads.length) *
            100).toFixed(1)
        : "0.0";

    return {
      totalLeads: leads.length,
      activeLeads: activeLeads.length,
      pipelineValue,
      wonValue,
      converted: leads.filter((lead) => lead.status === "converted").length,
      lost: leads.filter((lead) => lead.status === "lost").length,
      conversionRate,
      todayFollowUps: leads.filter((lead) => lead.nextFollowUp === today)
        .length,
      approvalPending: leads.filter(
        (lead) => lead.status === "approval_pending"
      ).length,
    };
  }, [leads]);

  const coldLeads = leads.filter(
    (lead) =>
      lead.attempts >= 3 &&
      !["converted", "lost"].includes(lead.status)
  );

  const approvalPendingLeads = leads.filter(
    (lead) => lead.status === "approval_pending"
  );

  const budgetMismatchLeads = leads.filter(
    (lead) =>
      lead.clientBudget > 0 &&
      lead.quotationAmount > 0 &&
      lead.quotationAmount > lead.clientBudget
  );

  return (
    <div className="flex-1 bg-[#f5f7ff] overflow-auto">
      <div className="mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Manager Sales Pipeline
            </h1>
            <p className="text-sm text-muted-foreground">
              Track every lead, package, quotation, team leader, support executive,
              follow-up reason and final progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lead, package, member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac] w-[280px]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              Filters
            </div>

            <select
              value={teamLeaderFilter}
              onChange={(e) => setTeamLeaderFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Team Leaders</option>
              {teamLeaders.map((leader) => (
                <option key={leader} value={leader}>
                  {leader}
                </option>
              ))}
            </select>

            <select
              value={supportFilter}
              onChange={(e) => setSupportFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Support Executives</option>
              {supportExecutives.map((executive) => (
                <option key={executive} value={executive}>
                  {executive}
                </option>
              ))}
            </select>

            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Destinations</option>
              {destinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="quotation_preparation">Quotation Preparation</option>
              <option value="approval_pending">Approval Pending</option>
              <option value="quotation_sent">Quotation Sent</option>
              <option value="follow_up">Follow Up</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="approval_pending">Approval Pending</option>
              <option value="quotation_sent">Quotation Sent</option>
              <option value="follow_up">Follow Up</option>
              <option value="not_reachable">Not Reachable</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          subtitle="All team leads"
          icon={<Users className="w-5 h-5 text-[#4b49ac]" />}
        />
        <StatCard
          title="Active Leads"
          value={stats.activeLeads}
          subtitle="In pipeline"
          icon={<ClipboardList className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.pipelineValue)}
          subtitle="Open value"
          icon={<IndianRupee className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Won Value"
          value={formatCurrency(stats.wonValue)}
          subtitle="Confirmed"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          subtitle="Bookings"
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Lost"
          value={stats.lost}
          subtitle="Closed lost"
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
        />
        <StatCard
          title="Conv. Rate"
          value={`${stats.conversionRate}%`}
          subtitle="Current"
          icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
        />
        <StatCard
          title="Follow-ups"
          value={stats.todayFollowUps}
          subtitle="Today"
          icon={<CalendarDays className="w-5 h-5 text-orange-600" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Lead Overview</h3>
            <p className="text-xs text-muted-foreground">
              Showing {filteredLeads.length} leads with package, quotation, team and reason.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sidebar-accent">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Lead
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Package
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Quote
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    View
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => {
                  const progress = getLeadProgress(lead);

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-sidebar-accent transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {lead.id} · {lead.client}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.destination} · {lead.nights}N · {lead.pax} Pax
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground">
                          TL: {lead.teamLeader}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Support: {lead.supportExecutive}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Field: {lead.fieldExecutive}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          {lead.selectedPackage || "Not selected"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.packageDuration || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">
                          {lead.quotationAmount
                            ? formatCurrency(lead.quotationAmount)
                            : "Not prepared"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Budget: {formatCurrency(lead.clientBudget)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStageColor(
                            lead.stage
                          )}`}
                        >
                          {formatText(lead.stage)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {formatText(lead.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {lead.reason || lead.remarks || "No reason added"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="w-28 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-[#4b49ac]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {progress}%
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-lg hover:bg-[#4b49ac]/10 text-[#4b49ac]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ManagerInsights
          coldLeads={coldLeads}
          approvalPendingLeads={approvalPendingLeads}
          budgetMismatchLeads={budgetMismatchLeads}
        />
      </div>

      <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Stage-wise Pipeline Board</h3>
          <p className="text-xs text-muted-foreground">
            Manager view of leads across all pipeline stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 p-4">
          <PipelineColumn
            title="New"
            leads={groupedLeads.new}
            badgeClass="bg-blue-600"
            onView={setSelectedLead}
          />
          <PipelineColumn
            title="Quote / Approval"
            leads={groupedLeads.quotation}
            badgeClass="bg-purple-600"
            onView={setSelectedLead}
          />
          <PipelineColumn
            title="Quote Sent"
            leads={groupedLeads.sent}
            badgeClass="bg-indigo-600"
            onView={setSelectedLead}
          />
          <PipelineColumn
            title="Follow-up"
            leads={groupedLeads.followUp}
            badgeClass="bg-orange-600"
            onView={setSelectedLead}
          />
          <PipelineColumn
            title="Converted"
            leads={groupedLeads.converted}
            badgeClass="bg-green-600"
            onView={setSelectedLead}
          />
          <PipelineColumn
            title="Lost"
            leads={groupedLeads.lost}
            badgeClass="bg-gray-600"
            onView={setSelectedLead}
          />
        </div>
      </div>

      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          activities={activities.filter((activity) => activity.leadId === selectedLead.id)}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

function PipelineColumn({
  title,
  leads,
  badgeClass,
  onView,
}: {
  title: string;
  leads: ManagerLead[];
  badgeClass: string;
  onView: (lead: ManagerLead) => void;
}) {
  return (
    <div className="bg-[#f8fafc] rounded-lg border border-border p-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <span className={`px-2 py-0.5 ${badgeClass} text-white rounded-full text-xs`}>
          {leads.length}
        </span>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => {
          const progress = getLeadProgress(lead);

          return (
            <div
              key={lead.id}
              className="bg-white border border-border rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {lead.client}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lead.destination}
                  </p>
                </div>

                <button
                  onClick={() => onView(lead)}
                  className="p-1 rounded hover:bg-[#4b49ac]/10 text-[#4b49ac]"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-1">
                {lead.selectedPackage || "No package"}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                TL: {lead.teamLeader}
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-[#4b49ac]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{progress}%</p>
                <p className="text-xs font-semibold text-foreground">
                  {lead.quotationAmount ? formatCurrency(lead.quotationAmount) : "N/A"}
                </p>
              </div>
            </div>
          );
        })}

        {leads.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No leads
          </p>
        )}
      </div>
    </div>
  );
}

function ManagerInsights({
  coldLeads,
  approvalPendingLeads,
  budgetMismatchLeads,
}: {
  coldLeads: ManagerLead[];
  approvalPendingLeads: ManagerLead[];
  budgetMismatchLeads: ManagerLead[];
}) {
  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#4b49ac]" />
          Manager Insights
        </h3>
        <p className="text-xs text-muted-foreground">
          Important items requiring manager attention.
        </p>
      </div>

      <div className="p-4 space-y-4 max-h-[540px] overflow-y-auto">
        <InsightBlock
          title="Cold / Risk Leads"
          count={coldLeads.length}
          tone="red"
          items={coldLeads.map(
            (lead) =>
              `${lead.client}: ${lead.attempts} attempts, status ${formatText(
                lead.status
              )}`
          )}
        />

        <InsightBlock
          title="Approval Pending"
          count={approvalPendingLeads.length}
          tone="purple"
          items={approvalPendingLeads.map(
            (lead) =>
              `${lead.client}: quote ${formatCurrency(
                lead.quotationAmount
              )} with ${lead.teamLeader}`
          )}
        />

        <InsightBlock
          title="Budget Mismatch"
          count={budgetMismatchLeads.length}
          tone="amber"
          items={budgetMismatchLeads.map(
            (lead) =>
              `${lead.client}: budget ${formatCurrency(
                lead.clientBudget
              )}, quote ${formatCurrency(lead.quotationAmount)}`
          )}
        />
      </div>
    </div>
  );
}

function InsightBlock({
  title,
  count,
  items,
  tone,
}: {
  title: string;
  count: number;
  items: string[];
  tone: "red" | "purple" | "amber";
}) {
  const toneClass = {
    red: "bg-red-50 border-red-200 text-red-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  };

  return (
    <div className={`border rounded-lg p-3 ${toneClass[tone]}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <span className="text-xs font-semibold">{count}</span>
      </div>

      <div className="space-y-1">
        {items.length > 0 ? (
          items.map((item, index) => (
            <p key={index} className="text-xs">
              • {item}
            </p>
          ))
        ) : (
          <p className="text-xs">No issue found.</p>
        )}
      </div>
    </div>
  );
}

function LeadDetailDrawer({
  lead,
  activities,
  onClose,
}: {
  lead: ManagerLead;
  activities: Activity[];
  onClose: () => void;
}) {
  const progress = getLeadProgress(lead);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-auto p-6">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground">{lead.id}</p>
            <h3 className="text-xl font-semibold text-foreground">
              {lead.client}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lead.destination} · {lead.packageDuration}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <Info label="Phone" value={lead.phone} />
          <Info label="Email" value={lead.email} />
          <Info label="Travel Date" value={lead.travelDate} />
          <Info label="Pax / Nights" value={`${lead.pax} Pax / ${lead.nights} Nights`} />
          <Info label="Source" value={lead.source} />
          <Info label="Priority" value={lead.priority} />
          <Info label="Team Leader" value={lead.teamLeader} />
          <Info label="Support Executive" value={lead.supportExecutive} />
          <Info label="Field Executive" value={lead.fieldExecutive} />
          <Info label="Selected Package" value={lead.selectedPackage || "Not selected"} />
          <Info label="Package Duration" value={lead.packageDuration || "N/A"} />
          <Info label="Quotation Amount" value={formatCurrency(lead.quotationAmount)} />
          <Info label="Client Budget" value={formatCurrency(lead.clientBudget)} />
          <Info label="Quotation Status" value={formatText(lead.quotationStatus)} />
          <Info label="Sent Via" value={lead.sentVia} />
          <Info label="Next Follow-up" value={lead.nextFollowUp || "Not set"} />
          <Info label="Attempts" value={String(lead.attempts)} />
          <Info label="Status" value={formatText(lead.status)} />
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-[#4b49ac]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-2">Manager Notes</h4>
          <div className="bg-[#f8fafc] border border-border rounded-lg p-3 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Reason:</strong> {lead.reason || "No reason added"}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Remarks:</strong> {lead.remarks || "No remarks added"}
            </p>
            {lead.lossReason && (
              <p className="text-sm text-red-600">
                <strong>Loss Reason:</strong> {lead.lossReason}
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">Activity Timeline</h4>

          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border border-border rounded-lg p-3 bg-[#f8fafc]"
              >
                <div className="flex items-center justify-between mb-2">
                  <ModeBadge mode={activity.mode} />
                  <p className="text-xs text-muted-foreground">
                    {activity.date} · {activity.time}
                  </p>
                </div>

                <p className="text-sm font-medium text-foreground mb-1">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">{activity.note}</p>
              </div>
            ))}

            {activities.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No activity recorded for this lead.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeBadge({ mode }: { mode: FollowUpMode | "System" }) {
  const modeClass: Record<string, string> = {
    Call: "bg-green-100 text-green-700",
    WhatsApp: "bg-emerald-100 text-emerald-700",
    Email: "bg-blue-100 text-blue-700",
    Meeting: "bg-purple-100 text-purple-700",
    System: "bg-gray-100 text-gray-700",
  };

  const icon: Record<string, React.ReactNode> = {
    Call: <Phone className="w-3 h-3" />,
    WhatsApp: <MessageCircle className="w-3 h-3" />,
    Email: <Mail className="w-3 h-3" />,
    Meeting: <Clock className="w-3 h-3" />,
    System: <Bot className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${modeClass[mode]}`} 
    >
      {icon[mode]}
      {mode}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="text-xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
