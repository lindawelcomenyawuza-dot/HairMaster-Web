'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client/react';
import { ArrowLeft, Upload, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { uploadFile } from '../../lib/upload';
import { GET_SALON_STAFF, SEARCH_SALONS } from '../../lib/graphql/queries';

type SalonOption = {
  id: string;
  name: string;
  city?: string;
  logo?: string;
};

type StaffOption = {
  id: string;
  displayName: string;
  avatar?: string;
  role: string;
};

export function CreatePostPage() {
  const router = useRouter();
  const { addPost, user, bookings } = useApp();
  const [postType, setPostType] = useState<'portfolio' | 'verified'>('portfolio');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [styleName, setStyleName] = useState('');
  const [barberName, setBarberName] = useState('');
  const [barberShop, setBarberShop] = useState('');
  const [salonSearch, setSalonSearch] = useState('');
  const [selectedSalon, setSelectedSalon] = useState<SalonOption | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<StaffOption | null>(null);
  const [selectorError, setSelectorError] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'unisex'>('unisex');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceCurrency, setServiceCurrency] = useState(user?.currency || 'ZAR');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchSalons, { data: salonData, loading: salonsLoading }] = useLazyQuery<{ searchSalons: SalonOption[] }>(SEARCH_SALONS);
  const [loadSalonStaff, { data: staffData, loading: staffLoading, error: staffError }] = useLazyQuery<{ getSalonStaff: StaffOption[] }>(GET_SALON_STAFF);
  const isVideoPreview = selectedFile?.type.startsWith('video/');
  const salonOptions: SalonOption[] = salonData?.searchSalons || [];
  const staffOptions: StaffOption[] = staffData?.getSalonStaff || [];
  const canPriceServices = user?.accountType === 'business';

  const completedBookings = bookings.filter(b => b.status === 'completed');

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (selectedSalon || salonSearch.trim().length < 2) return;
    const timer = window.setTimeout(() => {
      searchSalons({ variables: { search: salonSearch.trim() } });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [salonSearch, searchSalons, selectedSalon]);

  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    const booking = completedBookings.find(b => b.id === bookingId);
    if (booking) {
      setStyleName(booking.styleName);
      setBarberName(booking.barberName);
      setLocation(booking.location);
    }
  };

  const handleSalonSelect = (salon: SalonOption) => {
    setSelectedSalon(salon);
    setSalonSearch(salon.name);
    setBarberShop(salon.name);
    setLocation(salon.city || '');
    setSelectedStylist(null);
    setBarberName('');
    setSelectorError('');
    loadSalonStaff({ variables: { salonId: salon.id } });
  };

  const handleSalonInput = (value: string) => {
    setSalonSearch(value);
    setBarberShop(value);
    setSelectedSalon(null);
    setSelectedStylist(null);
    setBarberName('');
  };

  const handleStylistSelect = (stylist: StaffOption) => {
    setSelectedStylist(stylist);
    setBarberName(stylist.displayName);
    setSelectorError('');
  };

  const clearSelectedImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview('');
    setSelectedFile(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || uploading) return;

    if (postType === 'verified' && !selectedBookingId) {
      alert('Please select a completed booking to create a Verified Cut post.');
      return;
    }

    if (!selectedSalon || !selectedStylist) {
      setSelectorError('Select a registered salon and stylist before posting.');
      return;
    }

    const parsedPrice = canPriceServices ? Number(servicePrice || 0) : 0;
    if (canPriceServices && servicePrice && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
      toast.error('Enter a valid service price');
      return;
    }

    setUploading(true);

    try {
      const uploadedMedia = selectedFile ? await uploadFile(selectedFile) : null;
      const uploadedImage = uploadedMedia?.fileUrl || 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=800';

      await addPost({
        type: postType,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        accountType: user.accountType,
        image: uploadedImage,
        imageKey: uploadedMedia?.fileKey,
        styleName,
        barberName,
        barberShop,
        salonId: selectedSalon.id,
        salonName: selectedSalon.name,
        stylistId: selectedStylist.id,
        stylistName: selectedStylist.displayName,
        stylistAvatar: selectedStylist.avatar,
        salonLogo: selectedSalon.logo,
        location,
        price: parsedPrice,
        currency: canPriceServices ? serviceCurrency : undefined,
        isService: canPriceServices && parsedPrice > 0,
        rating: 0,
        likes: 0,
        isLiked: false,
        description,
        gender,
        bookingId: postType === 'verified' ? selectedBookingId : undefined,
      });

      toast.success('Post created');
      router.push('/home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Create Post</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">

          <div className="space-y-2">
            <Label>Post Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPostType('portfolio')}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  postType === 'portfolio'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <p className="font-semibold text-sm">Portfolio</p>
                <p className="text-xs text-gray-500 mt-1">Showcase your work</p>
              </button>
              <button
                type="button"
                onClick={() => setPostType('verified')}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  postType === 'verified'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="font-semibold text-sm">Verified Cut</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Linked to a real booking</p>
              </button>
            </div>
          </div>

          {postType === 'verified' && (
            <div className="space-y-2">
              <Label>Select Completed Booking *</Label>
              {completedBookings.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  No completed bookings found. Complete a booking first to create a Verified Cut post.
                </div>
              ) : (
                <div className="space-y-2">
                  {completedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => handleBookingSelect(booking.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedBookingId === booking.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{booking.styleName}</p>
                          <p className="text-xs text-gray-500">with {booking.barberName}</p>
                          <p className="text-xs text-gray-400">{booking.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {format(new Date(booking.date), 'MMM d, yyyy')}
                          </p>
                          {selectedBookingId === booking.id && (
                            <Badge className="mt-1 bg-green-600 text-xs">Selected</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <Label>Upload Image</Label>
            {imagePreview ? (
              <div className="relative mt-2">
                {isVideoPreview ? (
                  <video
                    src={imagePreview}
                    className="w-full aspect-square object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                    <span className="ml-2 text-white text-sm">Uploading…</span>
                  </div>
                )}
                {!uploading && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearSelectedImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <label className="mt-2 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload image</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 50MB</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="styleName">Style Name *</Label>
            <Input
              id="styleName"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              placeholder="e.g., Mid Fade with Textured Top"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barberShop">Barber Shop / Salon *</Label>
            <Input
              id="barberShop"
              value={salonSearch}
              onChange={(e) => handleSalonInput(e.target.value)}
              placeholder="Search registered salons"
              autoComplete="off"
              required
            />
            {!selectedSalon && salonSearch.trim().length >= 2 && (
              <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                {salonsLoading ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Searching salons...
                  </div>
                ) : salonOptions.length > 0 ? (
                  salonOptions.map((salon) => (
                    <button
                      key={salon.id}
                      type="button"
                      onClick={() => handleSalonSelect(salon)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <img src={salon.logo || undefined} alt="" className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{salon.name}</span>
                        <span className="block text-xs text-gray-500">{salon.city || 'Registered salon'}</span>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">No registered salon found</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="barberName">Barber / Stylist *</Label>
            <Select
              value={selectedStylist?.id || ''}
              onValueChange={(value) => {
                const stylist = staffOptions.find(member => member.id === value);
                if (stylist) handleStylistSelect(stylist);
              }}
              disabled={!selectedSalon || staffLoading || !!staffError}
            >
              <SelectTrigger id="barberName">
                <SelectValue placeholder={
                  !selectedSalon
                    ? 'Select a salon first'
                    : staffLoading
                    ? 'Loading staff...'
                    : staffOptions.length === 0
                    ? 'No staff registered'
                    : 'Choose a stylist'
                } />
              </SelectTrigger>
              <SelectContent>
                {staffOptions.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.displayName} · {member.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {staffError && <p className="text-sm text-red-600">Could not load salon staff.</p>}
            {selectorError && <p className="text-sm text-red-600">{selectorError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={gender} onValueChange={(value: any) => setGender(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {canPriceServices && (
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
              <div className="space-y-2">
                <Label htmlFor="servicePrice">Service Price</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  placeholder="e.g. 250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceCurrency">Currency</Label>
                <Select value={serviceCurrency} onValueChange={setServiceCurrency}>
                  <SelectTrigger id="serviceCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this hairstyle..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting…</>
            ) : postType === 'verified' ? '✓ Post Verified Cut' : 'Post'}
          </Button>
        </form>
      </div>
    </div>
  );
}
