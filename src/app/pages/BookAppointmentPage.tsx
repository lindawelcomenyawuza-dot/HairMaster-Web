'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Palette, CreditCard, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { useApp } from '../context/AppContext';
import { mockBarberShops, mockHairstylists, timeSlots } from '../data/mockData';
import { toast } from 'sonner';
import type { Currency } from '../types';

export function BookAppointmentPage() {
  const router = useRouter();
  const { addBooking, navState, setNavState } = useApp();



  // Get data from navigation state
  const { post, shop, barberId, barberName, styleQuery } = navState as Record<string, any>;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedColor, setSelectedColor] = useState('Natural');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [depositOption, setDepositOption] = useState<'50' | '100'>('100');
  const [selectedShop, setSelectedShop] = useState(shop?.id || '');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedHairstylist, setSelectedHairstylist] = useState('');
  const [showHairstylistPopup, setShowHairstylistPopup] = useState(false);

  const styleName = post?.styleName || styleQuery || '';
  const price = post?.price || 0;
  const currency = post?.currency || 'USD';
  const depositAmount = depositOption === '50' ? price * 0.5 : price;

  // Get available barbershops based on the style
  const availableShops = post
    ? mockBarberShops.filter(s => s.name === post.barberShop)
    : mockBarberShops;

  const currentShop = mockBarberShops.find(s => s.id === selectedShop);
  const currentBarber = currentShop?.barbers.find(b => b.id === selectedBarber);
  const availableHairstylists = mockHairstylists.filter(h => h.barberId === selectedBarber);

  const hairColors = [
    'Natural',
    'Blonde',
    'Brown',
    'Black',
    'Red',
    'Auburn',
    'Platinum',
    'Highlights',
    'Balayage',
    'Ombre',
  ];

  const handleBarberSelect = (barberId: string) => {
    setSelectedBarber(barberId);
    setSelectedHairstylist('');
    // Show hairstylist popup
    setShowHairstylistPopup(true);
  };

  const handleHairstylistSelect = (hairstylistId: string) => {
    setSelectedHairstylist(hairstylistId);
    setShowHairstylistPopup(false);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedShop || !selectedBarber || !selectedHairstylist) {
      toast.error('Please fill in all required fields');
      return;
    }

    const shopData = mockBarberShops.find(s => s.id === selectedShop);
    const barberData = shopData?.barbers.find(b => b.id === selectedBarber);

    const bookingData = {
      postId: post?.id || 'custom',
      styleName: styleName,
      barberName: barberData?.name || '',
      location: shopData?.location || '',
      price: price,
      currency: currency as Currency,
      date: new Date(selectedDate),
      time: selectedTime,
      status: 'upcoming' as const,
      paymentMethod,
      depositPaid: false,
    };

    // If paying online, redirect to payment page
    if (paymentMethod === 'online') {
      setNavState({
        amount: depositAmount,
        currency: currency,
        type: 'booking',
        description: `${styleName} - ${depositOption === '50' ? '50% Deposit' : 'Full Payment'}`,
        bookingId: 'temp-' + Date.now(),
        bookingData: {
          ...bookingData,
          depositAmount: depositAmount,
          depositPaid: true,
          paymentStatus: depositOption === '50' ? 'partial' : 'completed',
        },
      });
      router.push('/payment');
    } else {
      // Pay at shop
      addBooking({
        ...bookingData,
        paymentStatus: 'pending',
      });

      toast.success('Appointment booked successfully!');
      router.push('/bookings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Book Appointments</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hairstyle Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Service Details</h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Hairstyle Test</Label>
                    <p className="font-semibold text-lg">{styleName || 'Custom Style'}</p>
                  </div>
                  {post && (
                    <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden">
                      <img src={post.image} alt={post.styleName} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Selection */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Select Location
                </h2>
                <Select value={selectedShop} onValueChange={setSelectedShop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a barbershop location" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableShops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-gray-500">{shop.location}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Barber & Hairstylist Selection */}
            {selectedShop && currentShop && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Select Barber & Hairstylist
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Choose Your Barber</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentShop.barbers.map((barber) => (
                          <div
                            key={barber.id}
                            onClick={() => handleBarberSelect(barber.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedBarber === barber.id
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={barber.avatar}
                                alt={barber.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-semibold">{barber.name}</p>
                                <p className="text-sm text-gray-600">{barber.specialties[0]}</p>
                                <p className="text-xs text-yellow-600">★ {barber.rating}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedBarber && selectedHairstylist && (
                      <div>
                        <Label className="mb-2 block">Selected Hairstylist</Label>
                        <div className="p-4 border-2 border-purple-600 bg-purple-50 rounded-lg">
                          {mockHairstylists.find(h => h.id === selectedHairstylist) && (
                            <div className="flex items-center gap-3">
                              <img
                                src={mockHairstylists.find(h => h.id === selectedHairstylist)!.image}
                                alt={mockHairstylists.find(h => h.id === selectedHairstylist)!.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold">
                                  {mockHairstylists.find(h => h.id === selectedHairstylist)!.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {mockHairstylists.find(h => h.id === selectedHairstylist)!.specialty}
                                </p>
                              </div>
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => setShowHairstylistPopup(true)}
                          >
                            Change Hairstylist
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date & Time */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Date & Time
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Select Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hair Color Selection */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Choose Hair Color
                </h2>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {hairColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as 'online' | 'offline')}>
                  <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:border-purple-300 cursor-pointer">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Pay Online</p>
                        <p className="text-sm text-gray-500">Secure payment with card</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:border-purple-300 cursor-pointer">
                    <RadioGroupItem value="offline" id="offline" />
                    <Label htmlFor="offline" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Pay at Shop</p>
                        <p className="text-sm text-gray-500">Pay when you arrive</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'online' && (
                  <div className="mt-6">
                    <Label className="mb-3 block font-semibold">Payment Amount</Label>
                    <RadioGroup value={depositOption} onValueChange={(val) => setDepositOption(val as '50' | '100')}>
                      <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:border-purple-300 cursor-pointer">
                        <RadioGroupItem value="50" id="deposit50" />
                        <Label htmlFor="deposit50" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-semibold">Pay 50% Deposit</p>
                            <p className="text-sm text-gray-500">Pay ${(price * 0.5).toFixed(2)} now, rest at shop</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:border-purple-300 cursor-pointer">
                        <RadioGroupItem value="100" id="deposit100" />
                        <Label htmlFor="deposit100" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-semibold">Pay Full Amount</p>
                            <p className="text-sm text-gray-500">Pay ${price.toFixed(2)} now</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Service</p>
                    <p className="font-semibold">{styleName || 'Not selected'}</p>
                  </div>
                  {currentShop && (
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-semibold">{currentShop.name}</p>
                      <p className="text-xs text-gray-500">{currentShop.location}</p>
                    </div>
                  )}
                  {currentBarber && (
                    <div>
                      <p className="text-gray-600">Barber</p>
                      <p className="font-semibold">{currentBarber.name}</p>
                    </div>
                  )}
                  {selectedHairstylist && (
                    <div>
                      <p className="text-gray-600">Hairstylist</p>
                      <p className="font-semibold">
                        {mockHairstylists.find(h => h.id === selectedHairstylist)?.name}
                      </p>
                    </div>
                  )}
                  {selectedDate && (
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold">{new Date(selectedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedTime && (
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-semibold">{selectedTime}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Color</p>
                    <p className="font-semibold">{selectedColor}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment</p>
                    <p className="font-semibold">
                      {paymentMethod === 'online' ? 'Pay Online' : 'Pay at Shop'}
                    </p>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="text-2xl font-bold text-green-600">${price}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || !selectedShop || !selectedBarber || !selectedHairstylist}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hairstylist Selection Popup */}
      <Dialog open={showHairstylistPopup} onOpenChange={setShowHairstylistPopup}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Your Hairstylist</DialogTitle>
            <DialogDescription>Choose from our experienced team of professionals</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
            {availableHairstylists.map((stylist) => (
              <div
                key={stylist.id}
                onClick={() => handleHairstylistSelect(stylist.id)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg ${selectedHairstylist === stylist.id
                    ? 'border-purple-600'
                    : 'border-gray-200 hover:border-purple-300'
                  }`}
              >
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <p className="font-semibold text-sm">{stylist.name}</p>
                  <p className="text-xs text-gray-600">{stylist.specialty}</p>
                  <p className="text-xs text-gray-500 mt-1">{stylist.experience} experience</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
