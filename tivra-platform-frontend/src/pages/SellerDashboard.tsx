
import React, { useState, useEffect } from 'react';
import { Package, Plus, MessageSquare, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'ton',
    description: '',
    location: ''
  });
  const [editProductModal, setEditProductModal] = useState({ open: false, product: null });
  const [editProductFields, setEditProductFields] = useState({});
  const [respondModal, setRespondModal] = useState({ open: false, enquiry: null });
  const [respondFields, setRespondFields] = useState({ status: '', message: '' });
  const [viewEnquiryModal, setViewEnquiryModal] = useState({ open: false, enquiry: null });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    // Fetch products
    axios.get(`${apiUrl}products/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setProducts(res.data))
      .catch((err) => { console.error('Products error:', err, err?.response); });
    // Fetch enquiries
    axios.get(`${apiUrl}enquiries/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setEnquiries(res.data))
      .catch((err) => { console.error('Enquiries error:', err, err?.response); });
    // Fetch orders
    axios.get(`${apiUrl}orders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .catch((err) => { console.error('Orders error:', err, err?.response); });
  }, []);

  // Add product
  const handleAddProduct = async () => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        quantity: parseFloat(newProduct.quantity),
        unit_of_measure: newProduct.unit,
        commodity_type: newProduct.category,
        pickup_location: newProduct.location,
        availability_dates: [new Date(), new Date(Date.now() + 30*24*60*60*1000)],
      };
      await axios.post(`${apiUrl}products/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh products
      const res = await axios.get(`${apiUrl}products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        quantity: '',
        unit: 'ton',
        description: '',
        location: ''
      });
      setShowAddProduct(false);
    } catch (err) {
      console.error('Add product error:', err, err?.response);
    }
  };

  // Edit product (PATCH to /products/{id}/update_product/)
  const handleEditProduct = async () => {
    if (!editProductModal.product) return;
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.patch(`${apiUrl}products/${editProductModal.product.id}/update_product/`, editProductFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh products
      const res = await axios.get(`${apiUrl}products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setEditProductModal({ open: false, product: null });
      setEditProductFields({});
    } catch (err) {
      console.error('Edit product error:', err, err?.response);
    }
  };

  // Delete product (DELETE to /products/{id}/delete_product/)
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.delete(`${apiUrl}products/${productId}/delete_product/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh products
      const res = await axios.get(`${apiUrl}products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Delete product error:', err, err?.response);
    }
  };

  // Respond to enquiry (PATCH to /enquiries/{id}/respond/)
  const handleRespondEnquiry = async () => {
    if (!respondModal.enquiry) return;
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.patch(`${apiUrl}enquiries/${respondModal.enquiry.id}/respond/`, respondFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh enquiries
      const res = await axios.get(`${apiUrl}enquiries/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiries(res.data);
      setRespondModal({ open: false, enquiry: null });
      setRespondFields({ status: '', message: '' });
    } catch (err) {
      console.error('Respond enquiry error:', err, err?.response);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout userRole="seller">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your products and orders</p>
          </div>
          <Button 
            onClick={() => setShowAddProduct(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.reduce((sum, p) => sum + p.views, 0)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.length}</div>
              <p className="text-xs text-muted-foreground">Pending responses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2.5L</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Form */}
        {showAddProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>List a new agricultural commodity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g., Premium Wheat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="spices">Spices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Unit</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Available</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                    placeholder="e.g., Punjab"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="quintal">Quintal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Describe your product quality, specifications..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                  Add Product
                </Button>
                <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Products */}
        <Card>
          <CardHeader>
            <CardTitle>My Products</CardTitle>
            <CardDescription>Manage your listed commodities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      ₹{product.price.toLocaleString()}/{product.unit} • {product.quantity} {product.unit} available
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {product.enquiries} enquiries
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditProductModal({ open: true, product });
                      setEditProductFields({
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity,
                        unit: product.unit,
                        description: product.description,
                        location: product.location,
                        category: product.category
                      });
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Product Modal */}
        <Dialog open={editProductModal.open} onOpenChange={open => setEditProductModal({ open, product: open ? editProductModal.product : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update your product details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Product Name"
                value={editProductFields.name || ''}
                onChange={e => setEditProductFields({ ...editProductFields, name: e.target.value })}
              />
              <Input
                placeholder="Price"
                type="number"
                value={editProductFields.price || ''}
                onChange={e => setEditProductFields({ ...editProductFields, price: e.target.value })}
              />
              <Input
                placeholder="Quantity"
                type="number"
                value={editProductFields.quantity || ''}
                onChange={e => setEditProductFields({ ...editProductFields, quantity: e.target.value })}
              />
              <Input
                placeholder="Unit"
                value={editProductFields.unit || ''}
                onChange={e => setEditProductFields({ ...editProductFields, unit: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={editProductFields.location || ''}
                onChange={e => setEditProductFields({ ...editProductFields, location: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={editProductFields.category || ''}
                onChange={e => setEditProductFields({ ...editProductFields, category: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={editProductFields.description || ''}
                onChange={e => setEditProductFields({ ...editProductFields, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleEditProduct} className="bg-green-600 hover:bg-green-700">Update</Button>
              <Button variant="outline" onClick={() => setEditProductModal({ open: false, product: null })}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Recent Enquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
            <CardDescription>Respond to buyer enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{enquiry.productName}</h4>
                      <p className="text-sm text-gray-600">From: {enquiry.buyerName}</p>
                      <p className="text-sm text-gray-600">Quantity: {enquiry.quantity} tons</p>
                    </div>
                    <Badge className={getStatusColor(enquiry.status)}>
                      {enquiry.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{enquiry.message}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setRespondModal({ open: true, enquiry })}>
                      Respond
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setViewEnquiryModal({ open: true, enquiry })}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Respond to Enquiry Modal */}
        <Dialog open={respondModal.open} onOpenChange={open => setRespondModal({ open, enquiry: open ? respondModal.enquiry : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Enquiry</DialogTitle>
              <DialogDescription>Update the status and send a message to the buyer.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={respondFields.status} onValueChange={value => setRespondFields({ ...respondFields, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Negotiating">Negotiating</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Message to buyer"
                value={respondFields.message}
                onChange={e => setRespondFields({ ...respondFields, message: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleRespondEnquiry} className="bg-green-600 hover:bg-green-700">Send Response</Button>
              <Button variant="outline" onClick={() => setRespondModal({ open: false, enquiry: null })}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Enquiry Details Modal */}
        <Dialog open={viewEnquiryModal.open} onOpenChange={open => setViewEnquiryModal({ open, enquiry: open ? viewEnquiryModal.enquiry : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enquiry Details</DialogTitle>
            </DialogHeader>
            {viewEnquiryModal.enquiry && (
              <div className="space-y-2">
                <div><strong>Product:</strong> {viewEnquiryModal.enquiry.productName}</div>
                <div><strong>Buyer:</strong> {viewEnquiryModal.enquiry.buyerName}</div>
                <div><strong>Quantity:</strong> {viewEnquiryModal.enquiry.quantity} tons</div>
                <div><strong>Status:</strong> {viewEnquiryModal.enquiry.status}</div>
                <div><strong>Message:</strong> {viewEnquiryModal.enquiry.message}</div>
                {/* Add more details as needed */}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewEnquiryModal({ open: false, enquiry: null })}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SellerDashboard;
