'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Calendar, MessageSquare, CreditCard, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { StaffMember } from '../types';

export function BusinessDashboardPage() {
  const router = useRouter();
  const { user, bookings } = useApp();
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>(user?.staff || []);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    specialties: '',
  });

  useEffect(() => {
    if (!user || user.accountType !== 'business') {
      router.push('/home');
    }
  }, [user, router]);

  if (!user || user.accountType !== 'business') {
    return null;
  }

  const subscription = user.subscription;
  const isTrialExpiring = subscription?.isTrial && subscription.trialEndsAt && 
    new Date(subscription.trialEndsAt).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;
  const isSubscriptionExpired = subscription && new Date(subscription.endDate) < new Date();

  // Get business bookings (bookings at my business)
  const businessBookings = bookings.filter(b => b.barberName === user.name);
  const upcomingBookings = businessBookings.filter(b => b.status === 'upcoming');
  const completedBookings = businessBookings.filter(b => b.status === 'completed');
  
  // Calculate revenue
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.price, 0);
  const pendingRevenue = upcomingBookings.reduce((sum, b) => {
    if (b.depositPaid && b.depositAmount) {
      return sum + (b.price - b.depositAmount);
    }
    return sum + b.price;
  }, 0);

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.email || !newStaff.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const staffMember: StaffMember = {
      id: Date.now().toString(),
      name: newStaff.name,
      role: newStaff.role,
      email: newStaff.email,
      phone: newStaff.phone,
      avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1599566150163' : '1507003211169'}-29194dcaad36?w=150`,
      specialties: newStaff.specialties.split(',').map(s => s.trim()).filter(Boolean),
    };

    setStaff([...staff, staffMember]);
    setShowAddStaff(false);
    setNewStaff({ name: '', role: '', email: '', phone: '', specialties: '' });
    toast.success('Staff member added successfully!');
  };

  const handleSubscriptionPayment = () => {
    router.push('/payment', {
      state: {
        amount: subscription?.monthlyFee || 100,
        currency: subscription?.currency || 'ZAR',
        type: 'subscription',
        description: `${user.businessName} - Monthly Subscription`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Business Dashboard</h1>
                <p className="text-sm text-gray-500">{user.businessName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Subscription Alert */}
        {(isTrialExpiring || isSubscriptionExpired) && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-900">
                    {isSubscriptionExpired ? 'Subscription Expired' : 'Trial Ending Soon'}
                  </p>
                  <p className="text-sm text-orange-800 mt-1">
                    {isSubscriptionExpired 
                      ? 'Your subscription has expired. Pay to continue using business features.'
                      : `Your trial ends on ${format(subscription!.trialEndsAt, 'MMM d, yyyy')}. Subscribe to continue.`}
                  </p>
                  <Button
                    onClick={handleSubscriptionPayment}
                    size="sm"
                    className="mt-3 bg-orange-600 hover:bg-orange-700"
                  >
                    Pay {formatCurrency(subscription?.monthlyFee || 100, subscription?.currency || 'ZAR')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Subscription Status</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {subscription?.isTrial ? (
                      <>
                        <Badge className="bg-blue-100 text-blue-800">
                          Active (Free Trial)
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Trial ends {format(subscription.trialEndsAt, 'MMM d, yyyy')}
                        </span>
                      </>
                    ) : subscription?.isActive ? (
                      <>
                        <Badge variant="default" className="bg-green-600">
                          Active
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Renews {format(subscription.endDate, 'MMM d, yyyy')}
                        </span>
                      </>
                    ) : (
                      <Badge variant="destructive">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Monthly Fee: {formatCurrency(subscription?.monthlyFee || 100, subscription?.currency || 'ZAR')}
                  </p>
                  {subscription?.isTrial && (
                    <p className="text-xs text-gray-500 mt-2">
                      🎉 Enjoy your 14-day free trial! Subscribe to continue after trial ends.
                    </p>
                  )}
                </div>
              </div>
              {!subscription?.isActive || isSubscriptionExpired ? (
                <Button 
                  onClick={handleSubscriptionPayment}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Subscribe Now
                </Button>
              ) : subscription?.isTrial ? (
                <Button 
                  variant="outline" 
                  onClick={handleSubscriptionPayment}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Subscribe Early
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSubscriptionPayment}>
                  Renew Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue, user.currency)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Bookings</p>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Staff Members</p>
                  <p className="text-2xl font-bold">{staff.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Users className="w-4 h-4 mr-2" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Appointment Bookings</h3>
                {businessBookings.length > 0 ? (
                  <div className="space-y-4">
                    {businessBookings.map((booking) => (
                      <div key={booking.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{booking.styleName}</h4>
                            <p className="text-sm text-gray-600">
                              {format(booking.date, 'MMM d, yyyy')} at {booking.time}
                            </p>
                          </div>
                          <Badge variant={booking.status === 'upcoming' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Payment: {booking.paymentStatus === 'completed' ? 'Paid' : 
                                     booking.paymentStatus === 'partial' ? 'Deposit Paid' : 'Pending'}
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(booking.price, booking.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No bookings yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Manage Staff</h3>
                  <Button
                    onClick={() => setShowAddStaff(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff
                  </Button>
                </div>

                {staff.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staff.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {member.specialties.slice(0, 2).map((spec, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p>No staff members added yet</p>
                    <p className="text-sm mt-2">Add staff to help manage your business</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                {subscription?.paymentHistory && subscription.paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {subscription.paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {payment.type === 'subscription' ? 'Subscription Payment' : 'Booking Payment'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(payment.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                          <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No payment history
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Customer Chats</h3>
                  <Button onClick={() => router.push('/chat')}>
                    Open Chat
                  </Button>
                </div>
                <p className="text-gray-500">View and respond to customer messages</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Add a new team member to your business</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="staffName">Full Name *</Label>
              <Input
                id="staffName"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffRole">Role *</Label>
              <Input
                id="staffRole"
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                placeholder="Senior Barber"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffEmail">Email *</Label>
              <Input
                id="staffEmail"
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="john@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffPhone">Phone *</Label>
              <Input
                id="staffPhone"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffSpecialties">Specialties (comma-separated)</Label>
              <Input
                id="staffSpecialties"
                value={newStaff.specialties}
                onChange={(e) => setNewStaff({ ...newStaff, specialties: e.target.value })}
                placeholder="Fades, Modern Cuts, Beard Trimming"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleAddStaff}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Add Staff Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
