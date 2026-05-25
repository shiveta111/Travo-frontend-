import api from './axios';

// Priority value mapping (API ↔ UI)
// API scale: 0=Low, 1=Medium, 2=High
const PRIORITY_TO_NUMBER = { Low: 0, Normal: 0, Medium: 1, High: 2, Urgent: 2 };
const PRIORITY_TO_LABEL   = { 0: 'Low', 1: 'Medium', 2: 'High' };

/**
 * Map a raw API lead object → the frontend Lead shape.
 * Handles missing / null fields gracefully with sensible defaults.
 */
export const mapApiLead = (apiLead) => {
  const today = new Date().toISOString().split('T')[0];

  // Derive a display date string from created_at
  let displayDate = 'Today';
  let dateValue   = today;
  if (apiLead.created_at) {
    const d = new Date(apiLead.created_at);
    // Guard: skip if date is invalid (e.g. MySQL "0000-00-00" or null)
    if (!isNaN(d.getTime())) {
      dateValue    = d.toISOString().split('T')[0];
      displayDate  = dateValue === today
        ? `Today ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
        : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }
  }

  // Format budget as ₹ string for display
  const budgetNum = Number(apiLead.budget_max);
  const budgetStr = budgetNum
    ? `₹${budgetNum.toLocaleString('en-IN')}`
    : '₹0';

  return {
    id:             String(apiLead.id ?? ''),
    client:         apiLead.client_name  ?? '',
    phone:          apiLead.client_phone ?? '',
    email:          apiLead.client_email ?? '',
    dest:           apiLead.destination  ?? '',
    travelDate:     apiLead.travel_from  ?? '',
    days:           apiLead.days         ?? '',
    nights:         apiLead.nights       ?? '',
    travellers:     apiLead.pax_adults   ?? '',
    budget:         budgetStr,
    source:         apiLead.source       ?? 'Field Visit',
    priority:       PRIORITY_TO_LABEL[apiLead.priority] ?? 'Normal',
    assignedLeader: apiLead.assigned_to  ?? 'Auto Assign Pending',
    status:         apiLead.status       ?? 'new',
    sla:            apiLead.sla          ?? 'OK',
    date:           displayDate,
    dateValue,
    progress:       Number(apiLead.progress ?? 20),
    followUpDate:   apiLead.follow_up_date ?? '',
    remarks:        apiLead.requirements   ?? '',
  };
};

/**
 * GET ALL LEADS  (supports optional server-side filters as query params)
 * POST /leads/all?priority=2&source=website&destination=Dubai
 *
 * @param {Object} filters  – any of { priority, source, destination, created_date }
 *                            pass raw UI values; the function converts priority to number.
 */
export const getAllLeads = async (filters = {}) => {
  const params = {};

  if (filters.priority && filters.priority !== 'all') {
    params.priority = PRIORITY_TO_NUMBER[filters.priority] ?? filters.priority;
  }
  if (filters.source && filters.source !== 'all') {
    params.source = filters.source;
  }
  if (filters.destination) {
    params.destination = filters.destination;
  }
  if (filters.created_date) {
    params.created_date = filters.created_date;
  }

  const response = await api.get('/leads/all', { params });
  return response.data;
};

/**
 * CREATE LEAD
 * POST /leads/create
 *
 * @param {Object} formValues  – the UI leadForm shape
 * @returns the created lead from the API
 */
export const createLead = async (formValues) => {
  // Strip non-numeric characters from budget string (e.g. "₹1,00,000" → 100000)
  const budgetNum = Number(String(formValues.budget ?? '').replace(/[^0-9.]/g, '')) || 0;

  const payload = {
    client_name:  formValues.client,
    client_email: formValues.email,
    client_phone: formValues.phone,
    destination:  formValues.dest,
    travel_from:  formValues.travelDate,
    days:         Number(formValues.days)       || 0,
    nights:       Number(formValues.nights)     || 0,
    pax_adults:   Number(formValues.travellers) || 0,
    budget_max:   budgetNum,
    currency:     'INR',
    requirements: formValues.remarks,
    priority:     PRIORITY_TO_NUMBER[formValues.priority] ?? 0,
  };

  const response = await api.post('/leads/create', payload);
  return response.data;
};
