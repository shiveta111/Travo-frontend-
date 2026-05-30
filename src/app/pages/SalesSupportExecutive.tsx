import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllLeads, mapApiLead, updateLead, updateLeadFollowUp, getFollowUpModes, getRecentActivities } from "../../api/leads.api";
import { getAllPackages, mapApiPackage } from "../../api/packages.api";
import { useAuth } from "../../auth/AuthContext";
import {
  Search,
  Phone,
  MessageCircle,
  Mail,
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  X,
  Save,
  ClipboardList,
  FileText,
  Send,
  Bot,
  Package,
} from "lucide-react";

type LeadStage =
  | "enquiry_created"
  | "quotation_preparation"
  | "quotation_approval"
  | "quotation_sent"
  | "follow_up"
  | "converted"
  | "lost";

type LeadStatus =
  | "new"
  | "contacted"
  | "quotation_pending"
  | "approval_pending"
  | "quotation_sent"
  | "follow_up"
  | "converted"
  | "lost"
  | "not_reachable";

type FollowUpMode = "Call" | "WhatsApp" | "Email" | "Meeting";

type Lead = {
  id: string;
  client: string;
  phone: string;
  email: string;
  destination: string;
  travelDate: string;
  travellers: number;
  budget: string;
  source: string;
  priority: "Normal" | "High" | "Urgent";
  assignedBy: string;
  stage: LeadStage;
  status: LeadStatus;
  lastContact: string;
  nextFollowUp: string;
  followUpMode: FollowUpMode;
  attempts: number;
  quotationAmount: string;
  selectedPackage: string;
  quotationStatus:
    | "not_prepared"
    | "draft"
    | "approval_pending"
    | "approved"
    | "sent";
  approvalBy: string;
  sentVia: "Not Sent" | "Email" | "WhatsApp" | "Email + WhatsApp";
  lossReason: string;
  remarks: string;
  aiGenerated?: boolean;
};

type Activity = {
  id: string;
  leadId: string;
  title: string;
  mode: FollowUpMode | "System";
  stage: LeadStage;
  status: LeadStatus;
  note: string;
  date: string;
  time: string;
};

type ReadyPackage = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
};

const today = new Date().toISOString().split("T")[0];

// READY_PACKAGES is now fetched from the API — replaced below with dynamic state

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "A001",
    leadId: "L001",
    title: "Package Shared",
    mode: "WhatsApp",
    stage: "quotation_sent",
    status: "quotation_sent",
    note: "Shimla Manali Family Tour package shared with client through Email and WhatsApp.",
    date: "2026-05-20",
    time: "10:15 AM",
  },
  {
    id: "A002",
    leadId: "L002",
    title: "Quotation Prepared",
    mode: "System",
    stage: "quotation_approval",
    status: "approval_pending",
    note: "Kerala package quotation prepared and sent to Team Leader for approval.",
    date: "2026-05-20",
    time: "11:05 AM",
  },
  {
    id: "A003",
    leadId: "L003",
    title: "Call Attempt",
    mode: "Call",
    stage: "follow_up",
    status: "not_reachable",
    note: "Client did not answer the call.",
    date: "2026-05-20",
    time: "12:20 PM",
  },
];

const getLeadProgress = (lead: Lead) => {
  if (lead.status === "converted") return 100;
  if (lead.status === "lost") return 100;

  if (lead.stage === "converted") return 100;
  if (lead.stage === "lost") return 100;

  if (lead.quotationStatus === "sent") return 70;
  if (lead.quotationStatus === "approved") return 60;
  if (lead.quotationStatus === "approval_pending") return 50;
  if (lead.quotationStatus === "draft") return 35;

  const stageProgress: Record<LeadStage, number> = {
    enquiry_created: 10,
    quotation_preparation: 30,
    quotation_approval: 50,
    quotation_sent: 70,
    follow_up: 80,
    converted: 100,
    lost: 100,
  };

  return stageProgress[lead.stage] || 0;
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-cyan-100 text-cyan-700",
    quotation_pending: "bg-amber-100 text-amber-700",
    approval_pending: "bg-purple-100 text-purple-700",
    quotation_sent: "bg-indigo-100 text-indigo-700",
    follow_up: "bg-orange-100 text-orange-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
    not_reachable: "bg-gray-100 text-gray-700",
  };

  return map[status] || "bg-gray-100 text-gray-700";
};

