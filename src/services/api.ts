import type {
  LoginCredentials,
  RegisterData,
  User,
  Property,
  PropertyFilters,
  PaginatedResponse,
  CreatePropertyData,
} from '@/types';

// Configure your API base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  // Property endpoints
  async getProperties(
    filters: PropertyFilters = {},
    page: number = 0,
    size: number = 12
  ): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.listingType) params.append('listingType', filters.listingType);
    if (filters.status) params.append('status', filters.status);

    return this.request(`/properties?${params.toString()}`);
  }

  async getPropertyById(id: string): Promise<Property> {
    return this.request(`/properties/${id}`);
  }

  async getMyProperties(page: number = 0, size: number = 12): Promise<PaginatedResponse<Property>> {
    return this.request(`/properties/my?page=${page}&size=${size}`);
  }

  async createProperty(data: CreatePropertyData): Promise<Property> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: Partial<CreatePropertyData>): Promise<Property> {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Get available cities for filter dropdown
  async getCities(): Promise<string[]> {
    return this.request('/properties/cities');
  }
}

export const api = new ApiService();
