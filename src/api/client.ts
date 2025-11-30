import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/api";
import { message } from "antd";

export const api = axios.create({
  baseURL: "http://localhost:8080/api", // 后端 API 地址
  timeout: 8000,
});

// 自动注入 JWT
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    message.error("请求发送失败");
    return Promise.reject(error);
  }
);

// 响应拦截器：处理统一响应格式和全局错误
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // 如果返回数据包含 code 字段
    if (
      response.data &&
      typeof response.data === "object" &&
      "code" in response.data
    ) {
      const res = response.data;
      if (res.code !== "0") {
        // 优先显示 response.data.error，然后 message
        message.error(res.message || "请求失败");
        return Promise.reject(new Error(res.message || "请求失败"));
      }
      // 返回 data 字段
      return { ...response, data: res.data };
    }
    return response;
  },
  (error) => {
    // 网络错误 / 服务器错误
    if (typeof window !== "undefined") {
      if (error.response) {
        // 401 未授权
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          message.error("登录已过期，请重新登录");
        } else if (error.response.data?.error) {
          // 后端返回 error 字段
          message.error(error.response.data.error);
        } else {
          message.error(error.response.data?.message || "服务器响应异常");
        }
      } else if (error.request) {
        message.error("请求未发送成功，请检查网络");
      } else {
        message.error(error.message || "未知错误");
      }
    }
    return Promise.reject(error);
  }
);
