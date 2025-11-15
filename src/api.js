import axios from "axios";

const API_URL = "https://inventorybackend-3.onrender.com";

export const getProducts = () => axios.get(`${API_URL}/products/`);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);

export const addProduct = (data) =>
  axios.post(`${API_URL}/products/`, data);

export const getProductById = (id) =>
  axios.get(`${API_URL}/products/${id}`);

export const updateProduct = (id, data) =>
  axios.put(`${API_URL}/products/${id}`, data);
