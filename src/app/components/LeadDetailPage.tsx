import { ArrowLeft, Phone, MessageSquare, Mail, MapPin, Calendar, DollarSign, Users, Building2, User, Briefcase, Globe, Cake, Home, FileText, Clock, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';
import { useState } from 'react';

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

interface LeadDetailPageProps {
  lead: Lead;
  onBack: () => void;
  onStatusChange: (newStatus: LeadStatus) => void;
}

const statusColors: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  'New': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'In Process': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Dead Lead': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  'Qualified': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Interested In Quote': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Quotes sent': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Lost/Not Interested': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Hot': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Warm': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'Cold': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'Future Prospects': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Convert To account': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Existing Account': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
};

export function LeadDetailPage({ lead, onBack, onStatusChange }: LeadDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'email'>('overview');
  const [activityTab, setActivityTab] = useState<'call' | 'whatsapp'>('call');
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  const [callLog, setCallLog] = useState({
    subject: '',
    callDate: '',
    callTime: '',
    relatedTo: lead.enquiryId || '',
    callAttemptStatus: '',
    callOutcome: '',
    reasonForLost: '',
    nextActionDate: '',
    nextActionTime: '',
    comments: '',
  });

  const [whatsappLog, setWhatsappLog] = useState({
    from: '',
    to: lead.leadMobile || '',
    name: lead.name || '',
    message: '',
    outcome: '',
  });

  const [emailComposer, setEmailComposer] = useState({
    to: lead.keyPersonEmail || '',
    subject: '',
    body: '',
  });

  const allStatuses: LeadStatus[] = [
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

  const handleSaveCallLog = () => {
    console.log('Call log saved:', callLog);
    // Reset form
    setCallLog({
      subject: '',
      callDate: '',
      callTime: '',
      relatedTo: lead.enquiryId || '',
      callAttemptStatus: '',
      callOutcome: '',
      reasonForLost: '',
      nextActionDate: '',
      nextActionTime: '',
      comments: '',
    });
  };

  const handleSendWhatsApp = () => {
    console.log('WhatsApp sent:', whatsappLog);
    // Reset form
    setWhatsappLog({
      from: '',
      to: lead.leadMobile || '',
      name: lead.name || '',
      message: '',
      outcome: '',
    });
  };

  const handleSendEmail = () => {
    console.log('Email sent:', emailComposer);
    setShowEmailComposer(false);
    setEmailComposer({
      to: lead.keyPersonEmail || '',
      subject: '',
      body: '',
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#f5f7fb' }}>
      {/* Header */}
      <div className="bg-white px-8 py-6" style={{ borderBottom: '1px solid #eceef5' }}>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#70778a' }} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: '#1d2433' }}>{lead.name}</h1>
            <p className="text-sm mt-1" style={{ color: '#70778a' }}>{lead.enquiryId}</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {allStatuses.map((status) => {
            const isActive = lead.status === status;
            const colors = statusColors[status];
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? `${colors.bg} ${colors.text} ${colors.border} border-2 shadow-sm`
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className=" mx-auto py-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Lead Details */}
            <div className="col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm" style={{ border: '1px solid #eceef5' }}>
                <div className="flex items-center gap-6 px-6 py-4" style={{ borderBottom: '1px solid #eceef5' }}>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`text-sm font-medium pb-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-[#5b57d9]'
                        : ''
                    }`}
                    style={{ color: activeTab === 'overview' ? '#5b57d9' : '#70778a' }}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`text-sm font-medium pb-2 transition-colors ${
                      activeTab === 'email'
                        ? 'border-b-2 border-[#5b57d9]'
                        : ''
                    }`}
                    style={{ color: activeTab === 'email' ? '#5b57d9' : '#70778a' }}
                  >
                    Email
                  </button>
                </div>

                {activeTab === 'overview' && (
                  <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: '#1d2433' }}>Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Enquiry ID</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.enquiryId}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Branch</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.branch || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Lead Name</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Mobile</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.leadMobileCountry} {lead.leadMobile}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>City</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.leadCity || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Country</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.leadCountry || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Lead Type</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.leadType || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <Home className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Area</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.leadArea || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Person Information */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: '#1d2433' }}>Key Person Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-violet-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Name</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.keyPersonName || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Designation</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.keyPersonDesignation || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Email</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.keyPersonEmail || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Mobile</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.keyPersonMobileCountry} {lead.keyPersonMobile}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: '#1d2433' }}>Trip Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Destination</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.destination}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Value</p>
                            <p className="text-sm font-semibold text-green-600">₹{lead.value.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Nights</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.nights} Nights</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#70778a' }}>Pax</p>
                            <p className="text-sm font-medium" style={{ color: '#1d2433' }}>{lead.pax} People</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold" style={{ color: '#1d2433' }}>Email Conversations</h3>
                      <button
                        onClick={() => setShowEmailComposer(!showEmailComposer)}
                        className="px-4 py-2 rounded-lg text-white text-sm"
                        style={{ backgroundColor: '#5b57d9' }}
                      >
                        + New Thread
                      </button>
                    </div>

                    {showEmailComposer ? (
                      <div className="bg-white rounded-lg p-4 space-y-4" style={{ border: '1px solid #eceef5' }}>
                        <div>
                          <label className="block text-xs mb-2" style={{ color: '#70778a' }}>To</label>
                          <input
                            type="email"
                            value={emailComposer.to}
                            onChange={(e) => setEmailComposer({ ...emailComposer, to: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-2" style={{ color: '#70778a' }}>Subject</label>
                          <input
                            type="text"
                            value={emailComposer.subject}
                            onChange={(e) => setEmailComposer({ ...emailComposer, subject: e.target.value })}
                            placeholder="Email subject"
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-2" style={{ color: '#70778a' }}>Message</label>
                          <textarea
                            value={emailComposer.body}
                            onChange={(e) => setEmailComposer({ ...emailComposer, body: e.target.value })}
                            placeholder="Type your message here..."
                            rows={6}
                            className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setShowEmailComposer(false)}
                            className="px-4 py-2 rounded-lg text-sm"
                            style={{ border: '1px solid #eceef5', color: '#70778a' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSendEmail}
                            className="px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2"
                            style={{ backgroundColor: '#5b57d9' }}
                          >
                            <Send className="w-4 h-4" />
                            Send Email
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: '#70778a' }} />
                        <p className="text-sm" style={{ color: '#70778a' }}>No emails yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Activity */}
            <div className="col-span-1">
              <div className="bg-white rounded-2xl shadow-sm" style={{ border: '1px solid #eceef5' }}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid #eceef5' }}>
                  <h3 className="text-sm font-semibold" style={{ color: '#1d2433' }}>Activity</h3>
                </div>

                <div className="p-6">
                  {/* Activity Tabs */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setActivityTab('call')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activityTab === 'call'
                          ? 'bg-white text-[#1d2433]'
                          : 'text-[#70778a]'
                      }`}
                      style={activityTab === 'call' ? { border: '1px solid #eceef5' } : {}}
                    >
                      Log a Call
                    </button>
                    <button
                      onClick={() => setActivityTab('whatsapp')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activityTab === 'whatsapp'
                          ? 'bg-white text-[#1d2433]'
                          : 'text-[#70778a]'
                      }`}
                      style={activityTab === 'whatsapp' ? { border: '1px solid #eceef5' } : {}}
                    >
                      Log a Whatsapp
                    </button>
                  </div>

                  {/* Call Form */}
                  {activityTab === 'call' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          *Subject
                        </label>
                        <input
                          type="text"
                          value={callLog.subject}
                          onChange={(e) => setCallLog({ ...callLog, subject: e.target.value })}
                          placeholder="Type your subject here"
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          Call date/Time
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={callLog.callDate}
                            onChange={(e) => setCallLog({ ...callLog, callDate: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                          />
                          <input
                            type="time"
                            value={callLog.callTime}
                            onChange={(e) => setCallLog({ ...callLog, callTime: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          Related To
                        </label>
                        <input
                          type="text"
                          value={callLog.relatedTo}
                          disabled
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', backgroundColor: '#f9fafb', color: '#1d2433' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          * Call Attempt Status
                        </label>
                        <select
                          value={callLog.callAttemptStatus}
                          onChange={(e) => setCallLog({ ...callLog, callAttemptStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        >
                          <option value="">--None--</option>
                          <option value="Connected">Connected</option>
                          <option value="Not Connected">Not Connected</option>
                          <option value="Busy">Busy</option>
                          <option value="No Answer">No Answer</option>
                          <option value="Left Voicemail">Left Voicemail</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          * Call Outcome
                        </label>
                        <select
                          value={callLog.callOutcome}
                          onChange={(e) => setCallLog({ ...callLog, callOutcome: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        >
                          <option value="">--None--</option>
                          <option value="Interested">Interested</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Call Back Later">Call Back Later</option>
                          <option value="Wrong Number">Wrong Number</option>
                          <option value="Converted">Converted</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          Reason for Lost
                        </label>
                        <select
                          value={callLog.reasonForLost}
                          onChange={(e) => setCallLog({ ...callLog, reasonForLost: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        >
                          <option value="">--None--</option>
                          <option value="Budget Constraints">Budget Constraints</option>
                          <option value="Competitor">Competitor</option>
                          <option value="No Response">No Response</option>
                          <option value="Timeline Issues">Timeline Issues</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          Next Action Date
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={callLog.nextActionDate}
                            onChange={(e) => setCallLog({ ...callLog, nextActionDate: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                          />
                          <input
                            type="time"
                            value={callLog.nextActionTime}
                            onChange={(e) => setCallLog({ ...callLog, nextActionTime: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          * Comments
                        </label>
                        <textarea
                          value={callLog.comments}
                          onChange={(e) => setCallLog({ ...callLog, comments: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        />
                      </div>

                      <button
                        onClick={handleSaveCallLog}
                        className="w-full px-4 py-2 rounded-lg text-white text-sm"
                        style={{ backgroundColor: '#5b57d9' }}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {/* WhatsApp Form */}
                  {activityTab === 'whatsapp' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          From
                        </label>
                        <input
                          type="text"
                          value={whatsappLog.from}
                          onChange={(e) => setWhatsappLog({ ...whatsappLog, from: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          *To
                        </label>
                        <input
                          type="text"
                          value={whatsappLog.to}
                          onChange={(e) => setWhatsappLog({ ...whatsappLog, to: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          *Name
                        </label>
                        <input
                          type="text"
                          value={whatsappLog.name}
                          onChange={(e) => setWhatsappLog({ ...whatsappLog, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          *Message
                        </label>
                        <textarea
                          value={whatsappLog.message}
                          onChange={(e) => setWhatsappLog({ ...whatsappLog, message: e.target.value })}
                          placeholder="Message"
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs mb-2" style={{ color: '#70778a' }}>
                          Outcome
                        </label>
                        <select
                          value={whatsappLog.outcome}
                          onChange={(e) => setWhatsappLog({ ...whatsappLog, outcome: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                        >
                          <option value="">--None--</option>
                          <option value="Message Sent">Message Sent</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Read">Read</option>
                          <option value="Replied">Replied</option>
                          <option value="No Response">No Response</option>
                        </select>
                      </div>

                      <button
                        onClick={handleSendWhatsApp}
                        className="w-full px-4 py-2 rounded-lg text-white text-sm"
                        style={{ backgroundColor: '#5b57d9' }}
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
