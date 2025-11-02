// frontend/src/api/api.ts
import axios from "axios";

// ✅ Setup base URL for backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===============================
// 🧾 AUTH ENDPOINTS
// ===============================
export const register = (data: { name: string; email: string; password: string }) =>
  API.post("/auth/register", data);

export const login = (data: { email: string; password: string; role: "user" | "admin" }) =>
  API.post("/auth/login", data);

// ===============================
// 🍬 SWEETS ENDPOINTS
// ===============================
export const listSweets = () => API.get("/sweets");

export const searchSweets = (params: {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) => API.get("/sweets/search", { params });

export const addSweet = (data: {
  name: string;
  category: string;
  price: number;
  quantity?: number;
}) => API.post("/sweets", data);

export const updateSweet = (
  id: number,
  data: Partial<{ name: string; category: string; price: number; quantity: number }>
) => API.put(`/sweets/${id}`, data);

export const deleteSweet = (id: number) => API.delete(`/sweets/${id}`);

export const purchaseSweet = (id: number) => API.post(`/sweets/${id}/purchase`);

export const restockSweet = (id: number, amount: number) =>
  API.post(`/sweets/${id}/restock`, { amount });

export default API;
