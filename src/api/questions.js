import axios from "axios";

const API_URL = "http://80.253.19.93:8000/api/v2/question";

export const getQuestion = async () => {
  try {
    const res = await axios.get(`${API_URL}/1`, {
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
    }
  }
};