import { useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Briefcase,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Download,
  Eye,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import { SalesTeamMemberHistory } from "./SalesTeamMemberHistory";

const LEADS = [
  {
    id: "L001",
    client: "Arjun Sharma",
    phone: "9876543210",
    email: "arjun@test.com",
    dest: "Shimla-Manali",
    status: "assigned",
    assignedTo: "E1",
    assigned: "Priya K",
    sla: "1h 20m",
    budget: "₹1.2L",
    source: "WhatsApp",
    date: "Today 09:12",
    dateValue: "2026-05-20",
    priority: "High",
    stage: "follow_up",
    outcome: "hot",
    progress: 40,
    nextFollowUp: "2026-05-21",
    remarks: "Client interested, needs hotel options.",
  },
  {
    id: "L002",
    client: "Meera Gupta",
    phone: "9876543211",
    email: "meera@test.com",
    dest: "Kerala 7N",
    status: "quoted",
    assignedTo: "E2",
    assigned: "Rahul M",
    sla: "OK",
    budget: "₹2.8L",
    source: "Agency",
    date: "Today 08:45",
    dateValue: "2026-05-20",
    priority: "Normal",
    stage: "quotation",
    outcome: "ongoing",
    progress: 70,
    nextFollowUp: "2026-05-22",
    remarks: "Quotation shared.",
  },
  {
    id: "L003",
    client: "Dev Patel",
    phone: "9876543212",
    email: "dev@test.com",
    dest: "Goa Package",
    status: "new",
    assignedTo: "",
    assigned: "—",
    sla: "BREACH",
    budget: "₹85K",
    source: "Campaign",
    date: "Today 10:01",
    dateValue: "2026-05-20",
    priority: "Urgent",
    stage: "new",
    outcome: "pending",
    progress: 0,
    nextFollowUp: "",
    remarks: "",
  },
  {
    id: "L004",
    client: "Sneha Rao",
    phone: "9876543213",
    email: "sneha@test.com",
    dest: "Rajasthan Tour",
    status: "converted",
    assignedTo: "E3",
    assigned: "Amit S",
    sla: "OK",
    budget: "₹3.5L",
    source: "Field",
    date: "Yesterday",
    dateValue: "2026-05-19",
    priority: "High",
    stage: "booking",
    outcome: "success",
    progress: 100,
    nextFollowUp: "",
    remarks: "Booking completed.",
  },
  {
    id: "L005",
    client: "Rohan Das",
    phone: "9876543214",
    email: "rohan@test.com",
    dest: "Andaman 5N",
    status: "lost",
    assignedTo: "E1",
    assigned: "Priya K",
    sla: "—",
    budget: "₹1.8L",
    source: "WhatsApp",
    date: "Yesterday",
    dateValue: "2026-05-19",
    priority: "Normal",
    stage: "closed",
    outcome: "lost",
    progress: 100,
    nextFollowUp: "",
    remarks: "Client dropped plan.",
  },
];

const QUOTATIONS = [
  {
    id: "Q041",
    client: "Arjun Sharma",
    pkg: "Shimla-Manali 6N7D",
    amount: "₹1,24,500",
    status: "pending_approval",
    created: "2h ago",
  },
  {
    id: "Q042",
    client: "Meera Gupta",
    pkg: "Kerala Backwaters 7N",
    amount: "₹2,84,000",
    status: "sent",
    created: "5h ago",
  },
];

const TEAM_MEMBERS = [
  { id: "E1", name: "Priya K", role: "Field Exec" },
  { id: "E2", name: "Rahul M", role: "Field Exec" },
  { id: "E3", name: "Amit S", role: "Field Exec" },
  { id: "E4", name: "Ravi K", role: "Field Exec" },
];

const today = new Date().toISOString().split("T")[0];

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    assigned: "bg-cyan-100 text-cyan-700",
    quoted: "bg-amber-100 text-amber-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
    BREACH: "bg-red-100 text-red-700",
    OK: "bg-green-100 text-green-700",
  };

  return statusMap[status] || "bg-gray-100 text-gray-700";
};

const getSLAColor = (sla: string) => {
  if (sla === "BREACH") return "text-red-600 font-semibold";
  if (sla === "OK") return "text-green-600 font-semibold";
  return "text-amber-600 font-semibold";
};

