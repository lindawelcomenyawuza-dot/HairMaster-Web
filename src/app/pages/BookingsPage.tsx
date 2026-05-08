'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

export function BookingsPage() {
  const router = useRouter();
  const { bookings, updateBooking } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleReschedule = () => {
    if (selectedBooking && newDate && newTime) {
      updateBooking(selectedBooking, {
        date: new Date(newDate),
        time: newTime,
      });
      setShowReschedule(false);
      setSelectedBooking(null);
      setNewDate('');
      setNewTime('');
    }
  };

  const handleCancel = (bookingId: string) => {
    updateBooking(bookingId, { status: 'cancelled' });
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');
  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">My Bookings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">${totalSpent}</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.styleName}</h3>
                        <p className="text-sm text-gray-600">{booking.barberName}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBooking(booking.id);
                              setShowReschedule(true);
                            }}
                          >
                            Postpone Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-600"
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(booking.date, 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <DollarSign className="w-4 h-4" />
                        <span>{booking.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Badge variant={booking.paymentMethod === 'online' ? 'default' : 'outline'}>
                        {booking.paymentMethod === 'online' ? 'Paid Online' : 'Pay at Shop'}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        Confirmed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Past Bookings</h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{booking.styleName}</h3>
                        <p className="text-sm text-gray-600">{booking.barberName}</p>
                      </div>
                      <Badge
                        variant={booking.status === 'completed' ? 'default' : 'destructive'}
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(booking.date, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>${booking.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No bookings yet</p>
            <p className="text-sm text-gray-400 mt-2">Book your first appointment from the home feed</p>
          </div>
        )}
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Choose a new date and time for your appointment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Time</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="">Choose a time</option>
                {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleReschedule}
              disabled={!newDate || !newTime}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Confirm Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
