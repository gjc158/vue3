import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    loading?: boolean;
  }
  export interface Axios {
    request<T = any, R = T, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  }
}