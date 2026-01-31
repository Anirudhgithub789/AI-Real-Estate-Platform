import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Building, Search, Shield, Users, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Find Your Perfect
              <span className="text-primary block">Property Today</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Discover thousands of properties for sale and rent. Whether you're looking for a cozy apartment, a spacious villa, or prime land, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/properties">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose PropFind?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make finding and listing properties simple, secure, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Search</h3>
              <p className="text-muted-foreground">
                Filter properties by city, type, price range, and more to find exactly what you need.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">
                All properties are verified to ensure you get accurate information and genuine listings.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Direct Contact</h3>
              <p className="text-muted-foreground">
                Connect directly with property owners without any intermediaries or hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-8 sm:p-12 text-center">
            <Building className="h-12 w-12 text-primary-foreground mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Join thousands of happy customers who found their perfect home through PropFind.
            </p>
            <Link to="/properties">
              <Button variant="secondary" size="lg">
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">PropFind</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PropFind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
