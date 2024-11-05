import axios from "axios";
import { getCookie } from "./tokenHelpers";

const request = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API_URI}`,
});

request.interceptors.request.use((config) => {
  const token = getCookie(import.meta.env.VITE_AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `${
      import.meta.env.VITE_AUTH_BEARER
    } ${token}`;
  }

  return config;
});

export default request;

export const requestWithAuth = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API_URI}`,
  headers: {
    Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
      import.meta.env.VITE_AUTH_TOKEN
    )}`,
  },
});
