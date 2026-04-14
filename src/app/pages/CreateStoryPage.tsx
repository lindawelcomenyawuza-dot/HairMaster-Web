'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Type, X, Image as ImageIcon, Video, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export function CreateStoryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [textOverlay, setTextOverlay] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type.startsWith('image') ? 'image' : 'video';
    setMediaType(fileType);

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    if (!mediaPreview) {
      toast.error('Please select an image or video');
      return;
    }

    // In a real app, upload to server here
    toast.success('Story published successfully!');
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2 text-white text-sm">
              <Clock className="w-4 h-4" />
              <span>24h Story</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="min-h-screen flex items-center justify-center p-4">
        {!mediaPreview ? (
          // Upload Screen
          <Card className="w-full max-w-md bg-gray-900 border-gray-800">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create Your Story</h2>
                <p className="text-gray-400">Share a moment that disappears in 24 hours</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex flex-col gap-3"
                  size="lg"
                >
                  <ImageIcon className="w-8 h-8" />
                  <span>Upload Photo</span>
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex flex-col gap-3"
                  size="lg"
                >
                  <Video className="w-8 h-8" />
                  <span>Upload Video</span>
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-400">
                <p>Max file size: 50MB</p>
                <p>Video max duration: 30 seconds</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Preview & Edit Screen
          <div className="relative w-full max-w-md aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden">
            {/* Media Preview */}
            {mediaType === 'image' ? (
              <img
                src={mediaPreview}
                alt="Story preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={mediaPreview}
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
                muted
              />
            )}

            {/* Text Overlay */}
            {textOverlay && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-3xl font-bold text-center px-8 py-4 bg-black/30 backdrop-blur-sm rounded-2xl">
                  {textOverlay}
                </div>
              </div>
            )}

            {/* Edit Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              {showTextInput ? (
                <div className="flex gap-2 mb-4">
                  <Input
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    placeholder="Enter text..."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTextInput(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowTextInput(true)}
                    className="flex-1 border-white/30 text-white hover:bg-white/20"
                  >
                    <Type className="w-5 h-5 mr-2" />
                    Add Text
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMediaPreview('');
                      setMediaType(null);
                      setTextOverlay('');
                    }}
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Remove
                  </Button>
                </div>
              )}

              <Button
                onClick={handlePublish}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                Publish Story
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
