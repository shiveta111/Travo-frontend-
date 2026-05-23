import React, { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { getAllLeads, createLead, mapApiLead } from "../../api/leads.api";
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
  CalendarDays,
  UserPlus,
} from "lucide-react";
import * as XLSX from "xlsx";

type LeadStatus =
  | "new"
  | "submitted_to_leader"
  | "assigned"
  | "quoted"
  | "follow_up"
  | "converted"
  | "lost";

type LeadPriority = "Normal" | "High" | "Urgent";

type Lead = {
  id: string;
  client: string;
  phone: string;
  email: string;
  dest: string;
  travelDate: string;
  days: number | string;
  nights: number | string;
  travellers: number | string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedLeader: string;
  sla: string;
  budget: string;
  source: string;
  date: string;
  dateValue: string;
  progress: number;
  followUpDate: string;
  remarks: string;
};

const TEAM_LEADERS = [
  { id: "TL1", name: "Sales Team Leader - North" },
  { id: "TL2", name: "Sales Team Leader - South" },
  { id: "TL3", name: "Sales Team Leader - West" },
];

const today = new Date().toISOString().split("T")[0];

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    submitted_to_leader: "bg-purple-100 text-purple-700",
    assigned: "bg-cyan-100 text-cyan-700",
    quoted: "bg-amber-100 text-amber-700",
    follow_up: "bg-orange-100 text-orange-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
    BREACH: "bg-red-100 text-red-700",
    OK: "bg-green-100 text-green-700",
  };

  return statusMap[status] || "bg-gray-100 text-gray-700";
};

const getPriorityColor = (priority: string) => {
  const priorityMap: Record<string, string> = {
    Normal: "bg-gray-100 text-gray-700",
    High: "bg-amber-100 text-amber-700",
    Urgent: "bg-red-100 text-red-700",
  };

  return priorityMap[priority] || "bg-gray-100 text-gray-700";
};

const getSLAColor = (sla: string) => {
  if (sla === "BREACH") return "text-red-600 font-semibold";
  if (sla === "OK") return "text-green-600 font-semibold";
  return "text-amber-600 font-semibold";
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").toUpperCase();
};

