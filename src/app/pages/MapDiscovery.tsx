'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Navigation, Search, Filter, Star, DollarSign, 
  Clock, Phone, MoveRight, X, ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { formatCurrencySimple } from '../utils/currency';

interface BarberLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: string;
  walkTime: string;
  driveTime: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
  isOpen: boolean;
  services: string[];
  priceRange: string;
  image: string;
  phone: string;
}

const mockLocations: BarberLocation[] = [
  {
    id: '1',
    name: 'Elite Cuts Barbershop',
    address: '123 Main St, New York, NY',
    lat: 40.7589,
    lng: -73.9851,
    distance: '0.5 mi',
    walkTime: '8 min',
    driveTime: '3 min',
    rating: 4.8,
    reviews: 245,
    isVerified: true,
    isOpen: true,
    services: ['Fades', 'Beard Trim', 'Hot Towel Shave'],
    priceRange: '$30-$60',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    phone: '(212) 555-0123',
  },
  {
    id: '2',
    name: 'Glamour Hair Studio',
    address: '456 Sunset Blvd, New York, NY',
    lat: 40.7614,
    lng: -73.9776,
    distance: '1.2 mi',
    walkTime: '18 min',
    driveTime: '6 min',
    rating: 5.0,
    reviews: 342,
    isVerified: true,
    isOpen: true,
    services: ['Braids', 'Weaves', 'Natural Hair'],
    priceRange: '$80-$250',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
    phone: '(212) 555-0456',
  },
  {
    id: '3',
    name: 'Style Haven',
    address: '789 Park Ave, New York, NY',
    lat: 40.7489,
    lng: -73.9680,
    distance: '2.1 mi',
    walkTime: '32 min',
    driveTime: '9 min',
    rating: 4.6,
    reviews: 156,
    isVerified: true,
    isOpen: false,
    services: ['Modern Cuts', 'Color', 'Styling'],
    priceRange: '$45-$120',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
    phone: '(212) 555-0789',
  },
];

export default function MapDiscovery() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<BarberLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleGetDirections = (location: BarberLocation) => {
    const address = encodeURIComponent(location.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  const handleCallShop = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Search Header */}
      <div className="bg-white shadow-sm z-10">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for barber shops, salons..."
                className="pl-10 pr-4"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {showFilters && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge variant="outline" className="cursor-pointer">Open Now</Badge>
              <Badge variant="outline" className="cursor-pointer">Verified</Badge>
              <Badge variant="outline" className="cursor-pointer">Top Rated</Badge>
              <Badge variant="outline" className="cursor-pointer">Nearby</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Map Area (Simulated) */}
      <div className="flex-1 relative bg-gray-200 overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Location Pins */}
        {mockLocations.map((location, index) => (
          <button
            key={location.id}
            onClick={() => setSelectedLocation(location)}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all ${
              selectedLocation?.id === location.id ? 'scale-125 z-20' : 'z-10'
            }`}
            style={{
              left: `${30 + index * 20}%`,
              top: `${40 + index * 15}%`,
            }}
          >
            <div className="relative">
              {location.isVerified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center z-10">
                  <Star className="w-2 h-2 text-white fill-white" />
                </div>
              )}
              <Avatar className={`w-12 h-12 border-4 ${
                location.isOpen ? 'border-green-500' : 'border-gray-400'
              } bg-white shadow-lg`}>
                <AvatarImage src={location.image} />
                <AvatarFallback>{location.name[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <MapPin className={`w-6 h-6 ${
                  location.isOpen ? 'text-green-600' : 'text-gray-400'
                } drop-shadow-lg`} />
              </div>
            </div>
          </button>
        ))}

        {/* Current Location Button */}
        <button className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Navigation className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      {/* Bottom Sheet - Location Details */}
      {selectedLocation ? (
        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden max-h-[60vh] flex flex-col animate-slide-up">
          <div className="p-4 border-b">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            <div className="flex gap-4">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg truncate">{selectedLocation.name}</h3>
                  {selectedLocation.isVerified && (
                    <Badge className="bg-blue-600 shrink-0">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{selectedLocation.rating}</span>
                  <span className="text-sm text-gray-500">({selectedLocation.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {selectedLocation.isOpen ? (
                    <>
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Open Now</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Closed</span>
                    </>
                  )}
                  <span className="text-sm text-gray-500 ml-2">{selectedLocation.priceRange}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Distance & Travel Time */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">{selectedLocation.distance}</p>
                  <p className="text-xs text-gray-500">Distance</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Navigation className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">{selectedLocation.walkTime}</p>
                  <p className="text-xs text-gray-500">Walk</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <MoveRight className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">{selectedLocation.driveTime}</p>
                  <p className="text-xs text-gray-500">Drive</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Address</p>
                <p className="text-sm text-gray-600">{selectedLocation.address}</p>
              </div>

              {/* Services */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleCallShop(selectedLocation.phone)}
                  className="w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGetDirections(selectedLocation)}
                  className="w-full"
                >
                  <MoveRight className="w-4 h-4 mr-2" />
                  Directions
                </Button>
              </div>

              <Button
                onClick={() => router.push(`/book/${selectedLocation.id}`)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                View Styles & Book
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 text-center">
          <p className="text-gray-500">Tap on a pin to view details</p>
        </div>
      )}
    </div>
  );
}
