'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Order } from '../types';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    productId: 'p1',
    productName: 'Brazilian Lace Front Wig',
    productType: 'wig',
    productImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400',
    quantity: 1,
    price: 299,
    currency: 'USD',
    totalAmount: 299,
    orderDate: new Date('2026-03-28'),
    deliveryDate: new Date('2026-04-05'),
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001'
    },
    trackingNumber: 'TRK123456789',
    sellerId: 'seller1',
    sellerName: 'Premium Hair Studio'
  },
  {
    id: '2',
    productId: 'p2',
    productName: 'HD Lace Frontal 13x4',
    productType: 'frontal',
    productImage: 'https://images.unsplash.com/photo-1595475884562-073c02f73b78?w=400',
    quantity: 2,
    price: 150,
    currency: 'USD',
    totalAmount: 300,
    orderDate: new Date('2026-03-30'),
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90001'
    },
    sellerId: 'seller2',
    sellerName: 'Lux Hair Boutique'
  },
  {
    id: '3',
    productId: 'p3',
    productName: 'Virgin Hair Extensions Bundle',
    productType: 'extension',
    productImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400',
    quantity: 3,
    price: 89,
    currency: 'USD',
    totalAmount: 267,
    orderDate: new Date('2026-04-01'),
    deliveryDate: new Date('2026-04-10'),
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      zipCode: '60601'
    },
    trackingNumber: 'TRK987654321',
    sellerId: 'seller3',
    sellerName: 'Elite Hair Collection'
  }
];

export function OrdersPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      processing: 'secondary',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive'
    };
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const filteredOrders = mockOrders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedTab === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('all')}
            className={selectedTab === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            All Orders
          </Button>
          <Button
            variant={selectedTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('pending')}
            className={selectedTab === 'pending' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            Pending
          </Button>
          <Button
            variant={selectedTab === 'shipped' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('shipped')}
            className={selectedTab === 'shipped' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            Shipped
          </Button>
          <Button
            variant={selectedTab === 'delivered' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('delivered')}
            className={selectedTab === 'delivered' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            Delivered
          </Button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">
                {selectedTab === 'all' 
                  ? "You haven't placed any orders yet"
                  : `No ${selectedTab} orders`
                }
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => router.push('/home')}
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="sm:w-32 sm:h-32 w-full h-48">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{order.productName}</h3>
                          <p className="text-sm text-gray-600">{order.sellerName}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Ordered: {order.orderDate.toLocaleDateString()}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Truck className="w-4 h-4" />
                            <span className="truncate">{order.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Qty: {order.quantity} × ${order.price}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ${order.totalAmount}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {order.status === 'shipped' && (
                            <Button size="sm" variant="outline">
                              Track Order
                            </Button>
                          )}
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Delivery Status Progress */}
                      {(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>Order Progress</span>
                            {order.deliveryDate && (
                              <span>Est. Delivery: {order.deliveryDate.toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <div className={`flex-1 h-2 rounded-full ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 h-2 rounded-full ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
