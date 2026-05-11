import { Filter, Users, TrendingUp, DollarSign, Clock, Mail, Phone, Calendar, MessageSquare, CheckCircle, AlertCircle, MapPin, Plus, Eye, X, ChevronLeft, ChevronRight, Edit2, Trash2, Search, Flame, Snowflake, ThermometerSun, XCircle, UserCheck, FileText, Send, Target, Building2, Archive } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LeadDetailPage } from './LeadDetailPage';
import { AddLeadPage } from './AddLeadPage';
import { EditLeadPage } from './EditLeadPage';

type LeadStatus =
  | 'New'
  | 'In Process'
  | 'Dead Lead'
  | 'Qualified'
  | 'Interested In Quote'
  | 'Quotes sent'
  | 'Lost/Not Interested'
  | 'Hot'
  | 'Warm'
  | 'Cold'
  | 'Future Prospects'
  | 'Convert To account'
  | 'Existing Account';

interface Lead {
  id: number;
  enquiryId?: string;
  name: string;
  destination: string;
  nights: number;
  pax: number;
  status: LeadStatus;
  timeInfo: string;
  channel?: string;
  statusNote: string;
  value: number;
  isApproximate?: boolean;
  warning?: string;
  branch?: string;
  leadStatus?: string;
  leadMobileCountry?: string;
  leadMobile?: string;
  leadOwner?: string;
  leadCity?: string;
  leadCountry?: string;
  leadType?: string;
  leadSource?: string;
  leadBirthdate?: string;
  leadArea?: string;
  agencyAddress?: string;
  keyPersonName?: string;
  keyPersonDesignation?: string;
  keyPersonEmail?: string;
  keyPersonNationality?: string;
  keyPersonBirthdate?: string;
  keyPersonMobileCountry?: string;
  keyPersonMobile?: string;
}

