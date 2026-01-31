import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { PropertyCard } from '@/components/PropertyCard';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { Property } from '@/types';
import { Loader2, Plus, Building } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Mock data for demo
const mockMyProperties: Property[] = [
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
    id: '4',
    title: '2BHK Furnished Flat for Rent',
    description: 'Fully furnished flat with modern amenities.',
    price: 35000,
    city: 'Bangalore',
    address: 'HSR Layout',
    propertyType: 'FLAT',
    listingType: 'RENT',
    status: 'PENDING',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    ownerId: '1',
    ownerName: 'John Doe',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
];

const MyListings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteProperty, setDeleteProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = isAuthenticated && user?.role === 'OWNER';

  useEffect(() => {
    if (!isOwner) {
      setIsLoading(false);
      return;
    }

    const fetchMyProperties = async () => {
      setIsLoading(true);

      try {
        const response = await api.getMyProperties(currentPage - 1);
        setProperties(response.content);
        setTotalPages(response.totalPages);
      } catch {
        // Fallback to mock data for demo
        console.log('Using mock data (API not available)');
        setProperties(mockMyProperties);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProperties();
  }, [currentPage, isOwner]);

  const handleEdit = (property: Property) => {
    navigate(`/edit-property/${property.id}`);
  };

  const handleDeleteClick = (property: Property) => {
    setDeleteProperty(property);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProperty) return;

    setIsDeleting(true);
    try {
      await api.deleteProperty(deleteProperty.id);
      setProperties(properties.filter(p => p.id !== deleteProperty.id));
    } catch {
      // For demo, remove locally anyway
      setProperties(properties.filter(p => p.id !== deleteProperty.id));
    } finally {
      setIsDeleting(false);
      setDeleteProperty(null);
    }
  };

  // Show access restricted after hooks are called
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="page-container">
          <div className="text-center py-20">
            <Building className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">
              Only property owners can view their listings.
            </p>
            <Button onClick={() => navigate('/login')}>
              Sign In as Owner
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title mb-2">My Listings</h1>
            <p className="text-muted-foreground">
              Manage your property listings
            </p>
          </div>
          
          <Link to="/add-property">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Properties Listed
            </h3>
            <p className="text-muted-foreground mb-4">
              You haven't listed any properties yet. Start by adding your first property.
            </p>
            <Link to="/add-property">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showActions
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProperty} onOpenChange={() => setDeleteProperty(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProperty?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListings;
