export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(baseUrl = "", additionalHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl
    this.headers = {
      "Content-Type": "application/json",
      ...additionalHeaders,
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = { ...this.headers, ...customHeaders }

    const config: RequestInit = {
      method,
      headers,
    }

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`)
    }

    return data
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, headers)
  }

  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("POST", endpoint, body, headers)
  }

  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("PUT", endpoint, body, headers)
  }

  async patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("PATCH", endpoint, body, headers)
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, headers)
  }
}

export const apiClient = new ApiClient("/api")
