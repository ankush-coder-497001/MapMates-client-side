const API_URL = import.meta.env.VITE_SERVER_URL + "/api" || "http://localhost:5001/api";
import axios from "axios";
//create instance 
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

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

export const Login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const Register = async (userData) => {
  try {
    const response = await api.post("/users/register", { email: userData.email, password: userData.password, name: userData.fullName });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const ResetPassword = async (data) => {
  try {
    const response = await api.put("/users/reset-password", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const SendOTP = async (email) => {
  try {
    const response = await api.post("/users/send-otp", { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const VerifyOTP = async (data) => {
  try {
    const response = await api.post("/users/verify-otp", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const ForgotPassword = async (data) => {
  try {
    const response = await api.put("/users/forgot-password", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const GetUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const UpdateUserProfile = async (data) => {
  try {
    const formData = new FormData();
    if (data.profilePic) formData.append("image", data.file);
    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    const response = await axios.put(`${API_URL}/users/profile`, formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("chat_token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const SaveLocation = async (location) => {
  try {
    const response = await api.put("/users/update-location", location);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const UpdateUserStatus = async (Data) => {
  try {
    const response = await api.put("/users/admin/update-status", Data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await api.get("/users/admin/get-all-users");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const chatHistory = async (roomId, { before, limit } = {}) => {
  try {
    let url = `/chat/history/${roomId}`;
    const params = [];
    if (before) params.push(`before=${encodeURIComponent(before)}`);
    if (limit) params.push(`limit=${limit}`);
    if (params.length) url += `?${params.join('&')}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const getMemberList = async (roomId) => {
  try {
    const response = await api.get(`/chat/member-list/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export const getMyRooms = async () => {
  try {
    const response = await api.get(`/chat/my-rooms`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export const haveRoom = async () => {
  try {
    const response = await api.get(`/users/have-room`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export const SaveFCMToken = async (FCM) => {
  try {
    const res = await api.put('/users/save-FCM', { FCM });
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}