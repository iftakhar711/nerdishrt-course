import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) window.location.href = "/login";
    return Promise.reject(error);
  }
);

export default api;