const statusColors: Record<LeadStatus, { bg: string; text: string }> = {
  'New': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'In Process': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Dead Lead': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'Qualified': { bg: 'bg-green-50', text: 'text-green-700' },
  'Interested In Quote': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Quotes sent': { bg: 'bg-cyan-50', text: 'text-cyan-700' },
  'Lost/Not Interested': { bg: 'bg-red-50', text: 'text-red-700' },
  'Hot': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Warm': { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'Cold': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Future Prospects': { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  'Convert To account': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Existing Account': { bg: 'bg-violet-50', text: 'text-violet-700' },
};

const statusIcons: Record<LeadStatus | 'All', any> = {
  'All': Users,
  'New': Plus,
  'In Process': Clock,
  'Dead Lead': XCircle,
  'Qualified': UserCheck,
  'Interested In Quote': FileText,
  'Quotes sent': Send,
  'Lost/Not Interested': AlertCircle,
  'Hot': Flame,
  'Warm': ThermometerSun,
  'Cold': Snowflake,
  'Future Prospects': Target,
  'Convert To account': CheckCircle,
  'Existing Account': Building2,
};

const generateEnquiryId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ENQ-${year}${month}${day}-${random}`;
};

export function SalesPipeline({ initialView = 'list', initialStatus = 'All' }: { initialView?: 'list' | 'add' | 'dashboard'; initialStatus?: LeadStatus | 'All' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'All'>(initialStatus);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit' | 'detail'>(initialView === 'add' ? 'add' : 'list');

  useEffect(() => {
    if (initialView === 'add') setCurrentView('add');
    else if (initialView === 'list' || initialView === 'dashboard') setCurrentView('list');
  }, [initialView]);

  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      enquiryId: 'ENQ-20260509-0001',
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
      branch: 'Delhi',
      leadStatus: 'Hot',
      leadMobileCountry: '+91 India',
      leadMobile: '9876543210',
      leadOwner: 'Amit Kumar',
      leadCity: 'Mumbai',
      leadCountry: 'India',
      leadType: 'Individual',
      leadSource: 'WhatsApp',
      leadBirthdate: '1990-05-15',
      leadArea: 'Andheri',
      agencyAddress: '123 Main Street, Andheri West, Mumbai',
      keyPersonName: 'Priya Sharma',
      keyPersonDesignation: 'Manager',
      keyPersonEmail: 'priya.sharma@example.com',
      keyPersonNationality: 'Indian',
      keyPersonBirthdate: '1990-05-15',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9876543210',
    },
    {
      id: 2,
      enquiryId: 'ENQ-20260509-0002',
      name: 'Rajesh Iyer',
      destination: 'Ubud',
      nights: 5,
      pax: 2,
      status: 'Qualified',
      timeInfo: '4 hrs ago',
      channel: 'Email',
      statusNote: '',
      value: 68000,
      branch: 'Bangalore',
      leadMobileCountry: '+91 India',
      leadMobile: '9123456789',
      leadCountry: 'India',
      leadType: 'Individual',
      agencyAddress: '456 Park Avenue, Bangalore',
      keyPersonName: 'Rajesh Iyer',
      keyPersonDesignation: 'Director',
      keyPersonEmail: 'rajesh.iyer@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9123456789',
    },
    {
      id: 3,
      enquiryId: 'ENQ-20260509-0003',
      name: 'Anita Bose',
      destination: 'Bali',
      nights: 10,
      pax: 6,
      status: 'Interested In Quote',
      timeInfo: '6 hrs ago',
      channel: 'Web Form',
      statusNote: '',
      value: 240000,
      branch: 'Kolkata',
      leadMobileCountry: '+91 India',
      leadMobile: '9234567890',
      leadCountry: 'India',
      leadType: 'Group',
      agencyAddress: '789 Lake Road, Kolkata',
      keyPersonName: 'Anita Bose',
      keyPersonDesignation: 'CEO',
      keyPersonEmail: 'anita.bose@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9234567890',
    },
    {
      id: 4,
      enquiryId: 'ENQ-20260509-0004',
      name: 'Mehta Family',
      destination: 'Goa',
      nights: 8,
      pax: 5,
      status: 'Quotes sent',
      timeInfo: 'Day 3',
      statusNote: 'Auto F/U sent',
      value: 184000,
      branch: 'Mumbai',
      leadMobileCountry: '+91 India',
      leadMobile: '9345678901',
      leadCountry: 'India',
      leadType: 'Group',
      agencyAddress: '321 Marine Drive, Mumbai',
      keyPersonName: 'Vikram Mehta',
      keyPersonDesignation: 'Manager',
      keyPersonEmail: 'vikram.mehta@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9345678901',
    },
    {
      id: 5,
      enquiryId: 'ENQ-20260509-0005',
      name: 'Suresh Nair',
      destination: 'Dubai',
      nights: 4,
      pax: 2,
      status: 'Hot',
      timeInfo: 'Day 1',
      statusNote: 'Opened quote',
      value: 152000,
      branch: 'Chennai',
      leadMobileCountry: '+91 India',
      leadMobile: '9456789012',
      leadCountry: 'India',
      leadType: 'Individual',
      agencyAddress: '654 Beach Road, Chennai',
      keyPersonName: 'Suresh Nair',
      keyPersonDesignation: 'Executive',
      keyPersonEmail: 'suresh.nair@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9456789012',
    },
    {
      id: 6,
      enquiryId: 'ENQ-20260509-0006',
      name: 'Vikram Joshi',
      destination: 'Seminyak',
      nights: 7,
      pax: 4,
      status: 'Cold',
      timeInfo: 'Day 6',
      statusNote: 'COLD',
      value: 140000,
      warning: 'COLD',
      branch: 'Pune',
      leadMobileCountry: '+91 India',
      leadMobile: '9567890123',
      leadCountry: 'India',
      leadType: 'Corporate',
      agencyAddress: '987 Tech Park, Pune',
      keyPersonName: 'Vikram Joshi',
      keyPersonDesignation: 'Manager',
      keyPersonEmail: 'vikram.joshi@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9567890123',
    },
    {
      id: 7,
      enquiryId: 'ENQ-20260509-0007',
      name: 'Kavita Menon',
      destination: 'Thailand',
      nights: 6,
      pax: 3,
      status: 'Warm',
      timeInfo: 'Day 4',
      statusNote: 'Urgency sent',
      value: 96000,
      branch: 'Delhi',
      leadMobileCountry: '+91 India',
      leadMobile: '9678901234',
      leadCountry: 'India',
      leadType: 'Individual',
      agencyAddress: '111 Central Avenue, Delhi',
      keyPersonName: 'Kavita Menon',
      keyPersonDesignation: 'Director',
      keyPersonEmail: 'kavita.menon@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9678901234',
    },
    {
      id: 8,
      enquiryId: 'ENQ-20260509-0008',
      name: 'Arjun Patel',
      destination: 'Bali',
      nights: 7,
      pax: 28,
      status: 'In Process',
      timeInfo: 'Apr 8 dep',
      statusNote: 'Paid 50%',
      value: 1120000,
      branch: 'Hyderabad',
      leadMobileCountry: '+91 India',
      leadMobile: '9789012345',
      leadCountry: 'India',
      leadType: 'Corporate',
      agencyAddress: '222 IT Hub, Hyderabad',
      keyPersonName: 'Arjun Patel',
      keyPersonDesignation: 'CEO',
      keyPersonEmail: 'arjun.patel@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9789012345',
    },
    {
      id: 9,
      enquiryId: 'ENQ-20260509-0009',
      name: 'Neha Verma',
      destination: 'Goa',
      nights: 5,
      pax: 2,
      status: 'Future Prospects',
      timeInfo: '1 day ago',
      statusNote: 'Follow up in 2 weeks',
      value: 75000,
      branch: 'Jaipur',
      leadMobileCountry: '+91 India',
      leadMobile: '9890123456',
      leadCountry: 'India',
      leadType: 'Individual',
      agencyAddress: '333 Pink City Mall, Jaipur',
      keyPersonName: 'Neha Verma',
      keyPersonDesignation: 'Manager',
      keyPersonEmail: 'neha.verma@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9890123456',
    },
    {
      id: 10,
      enquiryId: 'ENQ-20260509-0010',
      name: 'Rahul Singh',
      destination: 'Dubai',
      nights: 4,
      pax: 2,
      status: 'Convert To account',
      timeInfo: '2 days ago',
      statusNote: 'Ready to convert',
      value: 180000,
      branch: 'Kochi',
      leadMobileCountry: '+91 India',
      leadMobile: '9901234567',
      leadCountry: 'India',
      leadType: 'Individual',
      agencyAddress: '444 Seaside Plaza, Kochi',
      keyPersonName: 'Rahul Singh',
      keyPersonDesignation: 'Executive',
      keyPersonEmail: 'rahul.singh@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9901234567',
    },
    {
      id: 11,
      enquiryId: 'ENQ-20260509-0011',
      name: 'Tech Solutions Ltd',
      destination: 'Thailand',
      nights: 3,
      pax: 15,
      status: 'Existing Account',
      timeInfo: '3 days ago',
      statusNote: 'Repeat customer',
      value: 450000,
      branch: 'Bangalore',
      leadMobileCountry: '+91 India',
      leadMobile: '9012345678',
      leadCountry: 'India',
      leadType: 'Corporate',
      agencyAddress: '555 Tech Tower, Bangalore',
      keyPersonName: 'Karthik Reddy',
      keyPersonDesignation: 'Director',
      keyPersonEmail: 'karthik.reddy@techsolutions.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9012345678',
    },
    {
      id: 12,
      enquiryId: 'ENQ-20260509-0012',
      name: 'Deepa Menon',
      destination: 'Bali',
      nights: 6,
      pax: 3,
      status: 'Dead Lead',
      timeInfo: '1 week ago',
      statusNote: 'No response',
      value: 95000,
      branch: 'Mumbai',
      leadMobileCountry: '+91 India',
      leadMobile: '9123456780',
      leadCountry: 'India',
      leadType: 'Individual',
      agencyAddress: '666 Business District, Mumbai',
      keyPersonName: 'Deepa Menon',
      keyPersonDesignation: 'Manager',
      keyPersonEmail: 'deepa.menon@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9123456780',
    },
    {
      id: 13,
      enquiryId: 'ENQ-20260509-0013',
      name: 'Anil Kumar',
      destination: 'Seminyak',
      nights: 15,
      pax: 4,
      status: 'Lost/Not Interested',
      timeInfo: '2 weeks ago',
      statusNote: 'Budget constraints',
      value: 320000,
      branch: 'Delhi',
      leadMobileCountry: '+91 India',
      leadMobile: '9234567801',
      leadCountry: 'India',
      leadType: 'Individual',
      agencyAddress: '777 Greater Kailash, Delhi',
      keyPersonName: 'Anil Kumar',
      keyPersonDesignation: 'CEO',
      keyPersonEmail: 'anil.kumar@example.com',
      keyPersonNationality: 'Indian',
      keyPersonMobileCountry: '+91 India',
      keyPersonMobile: '9234567801',
    },
  ]);


  const allStatuses: (LeadStatus | 'All')[] = [
    'All',
    'New',
    'In Process',
    'Dead Lead',
    'Qualified',
    'Interested In Quote',
    'Quotes sent',
    'Lost/Not Interested',
    'Hot',
    'Warm',
    'Cold',
    'Future Prospects',
    'Convert To account',
    'Existing Account',
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.enquiryId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  const handleStatusFilter = (status: LeadStatus | 'All') => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleAddLead = (newLeadData: any) => {
    const lead: Lead = {
      id: leads.length + 1,
      enquiryId: generateEnquiryId(),
      timeInfo: 'Just now',
      statusNote: '',
      channel: '',
      ...newLeadData,
    };

    setLeads([lead, ...leads]);
    setCurrentView('list');
  };

  const handleViewLead = (lead: Lead) => {
    setViewingLead(lead);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setViewingLead(null);
    setEditingLead(null);
  };

  const handleStatusChange = (leadId: number, newStatus: LeadStatus) => {
    setLeads(leads.map((lead) =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    if (viewingLead && viewingLead.id === leadId) {
      setViewingLead({ ...viewingLead, status: newStatus });
    }
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setCurrentView('edit');
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map((lead) =>
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setCurrentView('list');
    setEditingLead(null);
  };

  const handleDeleteClick = (lead: Lead) => {
    setLeadToDelete(lead);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteLead = () => {
    if (leadToDelete) {
      setLeads(leads.filter((lead) => lead.id !== leadToDelete.id));
      setShowDeleteConfirmModal(false);
      setLeadToDelete(null);
    }
  };

  const getStatusCount = (status: LeadStatus | 'All') => {
    if (status === 'All') return leads.length;
    return leads.filter((lead) => lead.status === status).length;
  };

  // Show appropriate page based on currentView
  if (currentView === 'add') {
    return (
      <AddLeadPage
        onBack={handleBackToList}
        onSave={handleAddLead}
        generateEnquiryId={generateEnquiryId}
      />
    );
  }

  if (currentView === 'edit' && editingLead) {
    return (
      <EditLeadPage
        lead={editingLead}
        onBack={handleBackToList}
        onSave={handleUpdateLead}
      />
    );
  }

  if (currentView === 'detail' && viewingLead) {
    return (
      <LeadDetailPage
        lead={viewingLead}
        onBack={handleBackToList}
        onStatusChange={(newStatus) => handleStatusChange(viewingLead.id, newStatus)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#f5f7fb' }}>
      {/* Header */}
      <div className="bg-white px-8 py-6" style={{ borderBottom: '1px solid #eceef5' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: '#1d2433' }}>Leads Management</h1>
            <p className="text-sm mt-1" style={{ color: '#70778a' }}>Manage and track your leads</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64 px-4 py-2 pl-10 rounded-lg text-sm"
                style={{ border: '1px solid #eceef5', color: '#1d2433' }}
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: '#70778a' }} />
            </div>
            <button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ border: '1px solid #eceef5', color: '#70778a' }}>
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="px-8 py-6">
        <div className="flex gap-2">
          {allStatuses.map((status) => {
            const count = getStatusCount(status);
            const isSelected = selectedStatus === status;
            const Icon = statusIcons[status];
            const colors = status === 'All'
              ? { iconBg: 'bg-gray-100', iconColor: 'text-gray-600' }
              : { iconBg: statusColors[status as LeadStatus].bg, iconColor: statusColors[status as LeadStatus].text };

            return (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`flex-1 bg-white rounded-lg p-2 transition-all ${isSelected ? 'shadow-md' : 'shadow-sm hover:shadow-md'
                  }`}
                style={{
                  border: isSelected ? '2px solid #5b57d9' : '1px solid #eceef5',
                  minWidth: '0',
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                  </div>
                  <div className="text-center overflow-hidden w-full">
                    <div className="text-sm font-bold truncate" style={{ color: '#1d2433' }}>{count}</div>
                    <div className="text-[10px] truncate" style={{ color: '#70778a' }} title={status}>{status}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-8 pb-6 overflow-auto">
        <div className="bg-white rounded-2xl shadow-sm" style={{ border: '1px solid #eceef5' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eceef5' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium" style={{ color: '#70778a' }}>Enquiry ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium" style={{ color: '#70778a' }}>Lead Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium" style={{ color: '#70778a' }}>Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-medium" style={{ color: '#70778a' }}>Destination</th>
                  <th className="px-6 py-4 text-center text-xs font-medium" style={{ color: '#70778a' }}>Nights</th>
                  <th className="px-6 py-4 text-center text-xs font-medium" style={{ color: '#70778a' }}>Pax</th>
                  <th className="px-6 py-4 text-left text-xs font-medium" style={{ color: '#70778a' }}>Value (₹)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium" style={{ color: '#70778a' }}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium" style={{ color: '#70778a' }}>Branch</th>
                  <th className="px-6 py-4 text-center text-xs font-medium" style={{ color: '#70778a' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-sm" style={{ color: '#70778a' }}>
                      No leads found matching your filters
                    </td>
                  </tr>
                ) : (
                  currentLeads.map((lead, index) => {
                    const colors = statusColors[lead.status];
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 transition-colors"
                        style={{ borderBottom: index < currentLeads.length - 1 ? '1px solid #eceef5' : 'none' }}
                      >
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: '#1d2433' }}>{lead.enquiryId}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#1d2433' }}>{lead.name}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#70778a' }}>{lead.leadMobile || '-'}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#1d2433' }}>{lead.destination}</td>
                        <td className="px-6 py-4 text-sm text-center" style={{ color: '#70778a' }}>{lead.nights}</td>
                        <td className="px-6 py-4 text-sm text-center" style={{ color: '#70778a' }}>{lead.pax}</td>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: '#1d2433' }}>
                          ₹{lead.value.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#70778a' }}>{lead.branch || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewLead(lead)}
                              className="p-1.5 rounded hover:bg-blue-50 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleEditLead(lead)}
                              className="p-1.5 rounded hover:bg-green-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(lead)}
                              className="p-1.5 rounded hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #eceef5' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: '#70778a' }}>Showing {startIndex + 1} of {filteredLeads.length} entries</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-4 px-3 py-1.5 rounded-lg text-sm"
                style={{ border: '1px solid #eceef5', color: '#1d2433' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: '1px solid #eceef5', color: '#70778a' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${currentPage === page ? 'text-white' : ''
                    }`}
                  style={currentPage === page ? { backgroundColor: '#5b57d9', border: '1px solid #5b57d9' } : { border: '1px solid #eceef5', color: '#70778a' }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: '1px solid #eceef5', color: '#70778a' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && leadToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#1d2433' }}>Delete Lead</h3>
                  <p className="text-sm" style={{ color: '#70778a' }}>This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm mb-6" style={{ color: '#1d2433' }}>
                Are you sure you want to delete the lead <strong>{leadToDelete.name}</strong> ({leadToDelete.enquiryId})?
                This will permanently remove the lead from the system.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="px-6 py-2 rounded-lg text-sm"
                  style={{ border: '1px solid #eceef5', color: '#70778a' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLead}
                  className="px-6 py-2 rounded-lg text-white text-sm flex items-center gap-2 bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
