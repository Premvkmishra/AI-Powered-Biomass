
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ShoppingCart, Clock, MessageSquare, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';

const BuyerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('access_token');
        
        // Debug: Log what's in localStorage
        console.log('localStorage contents:', {
          access_token: localStorage.getItem('access_token'),
          refresh_token: localStorage.getItem('refresh_token'),
          user_role: localStorage.getItem('user_role')
        });
        
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL;
        console.log('API URL:', apiUrl);
        console.log('Token:', token);

        // Fetch products
        const productsResponse = await axios.get(`${apiUrl}products/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Products response:', productsResponse);
        setProducts(productsResponse.data || []);

        // Fetch orders
        const ordersResponse = await axios.get(`${apiUrl}orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersResponse.data || []);

        // Fetch enquiries
        const enquiriesResponse = await axios.get(`${apiUrl}enquiries/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnquiries(enquiriesResponse.data || []);

      } catch (err: any) {
        console.error('Data fetch error:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please login again.');
          // Clear invalid tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        } else {
          setError('Failed to load data. Please try again later.');
        }
        // Set empty arrays to prevent rendering errors
        setProducts([]);
        setOrders([]);
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Example: Send new enquiry
  const sendEnquiry = async (productId, quantity, offeredPrice) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.post(`${apiUrl}enquiries/`, {
        product_id: productId,
        quantity,
        offered_price: offeredPrice,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh enquiries
      const res = await axios.get(`${apiUrl}enquiries/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiries(res.data || []);
    } catch (err) {
      console.error('Send enquiry error:', err, err?.response);
    }
  };

  // Example: Create new order
  const createOrder = async (enquiryId, transporterId) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.post(`${apiUrl}orders/`, {
        enquiry_id: enquiryId,
        transporter_id: transporterId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh orders
      const res = await axios.get(`${apiUrl}orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error('Create order error:', err, err?.response);
    }
  };

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    const matchesSearch = (product.commodity_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.pickup_location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || product.commodity_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Requested': return 'bg-blue-100 text-blue-800';
      case 'Picked': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Negotiating': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Safe access to nested properties
  const getProductName = (product) => {
    if (!product) return 'Unknown Product';
    return product.commodity_type || 'Unknown Product';
  };

  const getProductLocation = (product) => {
    if (!product) return 'Unknown Location';
    return product.pickup_location || 'Unknown Location';
  };

  const getProductUnit = (product) => {
    if (!product) return 'unit';
    return product.unit_of_measure || 'unit';
  };

  const getProductPrice = (product) => {
    if (!product || !product.price) return '0';
    return product.price.toString();
  };

  const getOrderProductName = (order) => {
    if (!order || !order.enquiry || !order.enquiry.product) return 'Unknown Product';
    return order.enquiry.product.commodity_type || 'Unknown Product';
  };

  const getEnquiryProductName = (enquiry) => {
    if (!enquiry || !enquiry.product) return 'Unknown Product';
    return enquiry.product.commodity_type || 'Unknown Product';
  };

  const getSellerName = (seller) => {
    if (!seller) return 'Unknown Seller';
    if (typeof seller === 'object') {
      return seller.username || seller.email || seller.id || 'Unknown Seller';
    }
    return seller;
  };

  if (loading) {
    return (
      <DashboardLayout userRole="buyer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="buyer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">{error}</div>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="buyer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Find and purchase quality agricultural commodities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Total orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Enquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.filter(e => e.status === 'Pending').length}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Products</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Ready to buy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Browse Products</CardTitle>
            <CardDescription>Find the agricultural commodities you need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search products or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Biomass">Biomass</SelectItem>
                  <SelectItem value="Briquettes">Briquettes</SelectItem>
                  <SelectItem value="Biodiesel">Biodiesel</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{getProductName(product)}</h3>
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        ₹{getProductPrice(product).toLocaleString()}/{getProductUnit(product)}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{getProductLocation(product)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">
                          Seller: {getSellerName(product.seller)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">
                          Quantity: {product.quantity || 0} {getProductUnit(product)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          Send Enquiry
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  {searchTerm || selectedCategory !== '' ? 'No products match your search criteria.' : 'No products available.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track your recent purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{getOrderProductName(order)}</h4>
                      <p className="text-sm text-gray-600">Status: {order.status}</p>
                      <p className="text-sm text-gray-600">Created: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Updated: {new Date(order.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No orders found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
            <CardDescription>Status of your product enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enquiries.length > 0 ? (
                enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{getEnquiryProductName(enquiry)}</h4>
                      <p className="text-sm text-gray-600">
                        Seller: {getSellerName(enquiry.product?.seller)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {enquiry.quantity} {enquiry.product?.unit_of_measure || 'units'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(enquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(enquiry.status)}>
                      {enquiry.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No enquiries found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
