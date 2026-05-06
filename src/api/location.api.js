import api from './axios';

// GET
export const getCountries = async () => {
  const response = await api.get('/locations/countries');
  return response.data;
};

export const getActiveCountries = async () => {
  const response = await api.get('/locations/activecountries');
  return response.data;
}

// CREATE
export const newCountry = async (name, description, status) => {
  const response = await api.post('/locations/countries', {
    name,
    description,
    status
  });
  return response.data;
};

// ✅ UPDATE
export const updateCountry = async (id, name, description, status) => {
  const response = await api.put(`/locations/countries/${id}`, {
    name,
    description,
    status
  });
  return response.data;
};

// ✅ DELETE
export const deleteCountry = async (id) => {
  const response = await api.delete(`/locations/countries/${id}`);
  return response.data;
};

/* ===========================
   STATE APIs
=========================== */

// ✅ GET STATES BY COUNTRY
export const getStatesByCountry = async (countryId) => {
  const response = await api.get(`/locations/states/${countryId}`);
  return response.data;
};

export const getActiveStatesByCountry = async (countryId) => {
  const response = await api.get(`/locations/activestates/${countryId}`);
  return response.data;
};

// ✅ CREATE STATE
export const newState = async (name, description, countryId, status) => {
  const response = await api.post('/locations/states', {
    name,
    description,
    countryId,
    status
  });
  return response.data;
};

// ✅ UPDATE STATE
export const updateState = async (id, name, description, countryId, status) => {
  const response = await api.put(`/locations/states/${id}`, {
    name,
    description,
    countryId,
    status
  });
  return response.data;
};

// ✅ DELETE STATE
export const deleteState = async (id) => {
  const response = await api.delete(`/locations/states/${id}`);
  return response.data;
};

/* ===========================
   CITY APIs
=========================== */

// ✅ GET CITIES BY STATE
export const getCitiesByState = async (stateId) => {
  const response = await api.get(`/locations/cities/${stateId}`);
  return response.data;
};

export const getActiveCitiesByState = async (stateId) => {
  const response = await api.get(`/locations/activecities/${stateId}`);
  return response.data;
};

// ✅ CREATE CITY
export const newCity = async (name, description, stateId, status) => {
  const response = await api.post('/locations/cities', {
    name,
    description,
    stateId,
    status
  });
  return response.data;
};

// ✅ UPDATE CITY
export const updateCity = async (id, name, description, stateId, status) => {
  const response = await api.put(`/locations/cities/${id}`, {
    name,
    description,
    stateId,
    status
  });
  return response.data;
};

// ✅ DELETE CITY
export const deleteCity = async (id) => {
  const response = await api.delete(`/locations/cities/${id}`);
  return response.data;
};