import { useMemo, useState } from "react";
import { ArrowLeft, Download, Search, Eye } from "lucide-react";
import * as XLSX from "xlsx";

type Member = {
  id: string | number;
  name: string;
  role: string;
};

type Lead = {
  id: string;
  client: string;
  phone?: string;
  email?: string;
  dest: string;
  status: string;
  assignedTo: string;
  assignedToId?: number | null;
  assigned: string;
  sla: string;
  budget: string;
  source: string;
  date: string;
  dateValue: string;
  priority: string;
  stage: string;
  outcome: string;
  progress: number;
  nextFollowUp?: string;
  remarks?: string;
};

type Props = {
  member: Member;
  leads: Lead[];
  onBack: () => void;
};

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    assigned: "bg-cyan-100 text-cyan-700",
    quoted: "bg-amber-100 text-amber-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };

  return statusMap[status] || "bg-gray-100 text-gray-700";
};

export function SalesTeamMemberHistory({ member, leads, onBack }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Match by numeric ID (assignedToId) first; fall back to string comparison (assignedTo)
  const memberLeads = leads.filter((lead) =>
    lead.assignedToId !== undefined && lead.assignedToId !== null
      ? lead.assignedToId === Number(member.id)
      : String(lead.assignedTo) === String(member.id)
  );

  const filteredLeads = memberLeads.filter((lead) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      lead.client.toLowerCase().includes(search) ||
      lead.dest.toLowerCase().includes(search) ||
      lead.id.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;

    const matchesFromDate = !fromDate || lead.dateValue >= fromDate;
    const matchesToDate = !toDate || lead.dateValue <= toDate;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStage &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return {
      total: memberLeads.length,
      today: memberLeads.filter((l) => l.dateValue === today).length,
      converted: memberLeads.filter((l) => l.status === "converted").length,
      lost: memberLeads.filter((l) => l.status === "lost").length,
      pending: memberLeads.filter(
        (l) => !["converted", "lost"].includes(l.status)
      ).length,
      slaBreaches: memberLeads.filter((l) => l.sla === "BREACH").length,
    };
  }, [memberLeads]);

  const exportHistory = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Member History");
    XLSX.writeFile(workbook, `${member.name}_lead_history.xlsx`);
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] overflow-auto">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-border bg-white hover:bg-sidebar-accent"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {member.name} - Lead History
            </h2>
            <p className="text-sm text-muted-foreground">
              {member.role} complete lead performance, follow-up and outcome
              history.
            </p>
          </div>
        </div>

        <button
          onClick={exportHistory}
          className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg hover:bg-sidebar-accent"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Export History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[
          ["Total Leads", stats.total],
          ["Today Assigned", stats.today],
          ["Pending", stats.pending],
          ["Converted", stats.converted],
          ["Lost", stats.lost],
          ["SLA Breaches", stats.slaBreaches],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white p-4 rounded-lg border border-border shadow-sm"
          >
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search lead, client, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            />
          </div>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="follow_up">Follow Up</option>
            <option value="quotation">Quotation</option>
            <option value="booking">Booking</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">
            Lead History Details
          </h3>
          <p className="text-xs text-muted-foreground">
            Showing {filteredLeads.length} records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-4 py-3 text-left">Lead ID</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Destination</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Assigned Date</th>
                <th className="px-4 py-3 text-left">Stage</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Progress</th>
                <th className="px-4 py-3 text-left">Outcome</th>
                <th className="px-4 py-3 text-left">Next Follow-up</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{lead.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{lead.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3">{lead.dest}</td>
                  <td className="px-4 py-3">{lead.source}</td>
                  <td className="px-4 py-3">{lead.dateValue}</td>
                  <td className="px-4 py-3">{lead.stage}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
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
                  <td className="px-4 py-3">{lead.outcome}</td>
                  <td className="px-4 py-3">
                    {lead.nextFollowUp || "No follow-up"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-[#4b49ac]"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    No lead history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full overflow-auto p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedLead.client}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lead ID: {selectedLead.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-muted-foreground"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <Info label="Phone" value={selectedLead.phone || "N/A"} />
              <Info label="Email" value={selectedLead.email || "N/A"} />
              <Info label="Destination" value={selectedLead.dest} />
              <Info label="Budget" value={selectedLead.budget} />
              <Info label="Source" value={selectedLead.source} />
              <Info label="Priority" value={selectedLead.priority} />
              <Info label="Status" value={selectedLead.status} />
              <Info label="Stage" value={selectedLead.stage} />
              <Info label="Outcome" value={selectedLead.outcome} />
              <Info
                label="Next Follow-up"
                value={selectedLead.nextFollowUp || "No follow-up"}
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
    <div className="flex justify-between border-b border-border pb-2">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-right">{value}</p>
    </div>
  );
}