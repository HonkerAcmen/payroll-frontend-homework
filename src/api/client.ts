import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/api";

export const api = axios.create({
  baseURL: "http://localhost:8080/api", // 后端 API 地址
  timeout: 8000,
});

// 自动注入 JWT
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理统一响应格式和 token 失效
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // 处理统一响应格式 {code, message, data}
    if (response.data && typeof response.data === 'object' && 'code' in response.data) {
      // 如果 code 不是 "0"，视为错误
      if (response.data.code !== "0") {
        return Promise.reject(new Error(response.data.message || '请求失败'));
      }
      // 返回 data 字段
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (typeof window !== "undefined") {
      // 401 未授权，清除 token 并跳转到登录页
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        // 避免在登录页重复跳转
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