const getStageColor = (stage: string) => {
  const map: Record<string, string> = {
    enquiry_created: "bg-blue-100 text-blue-700",
    quotation_preparation: "bg-amber-100 text-amber-700",
    quotation_approval: "bg-purple-100 text-purple-700",
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

const formatText = (value: string) => {
  return value.replace(/_/g, " ").toUpperCase();
};

const mapApiLeadToSSE = (rawLead: any): Lead => {
  const base = mapApiLead(rawLead);
  return {
    id: base.id,
    client: base.client,
    phone: base.phone,
    email: base.email,
    destination: base.dest,
    travelDate: base.travelDate as string,
    travellers: Number(base.travellers) || 0,
    budget: base.budget,
    source: base.source,
    priority: (base.priority as Lead['priority']) || 'Normal',
    assignedBy: base.assignedLeader || '—',
    stage: (base.stage as LeadStage) || 'enquiry_created',
    status: (base.status as LeadStatus) || 'new',
    lastContact: base.dateValue,
    nextFollowUp: base.nextFollowUp || '',
    followUpMode: 'Call' as FollowUpMode,
    attempts: 0,
    quotationAmount: '',
    selectedPackage: '',
    quotationStatus: 'not_prepared',
    approvalBy: '',
    sentVia: 'Not Sent',
    lossReason: '',
    remarks: base.remarks,
    aiGenerated: base.aiGenerated,
  };
};

export function SalesSupportExecutive() {
  const { user } = useAuth() as any;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // ── Dynamic packages from API ─────────────────────────────────────────────
  const [readyPackages, setReadyPackages] = useState<ReadyPackage[]>([]);
  const [followUpModes, setFollowUpModes] = useState<string[]>(['Call', 'WhatsApp', 'Email', 'Meeting']);

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError('');
      // Filter leads for this user only if user id is available
      const userId = user?.id ?? user?.user_id;
      const data = userId
        ? await getAllLeads({ user_id: userId })
        : await getAllLeads();
      const rawList: any[] = Array.isArray(data) ? data : Array.isArray(data?.leads) ? data.leads : Array.isArray(data?.data) ? data.data : [];
      setLeads(rawList.map(mapApiLeadToSSE));
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setFetchError(msg || 'Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchPackages = useCallback(async () => {
    try {
      const data = await getAllPackages();
      const rawList: any[] = Array.isArray(data) ? data : Array.isArray(data?.packages) ? data.packages : Array.isArray(data?.data) ? data.data : [];
      setReadyPackages(rawList.map((p: any) => {
        const mapped = mapApiPackage(p);
        return {
          id:          mapped.id,
          title:       mapped.title,
          destination: mapped.destination,
          duration:    `${mapped.days} Days / ${mapped.nights} Nights`,
          price:       mapped.price,
        };
      }));
    } catch {
      // keep fallback empty — quotation form still works manually
    }
  }, []);

  const fetchModes = useCallback(async () => {
    try {
      const data = await getFollowUpModes();
      const modes: string[] = Array.isArray(data) ? data : Array.isArray(data?.modes) ? data.modes : Array.isArray(data?.data) ? data.data : [];
      if (modes.length > 0) setFollowUpModes(modes);
    } catch {
      // keep hardcoded fallback
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      const userId = user?.id ?? user?.user_id;
      if (!userId) return;
      const data = await getRecentActivities(userId);
      const rawList: any[] = Array.isArray(data) ? data : Array.isArray(data?.activities) ? data.activities : Array.isArray(data?.data) ? data.data : [];
      if (rawList.length > 0) {
        setActivities(rawList.map((a: any, i: number) => ({
          id:     String(a.id ?? `A${i}`),
          leadId: String(a.lead_id ?? ''),
          title:  a.title ?? a.activity_type ?? 'Activity',
          mode:   (a.follow_up_mode ?? a.mode ?? 'System') as Activity['mode'],
          stage:  (a.stage ?? 'enquiry_created') as LeadStage,
          status: (a.status ?? 'new') as LeadStatus,
          note:   a.note ?? a.follow_up_note ?? '',
          date:   a.date ?? (a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : today),
          time:   a.time ?? (a.created_at ? new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
        })));
      }
    } catch {
      // keep hardcoded fallback activities
    }
  }, [user]);

  useEffect(() => {
    fetchLeads();
    fetchPackages();
    fetchModes();
    fetchActivities();
  }, [fetchLeads, fetchPackages, fetchModes, fetchActivities]);

  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [quotationLead, setQuotationLead] = useState<Lead | null>(null);
  const [followUpLead, setFollowUpLead] = useState<Lead | null>(null);
  const [conversionLead, setConversionLead] = useState<Lead | null>(null);

  const [followUpForm, setFollowUpForm] = useState({
    mode: "Call" as FollowUpMode,
    status: "contacted" as LeadStatus,
    nextFollowUp: "",
    note: "",
    selectedPackage: "",
    quotationAmount: "",
  });

  const [quotationForm, setQuotationForm] = useState({
    quotationAmount: "",
    selectedPackage: "",
    itineraryNote: "",
    approvalBy: "Sales Team Leader - North",
  });

  const [conversionForm, setConversionForm] = useState({
    result: "converted" as "converted" | "lost",
    bookingAmount: "",
    lossReason: "",
    note: "",
  });

  const filteredLeads = leads.filter((lead) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      lead.client.toLowerCase().includes(search) ||
      lead.phone.toLowerCase().includes(search) ||
      lead.destination.toLowerCase().includes(search) ||
      lead.id.toLowerCase().includes(search) ||
      lead.selectedPackage.toLowerCase().includes(search);

    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || lead.priority === priorityFilter;
    const matchesDate = (!dateFrom && !dateTo) ||
      (dateFrom && dateTo ? lead.dateValue >= dateFrom && lead.dateValue <= dateTo :
       dateFrom ? lead.dateValue >= dateFrom :
       lead.dateValue <= dateTo);

    return (
      matchesSearch &&
      matchesStage &&
      matchesStatus &&
      matchesPriority &&
      matchesDate
    );
  });

  const stats = useMemo(() => {
    return {
      totalAssigned: leads.length,
      quotationPending: leads.filter(
        (l) =>
          l.stage === "quotation_preparation" ||
          l.stage === "quotation_approval"
      ).length,
      quotationSent: leads.filter((l) => l.stage === "quotation_sent").length,
      todayFollowUps: leads.filter((l) => l.nextFollowUp === today).length,
      converted: leads.filter((l) => l.status === "converted").length,
      lost: leads.filter((l) => l.status === "lost").length,
    };
  }, [leads]);

  const addActivity = (
    leadId: string,
    title: string,
    mode: FollowUpMode | "System",
    stage: LeadStage,
    status: LeadStatus,
    note: string
  ) => {
    const newActivity: Activity = {
      id: `A${String(activities.length + 1).padStart(3, "0")}`,
      leadId,
      title,
      mode,
      stage,
      status,
      note,
      date: today,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  const openQuotation = (lead: Lead) => {
    setQuotationLead(lead);
    setQuotationForm({
      quotationAmount: lead.quotationAmount || "",
      selectedPackage: lead.selectedPackage || "",
      itineraryNote: "",
      approvalBy: lead.approvalBy || "Sales Team Leader - North",
    });
  };

  const openFollowUp = (lead: Lead) => {
    setFollowUpLead(lead);
    setFollowUpForm({
      mode: lead.followUpMode,
      status: lead.status,
      nextFollowUp: lead.nextFollowUp,
      note: "",
      selectedPackage: lead.selectedPackage || "",
      quotationAmount: lead.quotationAmount || "",
    });
  };

  const handlePackageSelectFollowUp = (packageTitle: string) => {
    const pkg = readyPackages.find((p) => p.title === packageTitle);
    setFollowUpForm((prev) => ({
      ...prev,
      selectedPackage: packageTitle,
      quotationAmount: pkg?.price || prev.quotationAmount,
    }));
  };

  const openConversion = (lead: Lead) => {
    setConversionLead(lead);
    setConversionForm({
      result: lead.status === "lost" ? "lost" : "converted",
      bookingAmount: lead.quotationAmount,
      lossReason: lead.lossReason,
      note: "",
    });
  };

  const handlePackageSelect = (packageTitle: string) => {
    const selectedPackage = readyPackages.find((pkg) => pkg.title === packageTitle);
    setQuotationForm((prev) => ({
      ...prev,
      selectedPackage: packageTitle,
      quotationAmount: selectedPackage?.price || prev.quotationAmount,
    }));
  };

  const saveQuotation = () => {
    if (!quotationLead) return;

    if (!quotationForm.selectedPackage || !quotationForm.quotationAmount) {
      alert("Please select package and enter quotation amount.");
      return;
    }

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== quotationLead.id) return lead;

        return {
          ...lead,
          stage: "quotation_approval",
          status: "approval_pending",
          quotationAmount: quotationForm.quotationAmount,
          selectedPackage: quotationForm.selectedPackage,
          quotationStatus: "approval_pending",
          approvalBy: quotationForm.approvalBy,
          remarks:
            quotationForm.itineraryNote ||
            "Package selected and quotation sent for approval.",
        };
      })
    );

    addActivity(
      quotationLead.id,
      "Package Quotation Prepared",
      "System",
      "quotation_approval",
      "approval_pending",
      `${quotationForm.selectedPackage} quotation ${quotationForm.quotationAmount} sent to ${quotationForm.approvalBy} for approval.`
    );

    updateLead(quotationLead.id, {
      stage: 'quotation_approval',
      status: 'approval_pending',
      requirements: quotationForm.itineraryNote,
    }).catch((err: any) => console.error('Failed to update quotation:', err));

    setQuotationLead(null);
  };

  const markQuotationSent = (
    lead: Lead,
    sentVia: "Email" | "WhatsApp" | "Email + WhatsApp"
  ) => {
    if (!lead.selectedPackage || !lead.quotationAmount) {
      alert("Please select package and prepare quotation first.");
      return;
    }

    setLeads((prev) =>
      prev.map((item) => {
        if (item.id !== lead.id) return item;

        return {
          ...item,
          stage: "quotation_sent",
          status: "quotation_sent",
          quotationStatus: "sent",
          sentVia,
          nextFollowUp: item.nextFollowUp || today,
          remarks: `Package and quotation sent via ${sentVia}.`,
        };
      })
    );

    addActivity(
      lead.id,
      "Package Shared",
      sentVia === "Email" ? "Email" : "WhatsApp",
      "quotation_sent",
      "quotation_sent",
      `${lead.selectedPackage} package and quotation shared with client via ${sentVia}.`
    );

    updateLead(lead.id, {
      status: 'quotation_sent',
      stage: 'quotation_sent',
    }).catch((err: any) => console.error('Failed to mark quotation sent:', err));
  };

  const saveFollowUp = () => {
    if (!followUpLead) return;

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== followUpLead.id) return lead;

        return {
          ...lead,
          status: followUpForm.status,
          stage:
            followUpForm.status === "converted"
              ? "converted"
              : followUpForm.status === "lost"
              ? "lost"
              : "follow_up",
          followUpMode: followUpForm.mode,
          nextFollowUp: followUpForm.nextFollowUp,
          attempts: lead.attempts + 1,
          lastContact: today,
          remarks: followUpForm.note || lead.remarks,
          selectedPackage: followUpForm.selectedPackage || lead.selectedPackage,
          quotationAmount: followUpForm.quotationAmount || lead.quotationAmount,
        };
      })
    );

    addActivity(
      followUpLead.id,
      "Follow-up Updated",
      followUpForm.mode,
      followUpForm.status === "converted"
        ? "converted"
        : followUpForm.status === "lost"
        ? "lost"
        : "follow_up",
      followUpForm.status,
      followUpForm.note || "Follow-up updated."
    );

    const newStage = followUpForm.status === 'converted' ? 'converted' : followUpForm.status === 'lost' ? 'lost' : 'follow_up';
    // Use dedicated follow-up endpoint
    updateLeadFollowUp(followUpLead.id, {
      follow_up_mode:      followUpForm.mode,
      lead_status:         followUpForm.status,
      next_follow_up_date: followUpForm.nextFollowUp,
      follow_up_note:      followUpForm.note,
    }).catch(() =>
      // Fallback to generic updateLead if new endpoint not available yet
      updateLead(followUpLead.id, {
        status:         followUpForm.status,
        stage:          newStage,
        follow_up_date: followUpForm.nextFollowUp,
        requirements:   followUpForm.note,
      }).catch((err: any) => console.error('Failed to update follow-up:', err))
    );

    setFollowUpLead(null);
  };

  const saveConversion = () => {
    if (!conversionLead) return;

    if (conversionForm.result === "lost" && !conversionForm.lossReason) {
      alert("Please select loss reason.");
      return;
    }

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== conversionLead.id) return lead;

        return {
          ...lead,
          stage: conversionForm.result,
          status: conversionForm.result,
          lossReason:
            conversionForm.result === "lost" ? conversionForm.lossReason : "",
          quotationAmount:
            conversionForm.result === "converted" &&
            conversionForm.bookingAmount
              ? conversionForm.bookingAmount
              : lead.quotationAmount,
          remarks:
            conversionForm.note ||
            (conversionForm.result === "converted"
              ? "Booking confirmed."
              : conversionForm.lossReason),
        };
      })
    );

    addActivity(
      conversionLead.id,
      conversionForm.result === "converted"
        ? "Booking Confirmed"
        : "Lead Marked Lost",
      "System",
      conversionForm.result,
      conversionForm.result,
      conversionForm.note ||
        (conversionForm.result === "converted"
          ? "Booking confirmation updated."
          : conversionForm.lossReason)
    );

    updateLead(conversionLead.id, {
      status: conversionForm.result,
      stage: conversionForm.result,
      requirements: conversionForm.note,
    }).catch((err: any) => console.error('Failed to update conversion:', err));

    setConversionLead(null);
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] overflow-auto">
      <div className="mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Sales Support Executive
            </h1>
            <p className="text-sm text-muted-foreground">
              Select ready packages, prepare quotations, share with clients and
              manage follow-ups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lead, client, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac] w-[260px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Stages</option>
              <option value="enquiry_created">Enquiry Created</option>
              <option value="quotation_preparation">
                Quotation Preparation
              </option>
              <option value="quotation_approval">Quotation Approval</option>
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

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Priority</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        {fetchError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-amber-800">{fetchError}</p>
            <button onClick={fetchLeads} className="text-xs px-3 py-1 bg-amber-600 text-white rounded-lg">Retry</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Total Leads"
          value={stats.totalAssigned}
          subtitle="Assigned workload"
          icon={<ClipboardList className="w-5 h-5 text-[#4b49ac]" />}
        />
        <StatCard
          title="Quote Pending"
          value={stats.quotationPending}
          subtitle="Prepare / approval"
          icon={<FileText className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Quote Sent"
          value={stats.quotationSent}
          subtitle="Email / WhatsApp"
          icon={<Send className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          title="Today Follow-ups"
          value={stats.todayFollowUps}
          subtitle="Action required"
          icon={<CalendarDays className="w-5 h-5 text-orange-600" />}
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          subtitle="Bookings confirmed"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Lost"
          value={stats.lost}
          subtitle="Closed lost"
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Lead Pipeline</h3>
            <p className="text-xs text-muted-foreground">
              Showing {filteredLeads.length} records
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
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Package
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Quotation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Follow-up
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Action
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
                          {lead.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.source}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground flex items-center gap-1 flex-wrap">
                          {lead.client}
                          {lead.aiGenerated && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">AI Extracted</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.phone}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          {lead.destination}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.travellers} Pax · {lead.travelDate}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          {lead.selectedPackage || "Not selected"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">
                          {lead.quotationAmount || "Not prepared"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatText(lead.quotationStatus)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          {lead.nextFollowUp || "Not set"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Attempts: {lead.attempts}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            lead.priority
                          )}`}
                        >
                          {lead.priority}
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewLead(lead)}
                            className="p-2 rounded-lg hover:bg-[#4b49ac]/10 text-[#4b49ac]"
                            title="View Lead"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Package / Prepare Quote button — hidden for now, code kept for future use
                          <button
                            onClick={() => openQuotation(lead)}
                            className="p-2 rounded-lg hover:bg-amber-100 text-amber-700"
                            title="Select Package / Prepare Quote"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          */}

                          {/* Share Package button — hidden for now, code kept for future use
                          <button
                            onClick={() =>
                              markQuotationSent(lead, "Email + WhatsApp")
                            }
                            className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-700"
                            title="Share Package"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          */}

                          <button
                            onClick={() => openFollowUp(lead)}
                            className="px-3 py-2 rounded-lg bg-[#4b49ac] text-white text-xs hover:bg-[#4b49ac]/90"
                          >
                            Follow-up
                          </button>

                          <button
                            onClick={() => openConversion(lead)}
                            className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700"
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
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

        <RecentActivities activities={activities} leads={leads} />
      </div>

      {quotationLead && (
        <QuotationModal
          lead={quotationLead}
          form={quotationForm}
          setForm={setQuotationForm}
          onClose={() => setQuotationLead(null)}
          onSave={saveQuotation}
          onPackageSelect={handlePackageSelect}
          packages={readyPackages}
          progress={getLeadProgress(quotationLead)}
        />
      )}

      {followUpLead && (
        <FollowUpModal
          lead={followUpLead}
          form={followUpForm}
          setForm={setFollowUpForm}
          onClose={() => setFollowUpLead(null)}
          onSave={saveFollowUp}
          progress={getLeadProgress(followUpLead)}
          packages={readyPackages}
          onPackageSelect={handlePackageSelectFollowUp}
        />
      )}

      {conversionLead && (
        <ConversionModal
          lead={conversionLead}
          form={conversionForm}
          setForm={setConversionForm}
          onClose={() => setConversionLead(null)}
          onSave={saveConversion}
          progress={getLeadProgress(conversionLead)}
        />
      )}

      {viewLead && (
        <ViewLeadDrawer
          lead={viewLead}
          activities={activities}
          onClose={() => setViewLead(null)}
          progress={getLeadProgress(viewLead)}
        />
      )}
    </div>
  );
}

function QuotationModal({
  lead,
  form,
  setForm,
  onClose,
  onSave,
  onPackageSelect,
  progress,
  packages,
}: {
  lead: Lead;
  form: {
    quotationAmount: string;
    selectedPackage: string;
    itineraryNote: string;
    approvalBy: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      quotationAmount: string;
      selectedPackage: string;
      itineraryNote: string;
      approvalBy: string;
    }>
  >;
  onClose: () => void;
  onSave: () => void;
  onPackageSelect: (packageTitle: string) => void;
  progress: number;
  packages: ReadyPackage[];
}) {
  const selectedPackage = packages.find(
    (pkg) => pkg.title === form.selectedPackage
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Select Package & Prepare Quotation
            </h3>
            <p className="text-xs text-muted-foreground">
              {lead.client} · {lead.destination}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(92vh-145px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Info label="Client Budget" value={lead.budget} />
            <Info label="Travel Date" value={lead.travelDate} />
            <Info label="Travellers" value={`${lead.travellers} Pax`} />
            <Info label="Current Progress" value={`${progress}%`} />
          </div>

          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-1 block">
              Select Package *
            </label>
            <select
              value={form.selectedPackage}
              onChange={(e) => onPackageSelect(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="">Select ready-made package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.title}>
                  {pkg.title} - {pkg.duration} - {pkg.price}
                </option>
              ))}
            </select>
          </div>

          {selectedPackage && (
            <div className="mb-4 p-4 bg-[#f8fafc] rounded-lg border border-border">
              <h4 className="font-semibold text-foreground">
                {selectedPackage.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedPackage.destination} · {selectedPackage.duration}
              </p>
              <p className="text-sm font-semibold text-[#4b49ac] mt-1">
                {selectedPackage.price}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quotation Amount *"
              value={form.quotationAmount}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  quotationAmount: value,
                }))
              }
              placeholder="₹1,24,500"
            />

            {/* Send Approval To — hidden for now
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Send Approval To
              </label>
              <select
                value={form.approvalBy}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    approvalBy: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              >
                <option>Sales Team Leader - North</option>
                <option>Sales Team Leader - South</option>
                <option>Sales Team Leader - West</option>
              </select>
            </div>
            */}
          </div>

          <div className="mt-4">
            <label className="text-sm text-muted-foreground mb-1 block">
              Customisation Note
            </label>
            <textarea
              rows={4}
              value={form.itineraryNote}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  itineraryNote: e.target.value,
                }))
              }
              placeholder="Any special customisation, hotel upgrade, meal preference, pickup request..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm bg-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm hover:bg-[#4b49ac]/90"
          >
            <Save className="w-4 h-4" />
            Send For Approval
          </button>
        </div>
      </div>
    </div>
  );
}

function RecentActivities({
  activities,
  leads,
}: {
  activities: Activity[];
  leads: Lead[];
}) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Activities</h3>
        <p className="text-xs text-muted-foreground">
          Latest quotation, package sharing and follow-up records
        </p>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {activities.map((activity) => {
          const lead = leads.find((l) => l.id === activity.leadId);

          return (
            <div
              key={activity.id}
              className="border border-border rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lead?.client || activity.leadId} · {activity.date} · {" "}
                    {activity.time}
                  </p>
                </div>

                <ModeBadge mode={activity.mode} />
              </div>

              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-2 ${getStatusColor(
                  activity.status
                )}`}
              >
                {formatText(activity.status)}
              </span>

              <p className="text-xs text-muted-foreground">{activity.note}</p>
            </div>
          );
        })}

        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No recent activity found.
          </p>
        )}
      </div>
    </div>
  );
}

