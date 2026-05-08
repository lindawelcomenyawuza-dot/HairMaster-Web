'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '../../../../lib/upload';
import type { EditProfileDialogProps } from './profile.types';

export function EditProfileDialog({
  open,
  onOpenChange,
  editName,
  editBio,
  editAvatar,
  editLocation,
  setEditName,
  setEditBio,
  setEditAvatar,
  setEditLocation,
  onSave,
  saving,
}: EditProfileDialogProps) {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file);
      setEditAvatar(result.fileUrl);
      toast.success('Profile picture uploaded');
    } catch {
      toast.error('Upload failed — paste a URL instead');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="editName">Name</Label>
            <Input
              id="editName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editLocation">Location</Label>
            <Input
              id="editLocation"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="e.g. New York, NY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
              placeholder="Tell others about yourself..."
            />
          </div>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-3">
              {editAvatar && (
                <img
                  src={editAvatar}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover bg-gray-200 flex-shrink-0"
                />
              )}
              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                  {uploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload photo</>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <Input
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Or paste an image URL"
                  className="text-sm"
                />
              </div>
            </div>
            {editAvatar && !uploading && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Profile picture set
              </p>
            )}
          </div>
          <Button
            onClick={onSave}
            disabled={saving || uploading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
