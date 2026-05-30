import { useState, useEffect } from 'react';
import {
  Building2, Phone, Mail, MapPin, Globe, Save,
  Clock, CheckCircle, AlertCircle, X,
  User, Users
} from 'lucide-react';
import { getActiveCountries, getActiveStatesByCountry, getActiveCitiesByState } from '../../api/location.api';

type Toast = { message: string; type: 'success' | 'error' } | null;

const CURRENCIES     = ['INR ₹', 'USD $', 'EUR €', 'GBP £', 'AED د.إ'];
const ASSIGN_METHODS = ['Auto Assign', 'Manual Assign', 'Round Robin'];
const PRIORITIES     = ['Low', 'Normal', 'High', 'Urgent'];
const QUERY_SOURCES  = ['B2B / Travel Agent', 'Direct / Walk-in', 'OTA', 'Website', 'Social Media', 'Corporate', 'Referral'];

const tabs = [
  { id: 'profile',  label: 'Profile',         icon: Building2 },
  { id: 'contact',  label: 'Contact',          icon: Phone     },
  { id: 'location', label: 'Location',         icon: MapPin    },
  { id: 'agent',    label: 'Agent',            icon: User      },
  { id: 'query',    label: 'Query Settings',   icon: Users     },
];

export function Agency() {
  const [toast, setToast]             = useState<Toast>(null);
  const [saving, setSaving]           = useState(false);
  const [activeTab, setActiveTab]     = useState('profile');
  const [querySources, setQuerySources] = useState<string[]>([]);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates]       = useState<any[]>([]);
  const [cities, setCities]       = useState<any[]>([]);

  const [form, setForm] = useState({
    name: '', tagline: '', description: '', website: '', established: '', currency: 'INR ₹',
    phone: '', phone2: '', email: '', email2: '', whatsapp: '',
    address1: '', address2: '', pincode: '', country_id: '', state_id: '', city_id: '',
    agentName: '', agentDesignation: '', agentPhone: '', agentEmail: '', agentAddress: '',
    assignMethod: 'Auto Assign', slaHours: '24', defaultPriority: 'Normal',
  });

  useEffect(() => {
    getActiveCountries().then(res => setCountries(res?.data || [])).catch(() => {});
  }, []);

  const handleCountryChange = (id: string) => {
    set('country_id', id); set('state_id', ''); set('city_id', '');
    setStates([]); setCities([]);
    if (id) getActiveStatesByCountry(Number(id)).then(r => setStates(r?.data || [])).catch(() => {});
  };

  const handleStateChange = (id: string) => {
    set('state_id', id); set('city_id', '');
    setCities([]);
    if (id) getActiveCitiesByState(Number(id)).then(r => setCities(r?.data || [])).catch(() => {});
  };

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));


  const toggleSource = (s: string) =>
    setQuerySources(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    showToast('Agency settings saved successfully!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const inp = "w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac] bg-white transition-colors";
  const lbl = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="flex-1 bg-[#f5f7ff] p-6 overflow-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Agency</h2>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-60 shadow-sm">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>


      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border p-1.5 mb-6 overflow-x-auto shadow-sm">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#4b49ac] text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <SectionHeader icon={Building2} title="Agency Profile" desc="Basic information about the partner agency or travel agent" />
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={lbl}>Agency Name <span className="text-red-500">*</span></label>
                <input className={inp} placeholder="e.g. Travo DMC Pvt. Ltd." value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} placeholder="https://yourdmc.com" value={form.website} onChange={e => set('website', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Established Year</label>
                <input className={inp} type="number" placeholder="e.g. 2012" min="1900" max="2099" value={form.established} onChange={e => set('established', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Operating Currency</label>
                <select className={inp} value={form.currency} onChange={e => set('currency', e.target.value)}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <SectionHeader icon={Phone} title="Contact Information" desc="How clients and travel agents can reach your DMC" />
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={lbl}>Primary Phone <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Secondary Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} placeholder="+91 98765 43210" value={form.phone2} onChange={e => set('phone2', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Primary Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} type="email" placeholder="info@yourdmc.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Query / Support Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} type="email" placeholder="queries@yourdmc.com" value={form.email2} onChange={e => set('email2', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 text-[10px] font-bold">WA</span>
                  <input className={inp + ' pl-9'} placeholder="+91 98765 43210" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOCATION */}
        {activeTab === 'location' && (
          <div className="space-y-5">
            <SectionHeader icon={MapPin} title="Office Location" desc="Registered office address of your DMC" />
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={lbl}>Address Line 1 <span className="text-red-500">*</span></label>
                <input className={inp} placeholder="Building / Floor, Street Name" value={form.address1} onChange={e => set('address1', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={lbl}>Address Line 2</label>
                <input className={inp} placeholder="Area, Landmark (optional)" value={form.address2} onChange={e => set('address2', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Country</label>
                <select className={inp} value={form.country_id} onChange={e => handleCountryChange(e.target.value)}>
                  <option value="">Select Country</option>
                  {countries.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>State</label>
                <select className={inp} value={form.state_id} onChange={e => handleStateChange(e.target.value)} disabled={!form.country_id}>
                  <option value="">Select State</option>
                  {states.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>City</label>
                <select className={inp} value={form.city_id} onChange={e => set('city_id', e.target.value)} disabled={!form.state_id}>
                  <option value="">Select City</option>
                  {cities.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Pincode</label>
                <input className={inp} placeholder="e.g. 110001" value={form.pincode} onChange={e => set('pincode', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* AGENT */}
        {activeTab === 'agent' && (
          <div className="space-y-5">
            <SectionHeader icon={User} title="Agent / Representative" desc="Primary contact person or agent for this DMC" />
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={lbl}>Agent Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} placeholder="Full name" value={form.agentName} onChange={e => set('agentName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Designation</label>
                <input className={inp} placeholder="e.g. Sales Manager" value={form.agentDesignation} onChange={e => set('agentDesignation', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Agent Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} placeholder="+91 98765 43210" value={form.agentPhone} onChange={e => set('agentPhone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Agent Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} type="email" placeholder="agent@yourdmc.com" value={form.agentEmail} onChange={e => set('agentEmail', e.target.value)} />
                </div>
              </div>
              <div className="col-span-2">
                <label className={lbl}>Agent Address</label>
                <textarea className={inp + ' resize-none h-20'} placeholder="Agent's office or field address..." value={form.agentAddress} onChange={e => set('agentAddress', e.target.value)} />
              </div>
            </div>
          </div>
        )}


        {/* QUERY SETTINGS */}
        {activeTab === 'query' && (
          <div className="space-y-6">
            <SectionHeader icon={Users} title="Query Settings" desc="How incoming queries are handled, assigned and prioritised" />
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={lbl}>Assignment Method</label>
                <select className={inp} value={form.assignMethod} onChange={e => set('assignMethod', e.target.value)}>
                  {ASSIGN_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>SLA Response Time (hours)</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className={inp + ' pl-9'} type="number" min="1" placeholder="24" value={form.slaHours} onChange={e => set('slaHours', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Default Priority</label>
                <select className={inp} value={form.defaultPriority} onChange={e => set('defaultPriority', e.target.value)}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Method cards */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Assignment Method</p>
              <div className="grid grid-cols-3 gap-4">
                {ASSIGN_METHODS.map(method => (
                  <div key={method} onClick={() => set('assignMethod', method)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.assignMethod === method ? 'border-[#4b49ac] bg-[#4b49ac]/5' : 'border-border hover:border-[#4b49ac]/30'}`}>
                    <p className={`text-sm font-semibold mb-1 ${form.assignMethod === method ? 'text-[#4b49ac]' : 'text-foreground'}`}>{method}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {method === 'Auto Assign'   && 'System assigns queries to available members automatically'}
                      {method === 'Manual Assign' && 'Team leader manually assigns each query to a member'}
                      {method === 'Round Robin'   && 'Queries distributed equally in rotation among members'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Query sources */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Accepted Query Sources</p>
              <div className="flex flex-wrap gap-2">
                {QUERY_SOURCES.map(source => {
                  const selected = querySources.includes(source);
                  return (
                    <button key={source} onClick={() => toggleSource(source)}
                      className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                        selected
                          ? 'border-[#4b49ac] bg-[#4b49ac] text-white'
                          : 'border-border text-muted-foreground hover:border-[#4b49ac]/40'
                      }`}>
                      {source}
                    </button>
                  );
                })}
              </div>
              {querySources.length > 0 && (
                <p className="text-xs text-[#4b49ac] font-medium mt-2">{querySources.length} source{querySources.length > 1 ? 's' : ''} selected</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Save */}
      <div className="flex justify-end mt-4">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-60 shadow-sm">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-border">
      <div className="p-2 rounded-lg bg-[#4b49ac]/10">
        <Icon className="w-5 h-5 text-[#4b49ac]" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
