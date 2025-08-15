
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, User, Package, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  location: string;
  description: string;
  seller: {
    name: string;
    rating: number;
    totalSales: number;
    verified: boolean;
    joinedDate: string;
  };
  specifications?: {
    moistureContent: string;
    protein: string;
    grade: string;
    harvestDate: string;
  };
  images?: string[]; // Made optional
  availability: string;
}

interface EnquiryForm {
  message: string;
  quantity: string;
  phone: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [enquiry, setEnquiry] = useState<EnquiryForm>({
    message: '',
    quantity: '',
    phone: ''
  });

  useEffect(() => {
    if (!id) return;
    const apiUrl = import.meta.env.VITE_API_URL;
    axios.get(`${apiUrl}products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => { console.error('Product details error:', err, err?.response); });
  }, [id]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.post(`${apiUrl}enquiries/`, {
        product_id: id,
        quantity: enquiry.quantity,
        message: enquiry.message,
        phone: enquiry.phone,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiry({ message: '', quantity: '', phone: '' });
      alert('Enquiry sent successfully!');
    } catch (err) {
      alert('Failed to send enquiry.');
      console.error('Enquiry error:', err, err?.response);
    }
  };

  if (!product) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg flex items-center justify-center">
                  <Package className="h-24 w-24 text-green-600" />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    {product.images?.map((_, index) => (
                      <div 
                        key={index}
                        className="h-16 w-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg cursor-pointer border-2 border-transparent hover:border-green-500"
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Description */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications ?? {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info & Enquiry */}
          <div className="space-y-6">
            {/* Product Basic Info */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge className="bg-green-100 text-green-800">{product.availability}</Badge>
                </div>
                
                <div className="text-3xl font-bold text-green-600 mb-4">
                  ₹{product.price.toLocaleString()}/{product.unit}
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Quantity Available: {product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location: {product.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{product.seller.name}</span>
                    {product.seller.verified && (
                      <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{product.seller.rating}</span>
                    <span className="text-gray-600 text-sm">
                      ({product.seller.totalSales} sales)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Member since {new Date(product.seller.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Enquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send Enquiry
                </CardTitle>
                <CardDescription>
                  Contact the seller for more information or to place an order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Required</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder={`Enter quantity in ${product.unit}`}
                      value={enquiry.quantity}
                      onChange={(e) => setEnquiry({...enquiry, quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your contact number"
                      value={enquiry.phone}
                      onChange={(e) => setEnquiry({...enquiry, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Additional details about your requirement..."
                      value={enquiry.message}
                      onChange={(e) => setEnquiry({...enquiry, message: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Send Enquiry
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Star className="h-4 w-4 mr-2" />
                Save to Wishlist
              </Button>
              <Button variant="outline" className="w-full">
                Share Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
