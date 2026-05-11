'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { ArrowLeft, Users, Calendar, MessageSquare, CreditCard, Plus, AlertCircle, CheckCircle2, Scissors, Edit2, Trash2, Upload, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { StaffMember } from '../types';
import { uploadFile } from '../../lib/upload';
import { GET_BUSINESS_STAFF } from '../../lib/graphql/queries';
import { CREATE_STAFF, DELETE_STAFF, UPDATE_STAFF } from '../../lib/graphql/mutations';

const emptyStaffForm = {
  fullName: '',
  role: '',
  bio: '',
  email: '',
  phone: '',
  specialties: '',
  instagram: '',
  tiktok: '',
  website: '',
  profileImage: '',
  profileImageKey: '',
};

export function BusinessDashboardPage() {
  const router = useRouter();
  const { user, bookings, posts, setNavState } = useApp();
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffForm, setStaffForm] = useState(emptyStaffForm);
  const [staffImageFile, setStaffImageFile] = useState<File | null>(null);
  const [staffImagePreview, setStaffImagePreview] = useState('');
  const [savingStaff, setSavingStaff] = useState(false);
  const { data: staffData, loading: staffLoading } = useQuery<{ getBusinessStaff: StaffMember[] }>(GET_BUSINESS_STAFF, {
    variables: { businessId: user?.id },
    skip: !user || user.accountType !== 'business',
  });
  const [createStaff] = useMutation(CREATE_STAFF);
  const [updateStaff] = useMutation(UPDATE_STAFF);
  const [deleteStaff] = useMutation(DELETE_STAFF);
  const staff = staffData?.getBusinessStaff || [];

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
  const servicePosts = posts.filter(post => (
    (post.isService || post.price > 0) &&
    (post.userId === user.id || post.salonId === user.id || post.salonName === user.businessName || post.barberShop === user.businessName)
  ));
  const catalogGroups = servicePosts.reduce<Record<string, typeof servicePosts>>((groups, post) => {
    const groupName = post.salonName || post.barberShop || post.userName || 'Services';
    groups[groupName] = groups[groupName] || [];
    groups[groupName].push(post);
    return groups;
  }, {});
  const getBookingCount = (postId: string, styleName: string) => (
    bookings.filter(booking => booking.postId === postId || booking.styleName === styleName).length
  );

  const resetStaffDialog = () => {
    if (staffImagePreview) URL.revokeObjectURL(staffImagePreview);
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
    setStaffImageFile(null);
    setStaffImagePreview('');
  };

  const openStaffDialog = (member?: StaffMember) => {
    resetStaffDialog();
    if (member) {
      setEditingStaff(member);
      setStaffForm({
        fullName: member.fullName || member.displayName || member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        email: member.email || '',
        phone: member.phone || '',
        specialties: (member.specialties || []).join(', '),
        instagram: member.socialLinks?.instagram || '',
        tiktok: member.socialLinks?.tiktok || '',
        website: member.socialLinks?.website || '',
        profileImage: member.profileImage || member.avatar || '',
        profileImageKey: member.profileImageKey || '',
      });
    }
    setShowAddStaff(true);
  };

  const handleStaffImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (staffImagePreview) URL.revokeObjectURL(staffImagePreview);
    setStaffImageFile(file);
    setStaffImagePreview(URL.createObjectURL(file));
    event.target.value = '';
  };

  const handleSaveStaff = async () => {
    if (!staffForm.fullName.trim() || !staffForm.role.trim()) {
      toast.error('Full name and role are required');
      return;
    }

    setSavingStaff(true);
    try {
      let profileImage = staffForm.profileImage;
      let profileImageKey = staffForm.profileImageKey;

      if (staffImageFile) {
        const uploaded = await uploadFile(staffImageFile);
        profileImage = uploaded.fileUrl;
        profileImageKey = uploaded.fileKey;
      }

      const input = {
        fullName: staffForm.fullName.trim(),
        role: staffForm.role.trim(),
        bio: staffForm.bio.trim(),
        email: staffForm.email.trim(),
        phone: staffForm.phone.trim(),
        specialties: staffForm.specialties.split(',').map(item => item.trim()).filter(Boolean),
        profileImage,
        profileImageKey,
        socialLinks: {
          instagram: staffForm.instagram.trim(),
          tiktok: staffForm.tiktok.trim(),
          website: staffForm.website.trim(),
        },
      };

      if (editingStaff) {
        await updateStaff({
          variables: { id: editingStaff.id, input },
          refetchQueries: ['GetBusinessStaff', 'GetSalonStaff'],
        });
        toast.success('Staff member updated');
      } else {
        await createStaff({
          variables: { input },
          optimisticResponse: {
            createStaff: {
              __typename: 'BusinessStaffMember',
              id: `temp-${Date.now()}`,
              businessId: user.id,
              displayName: input.fullName,
              fullName: input.fullName,
              role: input.role,
              bio: input.bio,
              email: input.email,
              phone: input.phone,
              specialties: input.specialties,
              profileImage,
              profileImageKey,
              avatar: profileImage,
              createdAt: new Date().toISOString(),
              socialLinks: input.socialLinks,
            },
          },
          refetchQueries: ['GetBusinessStaff', 'GetSalonStaff'],
        });
        toast.success('Staff member added');
      }

      setShowAddStaff(false);
      resetStaffDialog();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save staff member');
    } finally {
      setSavingStaff(false);
    }
  };

  const handleDeleteStaff = async (member: StaffMember) => {
    if (!window.confirm(`Delete ${member.fullName || member.displayName || member.name}?`)) return;
    try {
      await deleteStaff({
        variables: { id: member.id },
        optimisticResponse: { deleteStaff: true },
        update: (cache) => {
          cache.modify({
            fields: {
              getBusinessStaff(existingRefs = [], { readField }) {
                return existingRefs.filter((ref: any) => readField('id', ref) !== member.id);
              },
            },
          });
        },
        refetchQueries: ['GetBusinessStaff', 'GetSalonStaff'],
      });
      toast.success('Staff member deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not delete staff member');
    }
  };

  const handleSubscriptionPayment = () => {
    setNavState({
      amount: subscription?.monthlyFee || 100,
      currency: subscription?.currency || 'ZAR',
      type: 'subscription',
      description: `${user.businessName} - Monthly Subscription`,
    });
    router.push('/payment');
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
                      : `Your trial ends on ${subscription!.trialEndsAt ? format(subscription!.trialEndsAt, 'MMM d, yyyy') : 'soon'}. Subscribe to continue.`}
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
                          Trial ends {subscription.trialEndsAt ? format(subscription.trialEndsAt, 'MMM d, yyyy') : 'soon'}
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
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="catalog">
              <Scissors className="w-4 h-4 mr-2" />
              Catalog
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

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Service Catalog</h3>
                    <p className="text-sm text-gray-500">Priced posts customers can book</p>
                  </div>
                  <Button
                    onClick={() => router.push('/create-post')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {servicePosts.length > 0 ? (
                  <div className="space-y-8">
                    {Object.entries(catalogGroups).map(([groupName, groupPosts]) => (
                      <div key={groupName}>
                        <h4 className="font-semibold mb-3">{groupName}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {groupPosts.map((post) => (
                            <div key={post.id} className="border rounded-lg overflow-hidden bg-white">
                              <img
                                src={post.image}
                                alt={post.styleName}
                                className="w-full aspect-video object-cover bg-gray-100"
                              />
                              <div className="p-4 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h5 className="font-semibold">{post.styleName}</h5>
                                    <p className="text-sm text-gray-500">{post.stylistName || post.barberName || 'Any stylist'}</p>
                                  </div>
                                  <p className="font-bold text-green-600 whitespace-nowrap">
                                    {formatCurrency(post.price, post.currency)}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <span>{post.location || 'No location set'}</span>
                                  <span>{getBookingCount(post.id, post.styleName)} bookings</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Scissors className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p>No priced services yet</p>
                    <p className="text-sm mt-2">Create a business post with a price to add it to your catalog.</p>
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
                    onClick={() => openStaffDialog()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff
                  </Button>
                </div>

                {staffLoading ? (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading staff...
                  </div>
                ) : staff.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staff.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={member.profileImage || member.avatar || undefined}
                              alt={member.fullName || member.displayName || member.name || 'Staff member'}
                              className="w-12 h-12 rounded-full bg-gray-100 object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{member.fullName || member.displayName || member.name}</h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                              {member.bio && <p className="text-xs text-gray-600 mt-2 line-clamp-2">{member.bio}</p>}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {member.specialties.slice(0, 2).map((spec, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button type="button" variant="outline" size="sm" onClick={() => openStaffDialog(member)}>
                                  <Edit2 className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => handleDeleteStaff(member)}>
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </Button>
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
      <Dialog
        open={showAddStaff}
        onOpenChange={(open) => {
          setShowAddStaff(open);
          if (!open) resetStaffDialog();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
            <DialogDescription>Staff profiles are saved to your business account and can be tagged on posts.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <img
                src={staffImagePreview || staffForm.profileImage || undefined}
                alt=""
                className="w-20 h-20 rounded-full bg-gray-100 object-cover"
              />
              <label className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                Choose Image
                <input type="file" accept="image/*" className="hidden" onChange={handleStaffImageSelect} />
              </label>
            </div>
            <div>
              <Label htmlFor="staffName">Full Name *</Label>
              <Input
                id="staffName"
                value={staffForm.fullName}
                onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffRole">Role *</Label>
              <Input
                id="staffRole"
                value={staffForm.role}
                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                placeholder="Senior Barber"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffBio">Bio</Label>
              <Textarea
                id="staffBio"
                value={staffForm.bio}
                onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })}
                placeholder="Short profile for customers"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="staffEmail">Email *</Label>
              <Input
                id="staffEmail"
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                placeholder="john@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffPhone">Phone *</Label>
              <Input
                id="staffPhone"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staffSpecialties">Specialties (comma-separated)</Label>
              <Input
                id="staffSpecialties"
                value={staffForm.specialties}
                onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })}
                placeholder="Fades, Modern Cuts, Beard Trimming"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="staffInstagram">Instagram</Label>
                <Input id="staffInstagram" value={staffForm.instagram} onChange={(e) => setStaffForm({ ...staffForm, instagram: e.target.value })} placeholder="@stylist" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="staffTiktok">TikTok</Label>
                <Input id="staffTiktok" value={staffForm.tiktok} onChange={(e) => setStaffForm({ ...staffForm, tiktok: e.target.value })} placeholder="@stylist" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="staffWebsite">Website</Label>
                <Input id="staffWebsite" value={staffForm.website} onChange={(e) => setStaffForm({ ...staffForm, website: e.target.value })} placeholder="https://..." className="mt-1" />
              </div>
            </div>
            <Button
              onClick={handleSaveStaff}
              disabled={savingStaff}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {savingStaff ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : editingStaff ? 'Save Changes' : 'Add Staff Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