function FollowUpModal({
  lead,
  form,
  setForm,
  onClose,
  onSave,
  progress,
  packages,
  onPackageSelect,
}: {
  lead: Lead;
  form: {
    mode: FollowUpMode;
    status: LeadStatus;
    nextFollowUp: string;
    note: string;
    selectedPackage: string;
    quotationAmount: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      mode: FollowUpMode;
      status: LeadStatus;
      nextFollowUp: string;
      note: string;
      selectedPackage: string;
      quotationAmount: string;
    }>
  >;
  onClose: () => void;
  onSave: () => void;
  progress: number;
  packages: ReadyPackage[];
  onPackageSelect: (packageTitle: string) => void;
}) {
  const selectedPkg = packages.find((p) => p.title === form.selectedPackage);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Update Follow-up
            </h3>
            <p className="text-xs text-muted-foreground">
              {lead.client} · {lead.destination}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(92vh-145px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Info label="Phone" value={lead.phone} />
            <Info label="Email" value={lead.email} />
            <Info label="Client Budget" value={lead.budget} />
            <Info label="Auto Progress" value={`${progress}%`} />
          </div>

          {/* Select Package */}
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-1 block">
              Select Package *
            </label>
            <select
              value={form.selectedPackage}
              onChange={(e) => onPackageSelect(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="">Select ready-made package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.title}>
                  {pkg.title} - {pkg.duration} - {pkg.price}
                </option>
              ))}
            </select>
          </div>

          {/* Package preview card */}
          {selectedPkg && (
            <div className="mb-4 p-4 bg-[#f8fafc] rounded-lg border border-border">
              <h4 className="font-semibold text-foreground">{selectedPkg.title}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedPkg.destination} · {selectedPkg.duration}
              </p>
              <p className="text-sm font-semibold text-[#4b49ac] mt-1">
                {selectedPkg.price}
              </p>
            </div>
          )}

          {/* Quotation Amount */}
          <div className="mb-4">
            <Input
              label="Quotation Amount *"
              value={form.quotationAmount}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, quotationAmount: value }))
              }
              placeholder="₹1,24,500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Follow-up Mode
              </label>
              <select
                value={form.mode}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mode: e.target.value as FollowUpMode,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              >
                <option value="Call">Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Lead Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as LeadStatus,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              >
                <option value="contacted">Contacted</option>
                <option value="follow_up">Follow Up</option>
                <option value="quotation_pending">Quotation Pending</option>
                <option value="quotation_sent">Quotation Sent</option>
                <option value="not_reachable">Not Reachable</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Next Follow-up Date
              </label>
              <input
                type="date"
                value={form.nextFollowUp}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    nextFollowUp: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-muted-foreground mb-1 block">
              Follow-up Note
            </label>
            <textarea
              rows={4}
              value={form.note}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
              placeholder="Write call discussion, WhatsApp response, client requirement or next action..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm bg-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm hover:bg-[#4b49ac]/90"
          >
            <Save className="w-4 h-4" />
            Save Follow-up
          </button>
        </div>
      </div>
    </div>
  );
}

