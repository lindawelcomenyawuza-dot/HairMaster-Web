'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import { UPDATE_PROFILE_SETTINGS } from '../../lib/graphql/mutations';
import { uploadFile } from '../../lib/upload';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, setUser } = useApp();
  const [updateProfileSettings] = useMutation(UPDATE_PROFILE_SETTINGS);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarKey, setAvatarKey] = useState(user?.avatarKey || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setName(user.name || '');
    setBio(user.bio || '');
    setAvatar(user.avatar || '');
    setAvatarKey(user.avatarKey || '');
  }, [router, user]);

  if (!user) return null;

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file);
      setAvatar(result.fileUrl);
      setAvatarKey(result.fileKey);
      toast.success('Profile picture uploaded');
    } catch {
      toast.error('Upload failed - paste a URL instead');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfileSettings({
        variables: {
          name: name.trim(),
          bio,
          avatar,
          avatarKey,
        },
      });
      const result = data as any;
      if (result?.updateProfileSettings) {
        setUser({ ...user, ...result.updateProfileSettings });
      }
      toast.success('Profile settings saved');
      router.push('/settings');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-white/90 mt-1">Manage your identity and public profile</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>These settings control how your profile appears across Hair Master.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="settingsName">Name</Label>
              <Input
                id="settingsName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settingsBio">Bio</Label>
              <Textarea
                id="settingsBio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                placeholder="Tell others about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-3">
                {avatar && (
                  <img
                    src={avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover bg-gray-200 flex-shrink-0"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
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
                    value={avatar}
                    onChange={(event) => {
                      setAvatar(event.target.value);
                      setAvatarKey('');
                    }}
                    placeholder="Or paste an image URL"
                  />
                </div>
              </div>
              {avatar && !uploading && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Profile picture set
                </p>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {saving ? 'Saving...' : 'Save Profile Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
