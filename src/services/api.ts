/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL, getToken } from "@/lib/utils";

export const $http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const withAuthHeaders = async (
  config: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
  const token = await getToken();

  return {
    ...config,
    headers: {
      ...config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

const withAuth = {
  get: async <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const finalConfig = await withAuthHeaders(config);
    return $http.get<T>(url, finalConfig);
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const finalConfig = await withAuthHeaders(config);
    return $http.post<T>(url, data, finalConfig);
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const finalConfig = await withAuthHeaders(config);
    return $http.put<T>(url, data, finalConfig);
  },

  delete: async <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const finalConfig = await withAuthHeaders(config);
    return $http.delete<T>(url, finalConfig);
  },
};

const withoutAuth = {
  get: <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => $http.get<T>(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => $http.post<T>(url, data, config),

  put: <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => $http.put<T>(url, data, config),

  delete: <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => $http.delete<T>(url, config),
};

export { withoutAuth, withAuth };