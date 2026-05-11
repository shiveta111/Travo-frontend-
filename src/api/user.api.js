import api from './axios';
import axios from 'axios';

export const getUsers = async (role_id = 0) => {

  const response = await api.post('/users/get-all-users', { role_id });

  return response.data;

};


export const getUserById = async (id) => {

  const response = await api.get(`/users/${id}`);

  return response.data;

};

// POST /users  — create a new user
// payload shape: { username, first_name, last_name, email, secondary_email, phone, password, confirm_password,
//                  profile_picture, join_date, country, state, city, department, role, status }
export const createUser = async (payload) => {

  const response = await api.post('/users/create-user', payload);

  return response.data;

};

export const updateUserStatus = async (userId, status) => {

  const response = await api.patch(`/users/update-status/${userId}`, { status });

  return response.data;

};

export const updateUser = async (userId, payload) => {

  const response = await api.put(`/users/update-user/${userId}`, payload);

  return response.data;

};

export const checkUsernameAvailability = async (username) => {
  const response = await api.get(`/users/check-username/${username}`);
  return response.data;
};

export const generateUsername = async (first_name, last_name) => {
  const response = await api.get(`/users/generate-username`, {
    params: { first_name, last_name }
  });
  return response.data;
};

export const uploadProfilePicture = async (file) => {

  const formData = new FormData();
  formData.append('profile_picture', file);

  // Use base axios to bypass the default application/json header set in the 'api' instance
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const response = await axios.post(`${apiUrl}/uploads/profiles`, formData);

  return response.data;

};