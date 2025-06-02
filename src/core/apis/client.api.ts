/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenManagerUtils } from '@/shared/utils';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export interface ApiClientConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
}

export type RequestInterceptor = (
  config: RequestConfig
) => Promise<RequestConfig> | RequestConfig;
export type ResponseInterceptor = (
  response: Response
) => Promise<Response> | Response;

export interface Interceptors {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
}

export class ApiClient {
  private _baseURL: string;
  private _defaultHeaders: Record<string, string>;
  private _interceptors: Interceptors;
  private _failedQueue: {
    resolve: (value: unknown) => void;
    reject: (value: unknown) => void;
    originalEndpoint: string;
    originalConfig: RequestConfig;
  }[] = [];
  private _isRefreshing = false;

  constructor(config: ApiClientConfig = {}) {
    this._baseURL = config.baseURL || '';
    this._defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
    this._interceptors = {
      request: [],
      response: [],
    };
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this._interceptors.request.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this._interceptors.response.push(interceptor);
  }

  async get<T = any>(endpoint: string, options: RequestConfig = {}) {
    return this._request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any, D = any>(
    endpoint: string,
    data?: D,
    options: RequestConfig = {}
  ) {
    return this._request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any, D = any>(
    endpoint: string,
    data?: D,
    options: RequestConfig = {}
  ) {
    return this._request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any, D = any>(
    endpoint: string,
    data?: D,
    options: RequestConfig = {}
  ) {
    return this._request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options: RequestConfig = {}) {
    return this._request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Apply request interceptors
   */
  private async _applyRequestInterceptors(config: RequestConfig) {
    let modifiedConfig = { ...config };

    for (const interceptor of this._interceptors.request) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async _applyResponseInterceptors(response: Response) {
    let modifiedResponse = response;

    for (const interceptor of this._interceptors.response) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Build full URL with query parameters
   */
  private _buildUrl(endpoint: string, params?: Record<string, any>) {
    let url: string;

    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      url = `${this._baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    }

    // Add query parameters
    if (params && Object.keys(params).length > 0) {
      const urlObj = new URL(url);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlObj.searchParams.append(key, String(value));
        }
      });

      url = urlObj.toString();
    }

    return url;
  }

  private async _processResponse<T = any>(response: Response) {
    const contentType = response.headers.get('content-type');
    const data =
      contentType && contentType.includes('application/json')
        ? ((await response.json()) as T)
        : ((await response.text()) as T);

    if (!response.ok) {
      throw {
        message:
          (data as any)?.message || response.statusText || 'Request failed',
        status: response.status,
        data,
      } as ApiError;
    }

    return data;
  }

  /**
   * Make HTTP request
   */
  private async _request<T = any>(
    endpoint: string,
    options: RequestConfig = {}
  ) {
    const { params, ...requestOptions } = options;

    let config: RequestConfig = {
      ...requestOptions,
      headers: {
        ...this._defaultHeaders,
        ...requestOptions.headers,
      },
    };

    config = await this._applyRequestInterceptors(config);

    try {
      let response = await fetch(this._buildUrl(endpoint, params), config);

      if (response.status === 401) {
        return this._handleTokenRefresh(endpoint, config);
      }

      response = await this._applyResponseInterceptors(response);

      return await this._processResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const timeoutError: ApiError = {
          message: 'Request timeout',
          status: 408,
          data: null,
        };

        throw timeoutError;
      }

      if (error.status) {
        throw error;
      }

      const networkError: ApiError = {
        message: error.message || 'Network error occurred',
        status: 0,
        data: null,
      };

      throw networkError;
    }
  }

  /**
   * Handle token refresh logic
   */
  private async _handleTokenRefresh(
    originalEndpoint: string,
    originalConfig: RequestConfig
  ): Promise<any> {
    if (this._isRefreshing) {
      return new Promise((resolve, reject) => {
        this._failedQueue.push({
          resolve,
          reject,
          originalEndpoint,
          originalConfig,
        });
      });
    }

    this._isRefreshing = true;

    const refreshToken = tokenManagerUtils.getRefreshToken();

    if (!refreshToken || tokenManagerUtils.isTokenExpired(refreshToken)) {
      this._handleTokenError();
    }

    try {
      const response = await fetch(`${this._baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this._handleTokenError();
      }

      const data = await response.json();
      if (!data.accessToken) {
        this._handleTokenError();
      }

      tokenManagerUtils.setToken(data.accessToken);
      tokenManagerUtils.setRefreshToken(data.refreshToken);

      this._failedQueue.forEach(request => {
        request.resolve(
          this._request(request.originalEndpoint, request.originalConfig)
        );
      });

      this._failedQueue = [];
      this._isRefreshing = false;

      return this._request(originalEndpoint, originalConfig);
    } catch {
      this._handleTokenError();
    }
  }

  private _handleTokenError() {
    tokenManagerUtils.clearAll();
    window.location.href = '/login';

    throw new Error('Unauthorized: please log in again');
  }
}

export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  defaultHeaders: {
    Accept: 'application/json',
  },
});

// Authentication interceptor
apiClient.addRequestInterceptor(async (config: RequestConfig) => {
  const token = tokenManagerUtils.getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add request logging in development
if (process.env.NODE_ENV === 'development') {
  apiClient.addRequestInterceptor(async (config: RequestConfig) => {
    console.log('🚀 API Request:', config.method, config);
    return config;
  });

  apiClient.addResponseInterceptor(async (response: Response) => {
    console.log('📡 API Response:', response.status, response.url);
    return response;
  });
}
