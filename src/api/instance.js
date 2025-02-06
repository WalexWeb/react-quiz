import axios from "axios"

export const instance = axios.create({
   baseURL: "http://80.253.19.93:8000/api/v2",
   withCredentials: false
});

// Добавляем токен к каждому запросу
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);