export function FieldSalesExecutive() {
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // ─── Fetch leads from API ───────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      const data = await getAllLeads();
      // API may return { leads: [...] } or a plain array — handle both
      const rawList: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.leads)
        ? data.leads
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setLeadsData(rawList.map(mapApiLead));
    } catch (err: any) {
      console.error("Failed to fetch leads:", err);
      setFetchError(
        err?.response?.data?.message || "Failed to load leads. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);
  // ───────────────────────────────────────────────────────────────────────────

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [leadForm, setLeadForm] = useState({
    client: "",
    phone: "",
    email: "",
    dest: "",
    travelDate: "",
    days: "",
    nights: "",
    travellers: "",
    budget: "",
    source: "Field Visit",
    priority: "Normal" as LeadPriority,
    assignedLeader: "Auto Assign Pending",
    followUpDate: "",
    remarks: "",
  });

  const stats = useMemo(() => {
    return {
      todayLeads: leadsData.filter((l) => l.dateValue === today).length,
      totalLeads: leadsData.length,
      submittedToLeader: leadsData.filter(
        (l) => l.status === "submitted_to_leader"
      ).length,
      activeLeads: leadsData.filter(
        (l) => !["lost", "converted"].includes(l.status)
      ).length,
      conversions: leadsData.filter((l) => l.status === "converted").length,
      slaBreaches: leadsData.filter((l) => l.sla === "BREACH").length,
    };
  }, [leadsData]);

  const filteredLeads = leadsData.filter((lead) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      lead.client.toLowerCase().includes(search) ||
      lead.dest.toLowerCase().includes(search) ||
      lead.id.toLowerCase().includes(search) ||
      lead.phone.toLowerCase().includes(search);

    const matchesStatus =
      filterStatus === "all" || lead.status === filterStatus;

    const matchesSource =
      filterSource === "all" || lead.source === filterSource;

    const matchesPriority =
      filterPriority === "all" || lead.priority === filterPriority;

    const matchesDate = !dateFilter || lead.dateValue === dateFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSource &&
      matchesPriority &&
      matchesDate
    );
  });

  const handleLeadInputChange = (
    field: keyof typeof leadForm,
    value: string
  ) => {
    setLeadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetLeadForm = () => {
    setLeadForm({
      client: "",
      phone: "",
      email: "",
      dest: "",
      travelDate: "",
      days: "",
      nights: "",
      travellers: "",
      budget: "",
      source: "Field Visit",
      priority: "Normal",
      assignedLeader: "Auto Assign Pending",
      followUpDate: "",
      remarks: "",
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLead = async () => {
    if (!leadForm.client || !leadForm.phone || !leadForm.dest) {
      alert("Please fill Client Name, Phone Number and Destination.");
      return;
    }

    try {
      setIsSubmitting(true);
      const responseData = await createLead(leadForm);

      // API may return the new lead object or wrap it — handle both
      const rawLead: any =
        responseData?.lead ??
        responseData?.data ??
        responseData;

      if (rawLead && rawLead.id) {
        // Add the freshly-created lead (mapped) to the top of the list
        setLeadsData((prev) => [mapApiLead(rawLead), ...prev]);
      } else {
        // Fallback: re-fetch all leads to reflect server state
        await fetchLeads();
      }

      setUploadSuccess("Lead submitted successfully to Team Leader.");
      setShowAddLeadModal(false);
      resetLeadForm();
      setTimeout(() => setUploadSuccess(""), 4000);
    } catch (err: any) {
      console.error("Failed to create lead:", err);
      setUploadError(
        err?.response?.data?.message || "Failed to submit lead. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadSuccess("");

    const isValidFile =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv");

    if (!isValidFile) {
      setUploadError("Please upload a valid Excel file (.xlsx, .xls) or CSV.");
      return;
    }

    setUploadedFileName(file.name);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

        const mappedLeads: Lead[] = jsonData.map((row, index) => {
          const importedDate =
            row["Date"] ||
            row["date"] ||
            new Date().toISOString().split("T")[0];

          return {
            id: row["ID"] || row["id"] || `L${1000 + index}`,
            client: row["Client"] || row["client"] || row["Client Name"] || "",
            phone: row["Phone"] || row["Phone Number"] || "",
            email: row["Email"] || row["Email Address"] || "",
            dest:
              row["Destination"] || row["destination"] || row["Dest"] || "",
            travelDate: row["Travel Date"] || "",
            days: row["Days"] || "",
            nights: row["Nights"] || "",
            travellers: row["Travellers"] || row["No. of Travellers"] || "",
            status:
              row["Status"] || row["status"] || "submitted_to_leader",
            priority: row["Priority"] || "Normal",
            assignedLeader:
              row["Assigned Leader"] || row["Team Leader"] || "Auto Assign Pending",
            sla: row["SLA"] || row["sla"] || "OK",
            budget: row["Budget"] || row["budget"] || "₹0",
            source: row["Source"] || row["source"] || "Excel Import",
            date: importedDate,
            dateValue: importedDate,
            progress: Number(row["Progress"] || 20),
            followUpDate: row["Follow-up Date"] || "",
            remarks: row["Remarks"] || "",
          };
        });

        setLeadsData((prev) => [...mappedLeads, ...prev]);
        setUploadSuccess(
          `Successfully imported ${mappedLeads.length} leads from ${file.name}.`
        );
        setShowUploadModal(false);
        setUploadProgress(0);
        setUploadedFileName("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setTimeout(() => setUploadSuccess(""), 5000);
      } catch (error) {
        console.error("Excel parse error:", error);
        setUploadError(
          "Failed to parse Excel file. Please check the file format."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        ID: "L001",
        Client: "Client Name",
        "Phone Number": "9876543210",
        "Email Address": "client@email.com",
        Destination: "Shimla-Manali",
        "Travel Date": "2026-06-10",
        Days: 6,
        Nights: 5,
        "No. of Travellers": 4,
        Status: "submitted_to_leader",
        Priority: "Normal",
        "Assigned Leader": "Auto Assign Pending",
        SLA: "OK",
        Budget: "₹1,00,000",
        Source: "Field Visit",
        Date: today,
        Progress: 20,
        "Follow-up Date": today,
        Remarks: "Client requirement notes",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "field_executive_leads_template.xlsx");
  };

  const exportLeads = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Leads");
    XLSX.writeFile(workbook, `field_executive_leads_${today}.xlsx`);
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] overflow-auto">
      <div className="mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              Sales Field Executive
            </h2>
            <p className="text-sm text-muted-foreground">
              Capture new travel enquiries and submit leads automatically to
              Team Leader.
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

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Sources</option>
              <option value="Field Visit">Field Visit</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Campaign">Campaign</option>
              <option value="Reference">Reference</option>
              <option value="Website">Website</option>
              <option value="B2B Portal">B2B Portal</option>
              <option value="Social Media">Social Media</option>
              <option value="Excel Import">Excel Import</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Priority</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-20">
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground px-2 py-1">
                      Filter by Status
                    </p>

                    {[
                      { label: "All Status", value: "all" },
                      { label: "New", value: "new" },
                      {
                        label: "Submitted To Leader",
                        value: "submitted_to_leader",
                      },
                      { label: "Assigned", value: "assigned" },
                      { label: "Quoted", value: "quoted" },
                      { label: "Follow Up", value: "follow_up" },
                      { label: "Converted", value: "converted" },
                      { label: "Lost", value: "lost" },
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => {
                          setFilterStatus(status.value);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${
                          filterStatus === status.value
                            ? "bg-[#4b49ac]/10 text-[#4b49ac]"
                            : "text-foreground"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAddLeadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Lead</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Import</span>
            </button>

            <button
              onClick={exportLeads}
              className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-green-800">{uploadSuccess}</p>
            <button
              onClick={() => setUploadSuccess("")}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-800">{uploadError}</p>
            <button
              onClick={() => setUploadError("")}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Today Leads</p>
            <CalendarDays className="w-5 h-5 text-[#4b49ac]" />
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {stats.todayLeads}
          </p>
          <p className="text-xs text-muted-foreground">Captured today</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <Briefcase className="w-5 h-5 text-[#4b49ac]" />
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {stats.totalLeads}
          </p>
          <p className="text-xs text-muted-foreground">Your portfolio</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <UserPlus className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {stats.submittedToLeader}
          </p>
          <p className="text-xs text-muted-foreground">Sent to leader</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Leads</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {stats.activeLeads}
          </p>
          <p className="text-xs text-green-600">In pipeline</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Conversions</p>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {stats.conversions}
          </p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">SLA Breaches</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {stats.slaBreaches}
          </p>
          <p className="text-xs text-muted-foreground">Need action</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-foreground font-semibold">My Leads</h3>
            <p className="text-xs text-muted-foreground">
              Showing {filteredLeads.length} records
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            Leads are automatically submitted to Team Leader after entry.
          </div>
        </div>

        {/* ── API fetch error banner ──────────────────────────────────── */}
        {fetchError && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-800">{fetchError}</p>
            <button
              onClick={fetchLeads}
              className="ml-4 text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sidebar-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Travel Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Leader
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  SLA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Budget
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Progress
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-sidebar-accent transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {lead.id}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {lead.client}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lead.phone}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">{lead.dest}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.days}D / {lead.nights}N · {lead.travellers} Pax
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">
                      {lead.travelDate || "N/A"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">{lead.source}</p>
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
                    <p className="text-sm text-foreground">
                      {lead.assignedLeader}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className={`text-sm ${getSLAColor(lead.sla)}`}>
                      {lead.sla}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {lead.budget}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {formatStatus(lead.status)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="w-28 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[#4b49ac]"
                        style={{ width: `${lead.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.progress}%
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      {lead.date}
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
              ))}

              {isLoading && (
                <tr>
                  <td colSpan={13} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <svg
                        className="animate-spin w-6 h-6 text-[#4b49ac]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      <span className="text-sm">Loading leads…</span>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={13}
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

      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[92vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Add New Lead
                </h3>
                <p className="text-xs text-muted-foreground">
                  Add client enquiry. This lead will be submitted to the Team
                  Leader automatically.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddLeadModal(false);
                  resetLeadForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(92vh-145px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Client Name *
                  </label>
                  <input
                    value={leadForm.client}
                    onChange={(e) =>
                      handleLeadInputChange("client", e.target.value)
                    }
                    placeholder="Client Name"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={leadForm.phone}
                    onChange={(e) =>
                      handleLeadInputChange("phone", e.target.value)
                    }
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) =>
                      handleLeadInputChange("email", e.target.value)
                    }
                    placeholder="Email Address"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Destination *
                  </label>
                  <input
                    value={leadForm.dest}
                    onChange={(e) =>
                      handleLeadInputChange("dest", e.target.value)
                    }
                    placeholder="Destination"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={leadForm.travelDate}
                    onChange={(e) =>
                      handleLeadInputChange("travelDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Approx Budget
                  </label>
                  <input
                    value={leadForm.budget}
                    onChange={(e) =>
                      handleLeadInputChange("budget", e.target.value)
                    }
                    placeholder="₹1,00,000"
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
                    value={leadForm.days}
                    onChange={(e) =>
                      handleLeadInputChange("days", e.target.value)
                    }
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
                    value={leadForm.nights}
                    onChange={(e) =>
                      handleLeadInputChange("nights", e.target.value)
                    }
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
                    value={leadForm.travellers}
                    onChange={(e) =>
                      handleLeadInputChange("travellers", e.target.value)
                    }
                    placeholder="Travellers"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Lead Source
                  </label>
                  <select
                    value={leadForm.source}
                    onChange={(e) =>
                      handleLeadInputChange("source", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  >
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
                  <select
                    value={leadForm.priority}
                    onChange={(e) =>
                      handleLeadInputChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

              </div>

              <div className="mt-4">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Remarks / Special Requirements
                </label>
                <textarea
                  rows={4}
                  value={leadForm.remarks}
                  onChange={(e) =>
                    handleLeadInputChange("remarks", e.target.value)
                  }
                  placeholder="Add client requirement, hotel preference, budget notes, meal plan, pickup details, etc."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-[#f8fafc]">
              <button
                onClick={() => {
                  setShowAddLeadModal(false);
                  resetLeadForm();
                }}
                className="px-4 py-2 border border-border rounded-lg text-sm text-foreground bg-white hover:bg-sidebar-accent"
              >
                Cancel
              </button>

              <button
                onClick={submitLead}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm hover:bg-[#4b49ac]/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isSubmitting ? "Submitting…" : "Submit Lead To Leader"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-foreground font-semibold text-lg">
                  Import Leads from Excel
                </h3>
                <p className="text-xs text-muted-foreground">
                  Imported leads will be added to your lead list.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadProgress(0);
                  setUploadedFileName("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-[#4b49ac] hover:bg-[#4b49ac]/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop your Excel file here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse .xlsx, .xls, .csv
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
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    {uploadedFileName}
                  </p>
                  <p className="text-xs text-green-600">Ready to import</p>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-[#4b49ac] h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {uploadProgress}% uploading...
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <button
                  onClick={downloadTemplate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadProgress(0);
                    setUploadedFileName("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-sidebar-accent transition-colors"
                >
                  Cancel
                </button>

                <button
                  disabled={!uploadedFileName}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Imported
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full overflow-auto p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedLead.client}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lead ID: {selectedLead.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <Info label="Phone" value={selectedLead.phone || "N/A"} />
              <Info label="Email" value={selectedLead.email || "N/A"} />
              <Info label="Destination" value={selectedLead.dest} />
              <Info label="Travel Date" value={selectedLead.travelDate || "N/A"} />
              <Info
                label="Duration"
                value={`${selectedLead.days} Days / ${selectedLead.nights} Nights`}
              />
              <Info
                label="Travellers"
                value={`${selectedLead.travellers} Pax`}
              />
              <Info label="Budget" value={selectedLead.budget} />
              <Info label="Source" value={selectedLead.source} />
              <Info label="Priority" value={selectedLead.priority} />
              <Info label="Team Leader" value={selectedLead.assignedLeader} />
              <Info label="SLA" value={selectedLead.sla} />
              <Info label="Status" value={formatStatus(selectedLead.status)} />
              <Info
                label="Follow-up Date"
                value={selectedLead.followUpDate || "No follow-up"}
              />

              <div>
                <p className="text-muted-foreground mb-1">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#4b49ac]"
                    style={{ width: `${selectedLead.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedLead.progress}%
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Remarks</p>
                <p className="p-3 bg-[#f8fafc] rounded-lg">
                  {selectedLead.remarks || "No remarks added."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-right text-foreground">{value}</p>
    </div>
  );
}
