'use client';

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
            <Label htmlFor="avatar">Profile Picture URL</Label>
            <Input
              id="avatar"
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              placeholder="Paste an image URL"
            />
            {editAvatar && (
              <div className="mt-2">
                <img
                  src={editAvatar || undefined}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover bg-gray-200"
                />
              </div>
            )}
          </div>
          <Button
            onClick={onSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
