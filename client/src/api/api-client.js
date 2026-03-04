import axios from "axios";
import { HOST } from "@/utils/constants";

export const apiClient = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
  timeout: 10000,
});

//  Global response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("REAL ERROR:", error.response?.data);
    return Promise.reject(error);
  }
);