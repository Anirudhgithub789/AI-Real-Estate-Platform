import { PropertyFilters as Filters, PropertyType, ListingType } from '@/types';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  cities: string[];
}

export const PropertyFilters = ({ filters, onFilterChange, cities }: PropertyFiltersProps) => {
  const handleChange = (key: keyof Filters, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            City
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="filter-input"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Property Type
          </label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) => handleChange('propertyType', e.target.value as PropertyType)}
            className="filter-input"
          >
            <option value="">All Types</option>
            <option value="FLAT">Flat</option>
            <option value="VILLA">Villa</option>
            <option value="PLOT">Plot</option>
          </select>
        </div>

        {/* Listing Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Buy / Rent
          </label>
          <select
            value={filters.listingType || ''}
            onChange={(e) => handleChange('listingType', e.target.value as ListingType)}
            className="filter-input"
          >
            <option value="">All</option>
            <option value="BUY">For Sale</option>
            <option value="RENT">For Rent</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Min Price (₹)
          </label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="filter-input"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Max Price (₹)
          </label>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="filter-input"
          />
        </div>
      </div>
    </div>
  );
};
