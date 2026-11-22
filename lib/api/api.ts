import axios from "axios";

export const proxyServer = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