export function SalesTeamLeader() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMember, setFilterMember] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [leadsData, setLeadsData] = useState(LEADS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedMemberData = TEAM_MEMBERS.find((m) => m.id === selectedMember);

  const stats = useMemo(() => {
    return {
      todaysNewLeads: leadsData.filter((l) => l.dateValue === today).length,
      todaysAssignedLeads: leadsData.filter(
        (l) => l.dateValue === today && l.assignedTo
      ).length,
      unassignedLeads: leadsData.filter((l) => l.status === "new").length,
      teamActive: TEAM_MEMBERS.length,
      pendingApproval: QUOTATIONS.filter(
        (q) => q.status === "pending_approval"
      ).length,
      slaBreaches: leadsData.filter((l) => l.sla === "BREACH").length,
    };
  }, [leadsData]);

  const filteredLeads = leadsData.filter((lead) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      lead.client.toLowerCase().includes(search) ||
      lead.dest.toLowerCase().includes(search) ||
      lead.id.toLowerCase().includes(search);

    const matchesStatus =
      filterStatus === "all" || lead.status === filterStatus;

    const matchesMember =
      filterMember === "all" || lead.assignedTo === filterMember;

    const matchesDate = !dateFilter || lead.dateValue === dateFilter;

    return matchesSearch && matchesStatus && matchesMember && matchesDate;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadSuccess("");
    setUploadedFileName(file.name);

    const isValid =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv");

    if (!isValid) {
      setUploadError("Please upload a valid Excel or CSV file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

        const mappedLeads = jsonData.map((row, index) => {
          const importedDate =
            row["Date"] || row["date"] || new Date().toISOString().split("T")[0];

          return {
            id: row["ID"] || row["id"] || `L${1000 + index}`,
            client: row["Client"] || row["Client Name"] || "",
            phone: row["Phone"] || row["Phone Number"] || "",
            email: row["Email"] || "",
            dest: row["Destination"] || "",
            status: row["Status"] || "new",
            assignedTo: row["Assigned Member ID"] || "",
            assigned: row["Assigned To"] || "—",
            sla: row["SLA"] || "OK",
            budget: row["Budget"] || "₹0",
            source: row["Source"] || "Excel Import",
            date: importedDate,
            dateValue: importedDate,
            priority: row["Priority"] || "Normal",
            stage: row["Stage"] || "new",
            outcome: row["Outcome"] || "pending",
            progress: Number(row["Progress"] || 0),
            nextFollowUp: row["Next Follow Up"] || "",
            remarks: row["Remarks"] || "",
          };
        });

        setLeadsData((prev) => [...prev, ...mappedLeads]);
        setUploadSuccess(`Successfully imported ${mappedLeads.length} leads.`);
        setShowUploadModal(false);
      } catch (error) {
        console.error(error);
        setUploadError("Failed to parse file. Please check file format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        ID: "L001",
        Client: "Client Name",
        Phone: "9876543210",
        Email: "client@email.com",
        Destination: "Shimla-Manali",
        Status: "new",
        "Assigned Member ID": "E1",
        "Assigned To": "Priya K",
        SLA: "OK",
        Budget: "₹1,00,000",
        Source: "Field Visit",
        Date: today,
        Priority: "Normal",
        Stage: "new",
        Outcome: "pending",
        Progress: 0,
        "Next Follow Up": today,
        Remarks: "Client remarks",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "leads_template.xlsx");
  };

  const exportLeads = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `leads_${today}.xlsx`);
  };

  if (openHistory && selectedMemberData) {
    return (
      <SalesTeamMemberHistory
        member={selectedMemberData}
        leads={leadsData}
        onBack={() => setOpenHistory(false)}
      />
    );
  }

  return (
    <div className="flex-1 bg-[#f5f7ff] overflow-auto">
      <div className="mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Sales Team Leader
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage new leads, assignments, team performance and quotations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lead, client, destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac] w-[260px]"
              />
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />

            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Members</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Status</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-20">
                  <div className="p-2">
                    {[
                      ["All Status", "all"],
                      ["New", "new"],
                      ["Assigned", "assigned"],
                      ["Quoted", "quoted"],
                      ["Converted", "converted"],
                      ["Lost", "lost"],
                    ].map(([label, value]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setFilterStatus(value);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent ${
                          filterStatus === value
                            ? "bg-[#4b49ac]/10 text-[#4b49ac]"
                            : "text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Lead</span>
            </button> */}
            <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90"
            >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Lead</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Import</span>
            </button>

            <button
              onClick={exportLeads}
              className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg hover:bg-sidebar-accent"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between">
            <p className="text-sm text-green-800">{uploadSuccess}</p>
            <button onClick={() => setUploadSuccess("")}>
              <X className="w-4 h-4 text-green-700" />
            </button>
          </div>
        )}

        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between">
            <p className="text-sm text-red-800">{uploadError}</p>
            <button onClick={() => setUploadError("")}>
              <X className="w-4 h-4 text-red-700" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[
          ["Today's Leads", stats.todaysNewLeads, Briefcase],
          ["Today's Assigned", stats.todaysAssignedLeads, Users],
          ["Unassigned", stats.unassignedLeads, AlertCircle],
          ["Team Active", stats.teamActive, CheckCircle],
          ["Pending Approval", stats.pendingApproval, TrendingUp],
          ["SLA Breaches", stats.slaBreaches, AlertCircle],
        ].map(([label, value, Icon]: any) => (
          <div
            key={label}
            className="bg-white p-4 rounded-lg border border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="w-5 h-5 text-[#4b49ac]" />
            </div>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-foreground font-semibold mb-1">Team Members</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Click member to view today's tasks and full lead history.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {TEAM_MEMBERS.map((m) => {
            const memberLeads = leadsData.filter((l) => l.assignedTo === m.id);
            const todayAssigned = memberLeads.filter(
              (l) => l.dateValue === today
            ).length;
            const converted = memberLeads.filter(
              (l) => l.status === "converted"
            ).length;
            const pending = memberLeads.filter(
              (l) => !["converted", "lost"].includes(l.status)
            ).length;

            return (
              <div
                key={m.id}
                className={`bg-white rounded-lg border p-4 shadow-sm ${
                  selectedMember === m.id
                    ? "border-[#4b49ac] ring-2 ring-[#4b49ac]/20"
                    : "border-border"
                }`}
              >
                <button
                  onClick={() => setSelectedMember(m.id)}
                  className="w-full text-left"
                >
                  <h4 className="font-semibold text-foreground">{m.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{m.role}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#f5f7ff] p-2 rounded">
                      <p className="text-muted-foreground">Today</p>
                      <p className="font-semibold">{todayAssigned}</p>
                    </div>
                    <div className="bg-[#f5f7ff] p-2 rounded">
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">{memberLeads.length}</p>
                    </div>
                    <div className="bg-[#f5f7ff] p-2 rounded">
                      <p className="text-muted-foreground">Pending</p>
                      <p className="font-semibold">{pending}</p>
                    </div>
                    <div className="bg-[#f5f7ff] p-2 rounded">
                      <p className="text-muted-foreground">Converted</p>
                      <p className="font-semibold">{converted}</p>
                    </div>
                  </div>
                </button>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setSelectedMember(m.id)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-border hover:bg-sidebar-accent"
                  >
                    View Today
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMember(m.id);
                      setOpenHistory(true);
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90"
                  >
                    See History
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMember && (
        <div className="bg-white rounded-lg border border-border p-4 mb-6">
          <div className="flex justify-between mb-3">
            <div>
              <h4 className="font-semibold">
                {TEAM_MEMBERS.find((m) => m.id === selectedMember)?.name} -
                Today's Assigned Leads
              </h4>
              <p className="text-xs text-muted-foreground">
                Quick view of today's work.
              </p>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-sm text-muted-foreground"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {leadsData
              .filter(
                (l) => l.assignedTo === selectedMember && l.dateValue === today
              )
              .map((lead) => (
                <div
                  key={lead.id}
                  className="border border-border rounded-lg p-3"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-sm">{lead.client}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.dest} · {lead.source}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="h-2 rounded-full bg-[#4b49ac]"
                      style={{ width: `${lead.progress}%` }}
                    />
                  </div>
                </div>
              ))}

            {leadsData.filter(
              (l) => l.assignedTo === selectedMember && l.dateValue === today
            ).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No leads assigned today.
              </p>
            )}
          </div>
        </div>
      )}

      {showForm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Add New Lead</h3>
          <p className="text-xs text-muted-foreground">
            Enter client travel enquiry details and assign to team member if required.
          </p>
        </div>

        <button
          onClick={() => setShowForm(false)}
          className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            "Client Name",
            "Phone Number",
            "Email Address",
            "Destination",
            "Approx Budget",
          ].map((label) => (
            <div key={label}>
              <label className="text-sm text-muted-foreground mb-1 block">
                {label}
              </label>
              <input
                type={
                  label === "Email Address"
                    ? "email"
                    : label === "Phone Number"
                    ? "tel"
                    : "text"
                }
                placeholder={label}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Travel Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Days
            </label>
            <input
              type="number"
              min={1}
              placeholder="Days"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Nights
            </label>
            <input
              type="number"
              min={1}
              placeholder="Nights"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              No. of Travellers
            </label>
            <input
              type="number"
              min={1}
              placeholder="Travellers"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Lead Source
            </label>
            <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]">
              <option>Field Visit</option>
              <option>WhatsApp</option>
              <option>Campaign</option>
              <option>Reference</option>
              <option>Existing Agent</option>
              <option>Social Media</option>
              <option>Website</option>
              <option>B2B Portal</option>
              <option>Exhibition/Event</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Priority
            </label>
            <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]">
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Assign To
            </label>
            <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]">
              <option value="">Unassigned</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Follow-up Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-muted-foreground mb-1 block">
            Remarks / Special Requirements
          </label>
          <textarea
            rows={4}
            placeholder="Add client requirements, hotel preference, budget notes, etc."
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-[#f8fafc]">
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 border border-border rounded-lg text-sm text-foreground bg-white hover:bg-sidebar-accent"
        >
          Cancel
        </button>

        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm hover:bg-[#4b49ac]/90"
        >
          Submit Lead
        </button>
      </div>
    </div>
  </div>
)}

      <div className="grid xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-border shadow-sm p-6">
          <h3 className="font-semibold mb-1">Unassigned Lead Queue</h3>
          <p className="text-xs text-muted-foreground mb-4">Action required</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="px-3 py-3 text-left">ID</th>
                  <th className="px-3 py-3 text-left">Client</th>
                  <th className="px-3 py-3 text-left">Destination</th>
                  <th className="px-3 py-3 text-left">Budget</th>
                  <th className="px-3 py-3 text-left">SLA</th>
                  <th className="px-3 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {leadsData
                  .filter((l) => l.status === "new")
                  .map((lead) => (
                    <tr key={lead.id} className="border-t border-border">
                      <td className="px-3 py-3">{lead.id}</td>
                      <td className="px-3 py-3">
                        <p className="font-medium">{lead.client}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.source}
                        </p>
                      </td>
                      <td className="px-3 py-3">{lead.dest}</td>
                      <td className="px-3 py-3 font-semibold text-teal-600">
                        {lead.budget}
                      </td>
                      <td className={`px-3 py-3 ${getSLAColor(lead.sla)}`}>
                        {lead.sla}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="px-3 py-2 text-xs rounded-lg bg-[#4b49ac] text-white"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {selectedLeadId && (
            <div className="mt-4 p-4 rounded-lg border border-[#4b49ac]/20 bg-[#f8faff]">
              <p className="text-sm font-semibold text-[#4b49ac] mb-3">
                Assign Lead: {selectedLeadId}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm">
                  {TEAM_MEMBERS.map((m) => (
                    <option key={m.id}>{m.name}</option>
                  ))}
                </select>

                <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm">
                  <option>Priority: Normal</option>
                  <option>Priority: High</option>
                  <option>Priority: Urgent</option>
                </select>

                <button
                  onClick={() => setSelectedLeadId(null)}
                  className="px-4 py-2 text-sm bg-[#4b49ac] text-white rounded-lg"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-border shadow-sm p-6">
          <h3 className="font-semibold mb-1">Filtered Leads</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Result based on selected filters.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="px-3 py-3 text-left">Lead</th>
                  <th className="px-3 py-3 text-left">Assigned</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left">Progress</th>
                  <th className="px-3 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border">
                    <td className="px-3 py-3">
                      <p className="font-medium">{lead.client}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.id} · {lead.dest}
                      </p>
                    </td>
                    <td className="px-3 py-3">{lead.assigned}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[#4b49ac]"
                          style={{ width: `${lead.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-[#4b49ac]">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">
                No leads found.
              </p>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">Import Leads</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-[#4b49ac]"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload Excel / CSV</p>
              <p className="text-xs text-muted-foreground">
                Supported: .xlsx, .xls, .csv
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadedFileName && (
              <p className="text-sm text-green-700 mt-3">{uploadedFileName}</p>
            )}

            <button
              onClick={downloadTemplate}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}