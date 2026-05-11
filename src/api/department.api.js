import api from './axios';

/**
 * GET ALL DEPARTMENTS
 */
export const getDepartments = async () => {
  const response = await api.get('/departments');
  return response.data;
};

/**
 * GET ACTIVE DEPARTMENTS
 */
export const getActiveDepartments = async () => {
  const response = await api.get('/departments/active');
  return response.data;
};

/**
 * GET SINGLE DEPARTMENT BY ID
 */
export const getDepartmentById = async (id) => {
  const response = await api.get(`/departments/${id}`);
  return response.data;
};

/**
 * CREATE NEW DEPARTMENT
 */
export const newDepartment = async (
  name,
  description,
  head_of_department,
  employee_count,
  budget,
  country_id,
  state_id,
  city_id,
  status
) => {

  const response = await api.post('/departments', {
    name,
    description,
    head_of_department,
    employee_count,
    budget,
    country_id,
    state_id,
    city_id,
    status
  });

  return response.data;
};

/**
 * UPDATE DEPARTMENT
 */
export const updateDepartment = async (
  id,
  name,
  description,
  head_of_department,
  employee_count,
  budget,
  country_id,
  state_id,
  city_id,
  status
) => {

  const response = await api.put(`/departments/${id}`, {
    name,
    description,
    head_of_department,
    employee_count,
    budget,
    country_id,
    state_id,
    city_id,
    status
  });

  return response.data;
};

/**
 * DELETE DEPARTMENT
 */
export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};