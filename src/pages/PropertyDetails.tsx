import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  User,
  Building,
  Loader2,
  Phone,
  Mail,
} from 'lucide-react';

// Mock property for demo
const mockProperty: Property = {
  id: '1',
  title: 'Modern 3BHK Apartment in Koramangala',
  description: `This beautiful modern apartment is located in the heart of Koramangala, one of Bangalore's most sought-after neighborhoods. 

The property features:
- Spacious living room with natural lighting
- Modern modular kitchen with all appliances
- Three well-ventilated bedrooms with attached bathrooms
- Premium flooring throughout
- 24/7 security and power backup
- Covered car parking

The apartment is close to IT parks, shopping malls, restaurants, and excellent schools. Perfect for families and working professionals.`,
  price: 8500000,
  city: 'Bangalore',
  address: 'Koramangala 4th Block, Near Sony Signal',
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
};

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
  
  return listingType === 'RENT' ? `${formatted}/month` : formatted;
};

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError('');

      try {
        const data = await api.getPropertyById(id);
        setProperty(data);
      } catch {
        // Fallback to mock data for demo
        console.log('Using mock data (API not available)');
        setProperty({ ...mockProperty, id });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="page-container">
          <div className="text-center py-20">
            <Building className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Property Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The property you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/properties')}>
              Back to Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container">
        {/* Back Button */}
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-64 sm:h-96 bg-muted rounded-lg overflow-hidden">
              {property.imageUrl ? (
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building className="h-24 w-24 text-muted-foreground/50" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={getStatusClass(property.status)}>
                  {property.status}
                </span>
                <span className="type-badge">
                  {property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}
                </span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{property.address}, {property.city}</span>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <span className="type-badge mb-2 inline-block">{property.propertyType}</span>
                <p className="text-sm text-muted-foreground">Property Type</p>
              </div>
              
              {property.bedrooms && (
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">{property.bedrooms}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">{property.bathrooms}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </div>
              )}
              
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Square className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">{property.area}</span>
                </div>
                <p className="text-sm text-muted-foreground">Sq. Ft.</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Contact Owner
              </h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{property.ownerName}</p>
                  <p className="text-sm text-muted-foreground">Property Owner</p>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="space-y-3">
                  <Button className="w-full" variant="default">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Owner
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in to contact the owner
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Property Info
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Property ID</span>
                  <span className="font-medium text-foreground">{property.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Listed On</span>
                  <span className="font-medium text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-foreground">
                    {new Date(property.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
