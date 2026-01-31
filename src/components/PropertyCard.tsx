import { Property } from '@/types';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Building } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return 'status-badge status-available';
    case 'SOLD':
      return 'status-badge status-sold';
    case 'PENDING':
      return 'status-badge status-pending';
    default:
      return 'status-badge';
  }
};

const formatPrice = (price: number, listingType: string) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
  
  return listingType === 'RENT' ? `${formatted}/mo` : formatted;
};

export const PropertyCard = ({ property, showActions, onEdit, onDelete }: PropertyCardProps) => {
  return (
    <div className="property-card overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-muted">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={getStatusClass(property.status)}>
            {property.status}
          </span>
        </div>

        {/* Listing Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="type-badge">
            {property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="text-xl font-bold text-primary mb-1">
          {formatPrice(property.price, property.listingType)}
        </p>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="type-badge">{property.propertyType}</span>
          
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {property.bedrooms}
            </span>
          )}
          
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms}
            </span>
          )}
          
          <span className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            {property.area} sqft
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/properties/${property.id}`}
            className="flex-1 text-center py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
          
          {showActions && (
            <>
              <button
                onClick={() => onEdit?.(property)}
                className="py-2 px-4 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(property)}
                className="py-2 px-4 border border-destructive text-destructive rounded-md text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
