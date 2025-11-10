import axios from "axios";

const API = axios.create({
  baseURL: process.env.baseURL || "http://localhost:5000/api",
  timeout: 10000,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default API;
