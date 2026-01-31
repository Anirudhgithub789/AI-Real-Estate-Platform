// User types
export type UserRole = 'OWNER' | 'BUYER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Property types
export type PropertyType = 'FLAT' | 'VILLA' | 'PLOT';
export type PropertyStatus = 'AVAILABLE' | 'SOLD' | 'PENDING';
export type ListingType = 'BUY' | 'RENT';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  imageUrl?: string;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  listingType?: ListingType;
  status?: PropertyStatus;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  imageUrl?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
