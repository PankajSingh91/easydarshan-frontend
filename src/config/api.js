import axios from "axios";
import { getToken } from "../utils/auth";

export const API_BASE_URL = "http://localhost:5001";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
