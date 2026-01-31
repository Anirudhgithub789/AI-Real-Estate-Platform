import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, Building, Plus, List, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-primary text-primary-foreground'
        : 'text-foreground hover:bg-muted'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">PropFind</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/properties" className={navLinkClass('/properties')}>
              <Home className="h-4 w-4" />
              Properties
            </Link>

            {isAuthenticated && user?.role === 'OWNER' && (
              <>
                <Link to="/add-property" className={navLinkClass('/add-property')}>
                  <Plus className="h-4 w-4" />
                  Add Property
                </Link>
                <Link to="/my-listings" className={navLinkClass('/my-listings')}>
                  <List className="h-4 w-4" />
                  My Listings
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user?.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                    {user?.role}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/properties"
              className={navLinkClass('/properties')}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Properties
            </Link>

            {isAuthenticated && user?.role === 'OWNER' && (
              <>
                <Link
                  to="/add-property"
                  className={navLinkClass('/add-property')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </Link>
                <Link
                  to="/my-listings"
                  className={navLinkClass('/my-listings')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <List className="h-4 w-4" />
                  My Listings
                </Link>
              </>
            )}

            <div className="border-t border-border pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm px-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{user?.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                      {user?.role}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
