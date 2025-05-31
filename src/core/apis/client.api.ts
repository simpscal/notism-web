/* eslint-disable @typescript-eslint/no-explicit-any */

// Core API types
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

// Interceptor types
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
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private interceptors: Interceptors;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * Apply request interceptors
   */
  private async _applyRequestInterceptors(config: RequestConfig) {
    let modifiedConfig = { ...config };

    for (const interceptor of this.interceptors.request) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async _applyResponseInterceptors(response: Response) {
    let modifiedResponse = response;

    for (const interceptor of this.interceptors.response) {
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
      url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
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

  /**
   * Process fetch response
   */
  private async _processResponse<T = any>(response: Response) {
    const contentType = response.headers.get('content-type');
    let data: T;

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }
    } catch {
      throw new Error('Failed to parse response');
    }

    const processedResponse: ApiResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };

    if (!response.ok) {
      const error: ApiError = {
        message:
          (data as any)?.message || response.statusText || 'Request failed',
        status: response.status,
        data,
      };
      throw error;
    }

    return processedResponse;
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(endpoint: string, options: RequestConfig = {}) {
    const { params, ...requestOptions } = options;
    const url = this._buildUrl(endpoint, params);

    let config: RequestConfig = {
      ...requestOptions,
      headers: {
        ...this.defaultHeaders,
        ...requestOptions.headers,
      },
    };

    // Apply request interceptors
    config = await this._applyRequestInterceptors(config);

    try {
      let response = await fetch(url, config);

      // Apply response interceptors
      response = await this._applyResponseInterceptors(response);

      return await this._processResponse<T>(response);
    } catch (error: any) {
      // Handle AbortError (timeout)
      if (error.name === 'AbortError') {
        const timeoutError: ApiError = {
          message: 'Request timeout',
          status: 408,
          data: null,
        };

        throw timeoutError;
      }

      // Re-throw API errors
      if (error.status) {
        throw error;
      }

      // Handle network errors
      const networkError: ApiError = {
        message: error.message || 'Network error occurred',
        status: 0,
        data: null,
      };

      throw networkError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options: RequestConfig = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any, D = any>(
    endpoint: string,
    data?: D,
    options: RequestConfig = {}
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any, D = any>(
    endpoint: string,
    data?: D,
    options: RequestConfig = {}
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any, D = any>(
    endpoint: string,
    data?: D,
    options: RequestConfig = {}
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options: RequestConfig = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and configure API client instance
export const apiClient = new ApiClient({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  defaultHeaders: {
    Accept: 'application/json',
  },
});

// Add authentication interceptor
apiClient.addRequestInterceptor(async (config: RequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor for handling auth errors
apiClient.addResponseInterceptor(async (response: Response) => {
  return response;
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
