import axios from "axios";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

// Response interceptor to handle logout scenarios
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Allow authentication routes to show errors normally
    const url = error.config?.url;
    if (
      url &&
      (url.includes("/auth/login") || url.includes("/auth/register"))
    ) {
      return Promise.reject(error);
    }

    // If user is logged out, don't show error toasts for other routes
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("User logged out, blocking request:", url);
      return Promise.reject(new Error("User logged out"));
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
