import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

const TransporterDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    // Fetch assigned deliveries (orders)
    axios.get(`${apiUrl}orders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setDeliveries(res.data))
      .catch((err) => { console.error('Orders error:', err, err?.response); });
    // Optionally, fetch available jobs if needed from a different endpoint
  }, []);

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.put(`${apiUrl}orders/${deliveryId}/`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh deliveries
      const res = await axios.get(`${apiUrl}orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveries(res.data);
    } catch (err) {
      console.error('Update delivery status error:', err, err?.response);
    }
  };

  const acceptJob = (jobId) => {
    const job = availableJobs.find(j => j.id === jobId);
    if (job) {
      const newDelivery = {
        ...job,
        status: "requested",
        buyer: "New Buyer",
        seller: "New Seller"
      };
      setDeliveries([...deliveries, newDelivery]);
      setAvailableJobs(availableJobs.filter(j => j.id !== jobId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'picked': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (delivery) => {
    switch (delivery.status) {
      case 'requested':
        return (
          <Button 
            size="sm" 
            onClick={() => updateDeliveryStatus(delivery.id, 'picked')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Mark as Picked
          </Button>
        );
      case 'picked':
        return (
          <Button 
            size="sm" 
            onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Start Transit
          </Button>
        );
      case 'in_transit':
        return (
          <Button 
            size="sm" 
            onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
            className="bg-green-600 hover:bg-green-700"
          >
            Mark Delivered
          </Button>
        );
      case 'delivered':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="transporter">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transporter Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your deliveries and find new jobs</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deliveries.filter(d => d.status !== 'delivered').length}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deliveries.filter(d => d.status === 'delivered').length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableJobs.length}</div>
              <p className="text-xs text-muted-foreground">Ready to accept</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45K</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* My Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>My Deliveries</CardTitle>
            <CardDescription>Track and update your assigned deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{delivery.orderNumber}</h4>
                      <p className="text-sm text-gray-600">{delivery.product} - {delivery.quantity}</p>
                    </div>
                    <Badge className={getStatusColor(delivery.status)}>
                      {delivery.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>From:</strong> {delivery.pickup}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>To:</strong> {delivery.delivery}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Pickup:</strong> {delivery.pickupDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Expected:</strong> {delivery.expectedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span><strong>Seller:</strong> {delivery.seller}</span> • 
                      <span><strong>Buyer:</strong> {delivery.buyer}</span>
                    </div>
                    {getStatusActions(delivery)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Available Jobs</CardTitle>
            <CardDescription>Accept new delivery assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{job.orderNumber}</h4>
                      <p className="text-sm text-gray-600">{job.product} - {job.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{job.compensation}</p>
                      <p className="text-sm text-gray-500">Compensation</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>From:</strong> {job.pickup}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>To:</strong> {job.delivery}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Pickup Date:</strong> {job.pickupDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Expected Delivery:</strong> {job.expectedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => acceptJob(job.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept Job
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransporterDashboard;
