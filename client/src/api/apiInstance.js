import axios from "axios";

// Create base Axios instance
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

// Request interceptor to add token
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiInstance;
