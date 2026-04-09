'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, TrendingUp, Users, DollarSign, Calendar,
  Star, Heart, MessageCircle, Share2, ChevronDown
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const revenueData = [
  { month: 'Jan', revenue: 4200, bookings: 42 },
  { month: 'Feb', revenue: 5100, bookings: 51 },
  { month: 'Mar', revenue: 4800, bookings: 48 },
  { month: 'Apr', revenue: 6200, bookings: 62 },
  { month: 'May', revenue: 7500, bookings: 75 },
  { month: 'Jun', revenue: 8200, bookings: 82 },
];

const popularStyles = [
  { name: 'Mid Fade', count: 145, revenue: 6525 },
  { name: 'Box Braids', count: 98, revenue: 17640 },
  { name: 'Taper Fade', count: 87, revenue: 3480 },
  { name: 'Locs Maintenance', count: 65, revenue: 9750 },
  { name: 'Color Treatment', count: 54, revenue: 13500 },
];

const customerData = [
  { name: 'New Customers', value: 35, color: '#8b5cf6' },
  { name: 'Returning', value: 65, color: '#3b82f6' },
];

const engagementData = [
  { day: 'Mon', likes: 245, comments: 45, shares: 12 },
  { day: 'Tue', likes: 312, comments: 62, shares: 18 },
  { day: 'Wed', likes: 289, comments: 54, shares: 15 },
  { day: 'Thu', likes: 401, comments: 78, shares: 24 },
  { day: 'Fri', likes: 523, comments: 95, shares: 32 },
  { day: 'Sat', likes: 678, comments: 124, shares: 45 },
  { day: 'Sun', likes: 456, comments: 89, shares: 28 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span>{change} from last month</span>
            </div>
          </div>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Analytics() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-white/90 mt-1">Track your business performance</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {timeRange === '6m' ? 'Last 6 Months' : timeRange === '30d' ? 'Last 30 Days' : 'Last 7 Days'}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6 mt-4">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value="$36,000"
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="w-7 h-7 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Total Bookings"
            value="360"
            change="+8.3%"
            trend="up"
            icon={<Calendar className="w-7 h-7 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="New Customers"
            value="126"
            change="+15.2%"
            trend="up"
            icon={<Users className="w-7 h-7 text-purple-600" />}
            color="bg-purple-100"
          />
          <StatCard
            title="Avg Rating"
            value="4.8"
            change="+0.2"
            trend="up"
            icon={<Star className="w-7 h-7 text-yellow-600" />}
            color="bg-yellow-100"
          />
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Bookings Trend</CardTitle>
                <CardDescription>Monthly revenue and booking statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="Revenue ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Bookings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Popular Services */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Services</CardTitle>
                <CardDescription>Top performing hairstyles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularStyles.map((style, index) => (
                    <div key={style.name} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{style.name}</p>
                        <p className="text-sm text-gray-500">{style.count} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${style.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            {/* Customer Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>New vs returning customers</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={customerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                  <CardDescription>Key customer metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">68%</p>
                    <p className="text-sm text-gray-600 mt-1">Repeat Customer Rate</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">$142</p>
                    <p className="text-sm text-gray-600 mt-1">Avg Customer Lifetime Value</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">3.2</p>
                    <p className="text-sm text-gray-600 mt-1">Avg Visits Per Customer</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            {/* Engagement Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Post Engagement</CardTitle>
                <CardDescription>Social media interaction metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="#ef4444" name="Likes" />
                    <Bar dataKey="comments" fill="#3b82f6" name="Comments" />
                    <Bar dataKey="shares" fill="#10b981" name="Shares" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2,904</p>
                      <p className="text-sm text-gray-600">Total Likes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">547</p>
                      <p className="text-sm text-gray-600">Total Comments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">174</p>
                      <p className="text-sm text-gray-600">Total Shares</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
