import axios from "axios"

export const instance = axios.create({
   baseURL: "http://80.253.19.93:8000",
   withCredentials: false
})