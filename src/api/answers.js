import axios from "axios";

export const answers = axios.create({
   baseURL: "http://127.0.0.1:8000/api/v2/answers",
 });