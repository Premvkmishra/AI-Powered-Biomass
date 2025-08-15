  
import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  growthRate: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
}

interface AuditLog {
  id: number;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  severity: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    growthRate: 0
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    // Fetch users
    axios.get(`${apiUrl}admin/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUsers(res.data))
      .catch((err) => { console.error('Users error:', err, err?.response); });
    // Fetch analytics
    axios.get(`${apiUrl}admin/analytics/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAnalytics(res.data))
      .catch((err) => { console.error('Analytics error:', err, err?.response); });
    // Fetch audit logs
    axios.get(`${apiUrl}admin/audit-logs/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAuditLogs(res.data))
      .catch((err) => { console.error('Audit logs error:', err, err?.response); });
  }, []);

  // Verify user
  const verifyUser = async (userId) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.put(`${apiUrl}admin/users/${userId}/verify/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh users
      const res = await axios.get(`${apiUrl}admin/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Verify user error:', err, err?.response);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform management and analytics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.activeUsers} active users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Completed transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.growthRate}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Verify and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>Role: {user.role}</span>
                          <span>Joined: {user.joinDate}</span>
                          <span>Last Active: {user.lastActive}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        {user.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => verifyUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Verify
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>User registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Chart placeholder - User growth over time</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Platform revenue analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Chart placeholder - Revenue trends</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution of listed products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Chart placeholder - Product distribution</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Order Statistics</CardTitle>
                  <CardDescription>Order completion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Chart placeholder - Order statistics</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>Platform activity and security logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {log.severity === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {log.severity === 'info' && <Clock className="h-4 w-4 text-blue-600" />}
                        {log.severity === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        {log.severity === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        <div>
                          <h4 className="font-medium text-sm">{log.action}</h4>
                          <p className="text-xs text-gray-600">{log.details}</p>
                          <p className="text-xs text-gray-500">User: {log.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
