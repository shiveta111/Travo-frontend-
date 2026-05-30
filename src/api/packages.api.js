import api from './axios';

/**
 * Map a raw API package object → frontend Package shape
 */
export const mapApiPackage = (pkg) => ({
  id:          String(pkg.id ?? ''),
  title:       pkg.package_title ?? pkg.title ?? '',
  destination: pkg.destination   ?? '',
  category:    pkg.category      ?? '',
  days:        Number(pkg.days   ?? 0),
  nights:      Number(pkg.nights ?? 0),
  price:       pkg.quotation_price
                 ? `₹${Number(pkg.quotation_price).toLocaleString('en-IN')}`
                 : '₹0',
  priceRaw:    Number(pkg.quotation_price ?? 0),
  hotelType:   pkg.hotel_type    ?? '',
  transport:   pkg.transport     ?? '',
  pax:         Number(pkg.pax    ?? 0),
  status:      pkg.status        ?? 'draft',
  inclusions:  pkg.inclusions    ?? '',
  exclusions:  pkg.exclusions    ?? '',
  terms:       pkg.terms_conditions ?? '',
  createdBy:   pkg.created_by    ?? null,
  leadId:      pkg.lead_id       ?? null,
  dayPlans:    Array.isArray(pkg.itinerary)
    ? pkg.itinerary.map((d) => ({
        day:        Number(d.day_number ?? d.day ?? 0),
        title:      d.day_title  ?? d.title      ?? '',
        city:       d.city       ?? '',
        activities: d.activities ?? '',
        stay:       d.stay       ?? '',
        meals:      d.meals      ?? '',
      }))
    : [],
});

/**
 * GET ALL PACKAGES
 * GET /packages/all  (optional ?category=X filter)
 */
export const getAllPackages = async (filters = {}) => {
  const response = await api.get('/packages/all', { params: filters });
  return response.data;
};

/**
 * SEARCH PACKAGES
 * GET /packages/search?q=X
 */
export const searchPackages = async (query) => {
  const response = await api.get('/packages/search', { params: { q: query } });
  return response.data;
};

/**
 * CREATE PACKAGE
 * POST /packages/create
 */
export const createPackage = async (formValues, createdBy = null) => {
  const budgetNum = Number(String(formValues.price ?? '').replace(/[^0-9.]/g, '')) || 0;

  const payload = {
    package_title:    formValues.title,
    destination:      formValues.destination,
    category:         formValues.category,
    days:             Number(formValues.days)   || 0,
    nights:           Number(formValues.nights) || 0,
    pax:              Number(formValues.pax)    || 0,
    quotation_price:  budgetNum,
    hotel_type:       formValues.hotelType   || '',
    transport:        formValues.transport   || '',
    inclusions:       formValues.inclusions  || '',
    exclusions:       formValues.exclusions  || '',
    terms_conditions: formValues.terms       || '',
    ...(createdBy  ? { created_by: createdBy }  : {}),
    ...(formValues.leadId ? { lead_id: formValues.leadId } : {}),
    itinerary: (formValues.dayPlans || []).map((d) => ({
      day_number:  d.day,
      day_title:   d.title,
      city:        d.city,
      stay:        d.stay,
      meals:       d.meals,
      activities:  d.activities,
    })),
  };

  const response = await api.post('/packages/create', payload);
  return response.data;
};

/**
 * DELETE PACKAGE
 * DELETE /packages/:id  (if available)
 */
export const deletePackage = async (packageId) => {
  const response = await api.delete(`/packages/${packageId}`);
  return response.data;
};

/**
 * GET PACKAGE BY ID
 * GET /packages/:id
 */
export const getPackageById = async (packageId) => {
  const response = await api.get(`/packages/${packageId}`);
  return response.data;
};
