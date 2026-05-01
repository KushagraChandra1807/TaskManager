import axios from "axios";

const API = axios.create({
  baseURL: "taskmanager-production-e707.up.railway.app",
});

// 🔥 attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token); // debug

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;