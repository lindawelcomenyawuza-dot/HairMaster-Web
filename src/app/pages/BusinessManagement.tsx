'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Users, Calendar, Package, Plus, Edit, Trash2,
  Clock, DollarSign, Scissors, Star, Mail, Phone
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  specialties: string[];
  rating: number;
  bookings: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'product' | 'tool';
  quantity: number;
  minQuantity: number;
  price: number;
  lastRestocked: string;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'James Wilson',
    role: 'Senior Barber',
    email: 'james@elitecuts.com',
    phone: '(212) 555-0124',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    specialties: ['Fades', 'Classic Cuts'],
    rating: 4.9,
    bookings: 145,
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    role: 'Hair Stylist',
    email: 'sarah@elitecuts.com',
    phone: '(212) 555-0125',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    specialties: ['Color', 'Extensions'],
    rating: 5.0,
    bookings: 178,
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Hair Gel',
    category: 'product',
    quantity: 25,
    minQuantity: 10,
    price: 15.99,
    lastRestocked: '2026-03-15',
  },
  {
    id: '2',
    name: 'Professional Clippers',
    category: 'tool',
    quantity: 5,
    minQuantity: 3,
    price: 89.99,
    lastRestocked: '2026-02-20',
  },
  {
    id: '3',
    name: 'Hair Dye - Black',
    category: 'product',
    quantity: 8,
    minQuantity: 15,
    price: 24.99,
    lastRestocked: '2026-03-01',
  },
];

const mockServices: ServiceItem[] = [
  {
    id: '1',
    name: 'Mid Fade',
    description: 'Classic mid fade with styling',
    price: 45,
    duration: 45,
    category: 'Haircut',
    active: true,
  },
  {
    id: '2',
    name: 'Box Braids',
    description: 'Full head box braids',
    price: 180,
    duration: 240,
    category: 'Braiding',
    active: true,
  },
  {
    id: '3',
    name: 'Beard Trim',
    description: 'Professional beard shaping',
    price: 25,
    duration: 20,
    category: 'Grooming',
    active: true,
  },
];

export default function BusinessManagement() {
  const router = useRouter();
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showAddService, setShowAddService] = useState(false);

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
          <h1 className="text-2xl font-bold">Business Management</h1>
          <p className="text-white/90 mt-1">Manage staff, inventory, and services</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6 mt-4">
        <Tabs defaultValue="staff" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="staff">
              <Users className="w-4 h-4 mr-2" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="services">
              <Scissors className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
          </TabsList>

          {/* Staff Management */}
          <TabsContent value="staff" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Staff Members</h2>
                <p className="text-sm text-gray-600">Manage your team</p>
              </div>
              <Button
                onClick={() => setShowAddStaff(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockStaff.map((staff) => (
                <Card key={staff.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback>{staff.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg">{staff.name}</h3>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{staff.rating}</span>
                          <span className="text-sm text-gray-500">• {staff.bookings} bookings</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {staff.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {staff.phone}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {staff.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/staff/${staff.id}/schedule`)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inventory Management */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Inventory</h2>
                <p className="text-sm text-gray-600">Track products and tools</p>
              </div>
              <Button
                onClick={() => setShowAddInventory(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {mockInventory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          item.category === 'product' ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          <Package className={`w-6 h-6 ${
                            item.category === 'product' ? 'text-purple-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Stock: {item.quantity} units</span>
                            <span>Min: {item.minQuantity}</span>
                            <span>Last restocked: {item.lastRestocked}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${item.price}</p>
                        {item.quantity < item.minQuantity && (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mt-1">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Low Stock Alert */}
            {mockInventory.some(item => item.quantity < item.minQuantity) && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Low Stock Alert</p>
                      <p className="text-sm text-yellow-800 mt-1">
                        {mockInventory.filter(item => item.quantity < item.minQuantity).length} items need restocking
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Services Management */}
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Services</h2>
                <p className="text-sm text-gray-600">Manage your service catalog</p>
              </div>
              <Button
                onClick={() => setShowAddService(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="space-y-3">
              {mockServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Scissors className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{service.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {service.category}
                            </Badge>
                            {service.active && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${service.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>Add a new team member to your business</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Role (e.g., Barber, Stylist)" />
            <Input type="email" placeholder="Email" />
            <Input type="tel" placeholder="Phone" />
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => {
                toast.success('Staff member added');
                setShowAddStaff(false);
              }}
            >
              Add Staff Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
