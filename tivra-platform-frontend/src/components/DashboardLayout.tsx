
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Home, 
  ShoppingCart, 
  Package, 
  Truck, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageSquare,
  BarChart3,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DashboardLayout = ({ children, userRole = 'buyer' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Messages', icon: MessageSquare, href: '/messages' },
      { name: 'Settings', icon: Settings, href: '/settings' },
    ];

    const roleSpecificItems = {
      buyer: [
        { name: 'Dashboard', icon: Home, href: '/buyer-dashboard' },
        { name: 'Browse Products', icon: ShoppingCart, href: '/products' },
        { name: 'My Orders', icon: Package, href: '/orders' },
        { name: 'Enquiries', icon: MessageSquare, href: '/enquiries' },
      ],
      seller: [
        { name: 'Dashboard', icon: Home, href: '/seller-dashboard' },
        { name: 'My Products', icon: Package, href: '/my-products' },
        { name: 'Add Product', icon: Package, href: '/add-product' },
        { name: 'Orders', icon: ShoppingCart, href: '/orders' },
        { name: 'Enquiries', icon: MessageSquare, href: '/enquiries' },
      ],
      transporter: [
        { name: 'Dashboard', icon: Home, href: '/transporter-dashboard' },
        { name: 'Deliveries', icon: Truck, href: '/deliveries' },
        { name: 'Available Jobs', icon: Package, href: '/jobs' },
        { name: 'My Routes', icon: Truck, href: '/routes' },
      ],
      admin: [
        { name: 'Dashboard', icon: Home, href: '/admin-dashboard' },
        { name: 'Users', icon: Users, href: '/admin/users' },
        { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
        { name: 'Audit Logs', icon: Settings, href: '/admin/audit' },
      ]
    };

    return [...(roleSpecificItems[userRole] || []), ...commonItems];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Tivra</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userRole.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
