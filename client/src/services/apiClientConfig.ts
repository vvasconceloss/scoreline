import axios from "axios";

export const apiClientConfig = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});