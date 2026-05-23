import api from './axios';

/* ===========================
   ROLES APIs
=========================== */

// ✅ GET ALL ROLES
export const getRoles = async () => {
  const response = await api.get('/roles');
  return response.data;
};

export const getActiveRoles = async () => {
  const response = await api.get('/roles/active');
  return response.data;
};

// ✅ GET SINGLE ROLE
export const getRoleById = async (id) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

// ✅ CREATE ROLE
export const newRole = async (
  role_name,
  description,
  permissions,
  menu_ids = []
) => {

  const response = await api.post('/roles', {
    role_name,
    description,
    permissions,
    menu_ids
  });

  return response.data;
};

export const updateRole = async (
  id,
  payload
) => {

  const response = await api.put(
    `/roles/${id}`,
    payload
  );

  return response.data;

};

// ✅ DELETE ROLE
export const deleteRole = async (id) => {

  const response = await api.delete(`/roles/${id}`);

  return response.data;
};