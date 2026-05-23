import axios from './axios';

export const getMenus = async (tree = false) => {
  const response = await axios.get(`/menus?tree=${tree}`);
  return response.data;
};

export const getMyMenus = async () => {
  const response = await axios.get('/menus/my-menus');
  return response.data;
};

export const createMenu = async (menuData) => {
  const response = await axios.post('/menus', menuData);
  return response.data;
};

export const updateMenu = async (id, menuData) => {
  const response = await axios.put(`/menus/${id}`, menuData);
  return response.data;
};

export const deleteMenu = async (id) => {
  const response = await axios.delete(`/menus/${id}`);
  return response.data;
};
