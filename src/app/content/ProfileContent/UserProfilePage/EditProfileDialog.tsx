'use client';

import { useEffect, useState } from 'react';
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
import type { EditProfileDialogProps } from './profile.types';

export function EditProfileDialog({
  open,
  onOpenChange,
  displayName,
  editBio,
  editAvatar,
  pendingAvatarFile,
  setEditBio,
  setEditAvatar,
  setEditAvatarKey,
  setPendingAvatarFile,
  onSave,
  saving,
}: EditProfileDialogProps) {
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');

  useEffect(() => {
    if (!open) {
      setAvatarPreviewUrl('');
      setPendingAvatarFile(null);
    }
  }, [open, setPendingAvatarFile]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarPreviewUrl(URL.createObjectURL(file));
    setPendingAvatarFile(file);
    setEditAvatarKey('');
  };

  const handleAvatarUrlChange = (value: string) => {
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarPreviewUrl('');
    setPendingAvatarFile(null);
    setEditAvatar(value);
    setEditAvatarKey('');
  };

  const displayAvatar = avatarPreviewUrl || editAvatar;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <p className="rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {displayName}
            </p>
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
              {displayAvatar && (
                <img
                  src={displayAvatar}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover bg-gray-200 flex-shrink-0"
                />
              )}
              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                  {saving && pendingAvatarFile ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload photo</>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                    disabled={saving}
                  />
                </label>
                <Input
                  value={editAvatar}
                  onChange={(e) => handleAvatarUrlChange(e.target.value)}
                  placeholder="Or paste an image URL"
                  className="text-sm"
                  disabled={saving}
                />
              </div>
            </div>
            {displayAvatar && !saving && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {pendingAvatarFile ? 'Profile picture ready to save' : 'Profile picture set'}
              </p>
            )}
          </div>
          <Button
            onClick={onSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {saving ? (pendingAvatarFile ? 'Uploading photo...' : 'Saving...') : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
