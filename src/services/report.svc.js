const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/report";
import axios from "axios";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chat_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createReport = async (reportData) => {
  try {
    const response = await api.post("/", reportData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const getAllReports = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const takeActionOnReport = async (reportId, action) => {
  try {
    const response = await api.post("/action", { reportId, action });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};