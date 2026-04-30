// // src/services/api.js
// import axios from 'axios';

// const API_URL = '/api/users';  // No need to specify localhost:5000

// // Function to get all users
// export const getAllUsers = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error('There was an error fetching users!', error);
//     throw error;
//   }
// };

// // Function to get a user by ID
// export const getUserById = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('There was an error fetching the user!', error);
//     throw error;
//   }
// };