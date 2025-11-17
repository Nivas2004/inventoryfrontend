import axios from "axios";

// 🔥 Change this to your deployed backend OR local server
const API_URL = "https://inventorybackend-6.onrender.com";

// ------------------------------
// GET ALL PRODUCTS OF ONE USER
// ------------------------------
export const getProducts = (userId) =>
  axios.get(`${API_URL}/products/user/${userId}`);


// ------------------------------
// ADD PRODUCT (includes userId)
// ------------------------------
export const addProduct = (data) =>
  axios.post(`${API_URL}/products/`, data);


// ------------------------------
// GET A SINGLE PRODUCT (protected by user)
// ------------------------------
export const getProductById = (id, userId) =>
  axios.get(`${API_URL}/products/${id}/${userId}`);


// ------------------------------
// UPDATE PRODUCT (protected)
// ------------------------------
export const updateProduct = (id, userId, data) =>
  axios.put(`${API_URL}/products/${id}/${userId}`, data);


// ------------------------------
// DELETE PRODUCT (protected)
// ------------------------------
export const deleteProduct = (id, userId) =>
  axios.delete(`${API_URL}/products/${id}/${userId}`);
