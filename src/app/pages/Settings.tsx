'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Lock, Bell, CreditCard, Shield, FileCheck, 
  UserX, Globe, Moon, Sun, ChevronRight, ArrowLeft,
  Mail, Phone, Building2, LogOut, CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  badge?: string;
  danger?: boolean;
}

function SettingItem({ icon, title, description, onClick, badge, danger }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors ${
        danger ? 'hover:bg-red-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          danger ? 'bg-red-100' : 'bg-purple-100'
        }`}>
          <div className={danger ? 'text-red-600' : 'text-purple-600'}>
            {icon}
          </div>
        </div>
        <div className="text-left">
          <p className={`font-medium ${danger ? 'text-red-600' : ''}`}>{title}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
    </button>
  );
}

export default function Settings() {
  const router = useRouter();
  const { user } = useApp();
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-white/90 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-4">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingItem
              icon={<User className="w-5 h-5" />}
              title="Profile Settings"
              description="Edit your profile information"
              onClick={() => router.push('/settings/profile')}
            />
            <Separator />
            <SettingItem
              icon={<CheckCircle className="w-5 h-5" />}
              title="Verify Account"
              description={user?.isVerified ? 'Account verified' : 'Upload verification documents'}
              onClick={() => router.push('/settings/verification')}
              badge={!user?.isVerified ? 'Not Verified' : undefined}
            />
            <Separator />
            <SettingItem
              icon={<Mail className="w-5 h-5" />}
              title="Email"
              description={user?.email || 'Add email address'}
              onClick={() => router.push('/settings/email')}
            />
            <Separator />
            <SettingItem
              icon={<Phone className="w-5 h-5" />}
              title="Phone Number"
              description="Update your phone number"
              onClick={() => router.push('/settings/phone')}
            />
            <Separator />
            <SettingItem
              icon={<Lock className="w-5 h-5" />}
              title="Change Password"
              description="Update your password"
              onClick={() => router.push('/settings/password')}
            />
          </CardContent>
        </Card>

        {/* Business Verification (Business Accounts Only) */}
        {user?.accountType === 'business' && (
          <Card>
            <CardHeader>
              <CardTitle>Business Account</CardTitle>
              <CardDescription>Manage your business settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <SettingItem
                icon={<FileCheck className="w-5 h-5" />}
                title="Verification"
                description="Upload business documents"
                onClick={() => router.push('/settings/verification')}
                badge={!user?.isVerified ? 'Not Verified' : undefined}
              />
              <Separator />
              <SettingItem
                icon={<Building2 className="w-5 h-5" />}
                title="Business Profile"
                description="Manage business information"
                onClick={() => router.push('/settings/business')}
              />
            </CardContent>
          </Card>
        )}

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>Keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingItem
              icon={<Shield className="w-5 h-5" />}
              title="Two-Factor Authentication"
              description={user?.accountType === 'business' ? 'Required for business accounts' : 'Add extra security'}
              onClick={() => router.push('/settings/2fa')}
            />
            <Separator />
            <SettingItem
              icon={<UserX className="w-5 h-5" />}
              title="Blocked Users"
              description="Manage blocked accounts"
              onClick={() => router.push('/settings/blocked')}
            />
          </CardContent>
        </Card>

        {/* Payment Section (Business Accounts) */}
        {user?.accountType === 'business' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment & Banking</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <SettingItem
                icon={<CreditCard className="w-5 h-5" />}
                title="Bank Account"
                description="Add or update bank details"
                onClick={() => router.push('/settings/banking')}
              />
              <Separator />
              <SettingItem
                icon={<CreditCard className="w-5 h-5" />}
                title="Payment History"
                description="View transaction history"
                onClick={() => router.push('/settings/payment-history')}
              />
            </CardContent>
          </Card>
        )}

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Control what updates you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive push notifications</p>
                </div>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates</p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  {darkMode ? <Moon className="w-5 h-5 text-purple-600" /> : <Sun className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Use dark theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Section */}
        <Card>
          <CardHeader>
            <CardTitle>Language & Region</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              title="Language"
              description="English (US)"
              onClick={() => router.push('/settings/language')}
            />
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <SettingItem
              icon={<LogOut className="w-5 h-5" />}
              title="Log Out"
              description="Sign out of your account"
              onClick={handleLogout}
              danger
            />
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Hair Master v1.0.0</p>
          <p className="mt-1">© 2026 Hair Master. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
