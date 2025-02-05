import axios from "axios";

const API_URL = "http://80.253.19.93:8000/api/v2/users";

export const createUser = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/registration`, {
      password: `${password}`,
      username: `${username}`,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(`ERROR: ${error.message}`);
    }
  }
};
// export const users = axios.create({
//    baseURL: "http://80.253.19.93:8000/api/v2/users",
//  });

// export const getPosts = async () => {
//   try {
//     const res = await axios.get(`${API_URL}/posts`, {
//       params: { offset: 0, limit: 10 },
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     console.log(res.data);
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.log(error);
//     }
//   }
// }