function ConversionModal({
  lead,
  form,
  setForm,
  onClose,
  onSave,
  progress,
}: {
  lead: Lead;
  form: {
    result: "converted" | "lost";
    bookingAmount: string;
    lossReason: string;
    note: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      result: "converted" | "lost";
      bookingAmount: string;
      lossReason: string;
      note: string;
    }>
  >;
  onClose: () => void;
  onSave: () => void;
  progress: number;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Close Lead
            </h3>
            <p className="text-xs text-muted-foreground">
              Update booking confirmation or loss reason.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <Info label="Client" value={lead.client} />
          <Info label="Destination" value={lead.destination} />
          <Info label="Selected Package" value={lead.selectedPackage || "N/A"} />
          <Info label="Current Progress" value={`${progress}%`} />

          <div className="mt-4">
            <label className="text-sm text-muted-foreground mb-1 block">
              Result
            </label>
            <select
              value={form.result}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  result: e.target.value as "converted" | "lost",
                }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="converted">Converted / Booking Confirmed</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {form.result === "converted" ? (
            <div className="mt-4">
              <label className="text-sm text-muted-foreground mb-1 block">
                Booking Amount
              </label>
              <input
                value={form.bookingAmount}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    bookingAmount: e.target.value,
                  }))
                }
                placeholder="₹1,24,500"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              />
            </div>
          ) : (
            <div className="mt-4">
              <label className="text-sm text-muted-foreground mb-1 block">
                Loss Reason
              </label>
              <select
                value={form.lossReason}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    lossReason: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              >
                <option value="">Select Reason</option>
                <option>Price too high</option>
                <option>Client postponed travel</option>
                <option>Booked with competitor</option>
                <option>Not reachable</option>
                <option>Not interested</option>
                <option>Other</option>
              </select>
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm text-muted-foreground mb-1 block">
              Final Note
            </label>
            <textarea
              rows={4}
              value={form.note}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
              placeholder="Add booking confirmation details or loss remarks..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm bg-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewLeadDrawer({
  lead,
  activities,
  onClose,
  progress,
}: {
  lead: Lead;
  activities: Activity[];
  onClose: () => void;
  progress: number;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-lg h-full overflow-auto p-6">
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 flex-wrap">
              {lead.client}
              {lead.aiGenerated && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">AI Extracted</span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">Lead ID: {lead.id}</p>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <Info label="Phone" value={lead.phone} />
          <Info label="Email" value={lead.email} />
          <Info label="Destination" value={lead.destination} />
          <Info label="Travel Date" value={lead.travelDate} />
          <Info label="Travellers" value={`${lead.travellers} Pax`} />
          <Info label="Budget" value={lead.budget} />
          <Info
            label="Selected Package"
            value={lead.selectedPackage || "Not selected"}
          />
          <Info
            label="Quotation"
            value={lead.quotationAmount || "Not prepared"}
          />
          <Info
            label="Quotation Status"
            value={formatText(lead.quotationStatus)}
          />
          <Info label="Sent Via" value={lead.sentVia} />
          <Info label="Assigned By" value={lead.assignedBy} />
          <Info
            label="Next Follow-up"
            value={lead.nextFollowUp || "Not set"}
          />
          <Info label="Attempts" value={String(lead.attempts)} />
          <Info label="Priority" value={lead.priority} />
          <Info label="Stage" value={formatText(lead.stage)} />
          <Info label="Status" value={formatText(lead.status)} />

          <div>
            <p className="text-muted-foreground mb-1">Auto Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-[#4b49ac]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
          </div>

          <div>
            <p className="text-muted-foreground mb-1">Latest Remarks</p>
            <p className="p-3 bg-[#f8fafc] rounded-lg">
              {lead.remarks || "No remarks added."}
            </p>
          </div>

          <div className="pt-4">
            <h4 className="font-semibold text-foreground mb-3">
              Activity Timeline
            </h4>

            <div className="space-y-3">
              {activities
                .filter((activity) => activity.leadId === lead.id)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="border border-border rounded-lg p-3"
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

                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-2 ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {formatText(activity.status)}
                    </span>

                    <p className="text-xs text-muted-foreground">
                      {activity.note}
                    </p>
                  </div>
                ))}

              {activities.filter((activity) => activity.leadId === lead.id)
                .length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No activity recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
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

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
      />
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
