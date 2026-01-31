import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { Pagination } from '@/components/Pagination';
import type { Property, PropertyFilters as Filters, PaginatedResponse } from '@/types';
import { api } from '@/services/api';
import { Loader2, Home } from 'lucide-react';

// Mock data for demo (replace with actual API calls)
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3BHK Apartment in Koramangala',
    description: 'A beautiful modern apartment with all amenities.',
    price: 8500000,
    city: 'Bangalore',
    address: 'Koramangala 4th Block',
    propertyType: 'FLAT',
    listingType: 'BUY',
    status: 'AVAILABLE',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    ownerId: '1',
    ownerName: 'John Doe',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Luxury Villa with Garden',
    description: 'Spacious villa with private garden and parking.',
    price: 25000000,
    city: 'Mumbai',
    address: 'Bandra West',
    propertyType: 'VILLA',
    listingType: 'BUY',
    status: 'AVAILABLE',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    ownerId: '2',
    ownerName: 'Jane Smith',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Premium Plot in Gurgaon',
    description: 'Prime location plot suitable for residential construction.',
    price: 15000000,
    city: 'Delhi',
    address: 'Sector 56, Gurgaon',
    propertyType: 'PLOT',
    listingType: 'BUY',
    status: 'PENDING',
    area: 2400,
    ownerId: '3',
    ownerName: 'Raj Kumar',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: '4',
    title: '2BHK Furnished Flat for Rent',
    description: 'Fully furnished flat with modern amenities.',
    price: 35000,
    city: 'Bangalore',
    address: 'HSR Layout',
    propertyType: 'FLAT',
    listingType: 'RENT',
    status: 'AVAILABLE',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    ownerId: '4',
    ownerName: 'Priya Sharma',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: '5',
    title: 'Sea-facing Villa in Goa',
    description: 'Beautiful sea-facing villa with private beach access.',
    price: 45000000,
    city: 'Goa',
    address: 'Candolim Beach Road',
    propertyType: 'VILLA',
    listingType: 'BUY',
    status: 'AVAILABLE',
    bedrooms: 5,
    bathrooms: 5,
    area: 4500,
    ownerId: '5',
    ownerName: 'Mike Johnson',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '6',
    title: 'Studio Apartment Near Metro',
    description: 'Compact studio apartment ideal for bachelors.',
    price: 18000,
    city: 'Delhi',
    address: 'Hauz Khas',
    propertyType: 'FLAT',
    listingType: 'RENT',
    status: 'AVAILABLE',
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    ownerId: '6',
    ownerName: 'Amit Verma',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
  },
];

const mockCities = ['Bangalore', 'Mumbai', 'Delhi', 'Goa', 'Pune', 'Chennai', 'Hyderabad'];

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState('');

  const fetchProperties = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Try to fetch from API first
      const response: PaginatedResponse<Property> = await api.getProperties(
        filters,
        currentPage - 1
      );
      setProperties(response.content);
      setTotalPages(response.totalPages);
    } catch {
      // Fallback to mock data for demo
      console.log('Using mock data (API not available)');
      
      // Apply filters to mock data
      let filtered = [...mockProperties];
      
      if (filters.city) {
        filtered = filtered.filter(p => p.city === filters.city);
      }
      if (filters.propertyType) {
        filtered = filtered.filter(p => p.propertyType === filters.propertyType);
      }
      if (filters.listingType) {
        filtered = filtered.filter(p => p.listingType === filters.listingType);
      }
      if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice!);
      }

      setProperties(filtered);
      setTotalPages(Math.ceil(filtered.length / 12));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const citiesData = await api.getCities();
      setCities(citiesData);
    } catch {
      // Fallback to mock cities
      setCities(mockCities);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container">
        <div className="mb-6">
          <h1 className="section-title mb-2">Property Listings</h1>
          <p className="text-muted-foreground">
            Find your perfect property from our extensive collection
          </p>
        </div>

        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          cities={cities}
        />

        {error && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Home className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Properties Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to find more properties
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Properties;
