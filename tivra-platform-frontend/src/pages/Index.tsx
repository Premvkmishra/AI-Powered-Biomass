
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Truck, ShoppingCart, Star, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">Tivra</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-green-600 transition-colors">Products</Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600 transition-colors">Contact</Link>
            <Link to="/login">
              <Button variant="outline" className="mr-2">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-green-600 hover:bg-green-700">Register</Button>
            </Link>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link to="/products" className="text-gray-600 hover:text-green-600 py-2">Products</Link>
              <Link to="/about" className="text-gray-600 hover:text-green-600 py-2">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-green-600 py-2">Contact</Link>
              <Link to="/login" className="py-2">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/register" className="py-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">Register</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Agricultural Commodities Trading Platform
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Connect buyers, sellers, and transporters in the agricultural supply chain. 
          Trade commodities efficiently with our integrated platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const RoleCard = ({ icon: Icon, title, description, ctaText, ctaLink, bgColor }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link to={ctaLink}>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            {ctaText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Premium Wheat",
      price: "₹25,000/ton",
      location: "Punjab",
      rating: 4.8,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Organic Rice",
      price: "₹32,000/ton",
      location: "Haryana",
      rating: 4.9,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Fresh Corn",
      price: "₹18,000/ton",
      location: "Maharashtra",
      rating: 4.7,
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-green-600 mb-2">{product.price}</p>
                <p className="text-gray-600 mb-2">{product.location}</p>
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { label: "Active Users", value: "10,000+", icon: Users },
    { label: "Products Listed", value: "25,000+", icon: ShoppingCart },
    { label: "Successful Orders", value: "15,000+", icon: Truck },
    { label: "Satisfied Customers", value: "98%", icon: Star }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">Tivra</span>
            </div>
            <p className="text-gray-400">
              Connecting the agricultural supply chain for efficient commodity trading.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products" className="hover:text-white">Products</Link></li>
              <li><Link to="/sellers" className="hover:text-white">For Sellers</Link></li>
              <li><Link to="/buyers" className="hover:text-white">For Buyers</Link></li>
              <li><Link to="/transporters" className="hover:text-white">For Transporters</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Tivra Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Join Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              icon={ShoppingCart}
              title="Buyers"
              description="Find quality agricultural commodities from verified sellers nationwide."
              ctaText="Start Buying"
              ctaLink="/register?role=buyer"
              bgColor="bg-blue-500"
            />
            <RoleCard
              icon={Users}
              title="Sellers"
              description="List your agricultural products and reach buyers across the country."
              ctaText="Start Selling"
              ctaLink="/register?role=seller"
              bgColor="bg-green-500"
            />
            <RoleCard
              icon={Truck}
              title="Transporters"
              description="Provide logistics services and earn from agricultural commodity deliveries."
              ctaText="Start Transporting"
              ctaLink="/register?role=transporter"
              bgColor="bg-purple-500"
            />
          </div>
        </div>
      </section>

      <FeaturedProducts />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Index;
