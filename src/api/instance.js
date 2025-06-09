import axios from "axios";

export const instance = axios.create({
  baseURL: "http://10.10.0.88:8000/api/v2",
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
