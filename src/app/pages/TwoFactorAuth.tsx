'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export default function TwoFactorAuth() {
  const router = useRouter();
  const { user } = useApp();
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Mock secret key for demonstration
  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeValue = `otpauth://totp/HairMaster:${user?.email}?secret=${secretKey}&issuer=HairMaster`;

  const backupCodes = [
    '1234-5678-9012',
    '3456-7890-1234',
    '5678-9012-3456',
    '7890-1234-5678',
    '9012-3456-7890',
  ];

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    toast.success('Secret key copied to clipboard');
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast.success('Backup codes copied to clipboard');
  };

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    // Simulate verification
    setTimeout(() => {
      setStep('complete');
      setIs2FAEnabled(true);
      toast.success('Two-factor authentication enabled!');
    }, 500);
  };

  const handleDisable2FA = () => {
    setIs2FAEnabled(false);
    setStep('setup');
    toast.success('Two-factor authentication disabled');
  };

  if (step === 'complete' || is2FAEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
            <p className="text-white/90 mt-1">Your account is protected</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6 mt-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>2FA is Enabled</CardTitle>
              <CardDescription>
                Your account is now protected with two-factor authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm text-green-900">
                    <p className="font-medium mb-1">Extra Security Active</p>
                    <p className="text-green-800">
                      You'll be asked for a verification code when logging in from a new device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Backup Codes</h3>
                <p className="text-sm text-gray-600">
                  Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                </p>
                <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm p-2 bg-white rounded border">
                      {code}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyBackupCodes}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Backup Codes
                </Button>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDisable2FA}
              >
                Disable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Setup Two-Factor Authentication</h1>
          <p className="text-white/90 mt-1">Add an extra layer of security</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-4">
        {user?.accountType === 'business' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Required for Business Accounts</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Two-factor authentication is mandatory for all business accounts to protect your business and customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'setup' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Install Authenticator App</CardTitle>
                <CardDescription>
                  Download and install an authenticator app on your phone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Recommended apps:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <p className="font-medium text-sm">Google Authenticator</p>
                    <p className="text-xs text-gray-500 mt-1">iOS & Android</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="font-medium text-sm">Microsoft Authenticator</p>
                    <p className="text-xs text-gray-500 mt-1">iOS & Android</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 2: Scan QR Code</CardTitle>
                <CardDescription>
                  Open your authenticator app and scan this QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-gray-200">
                  <QRCodeSVG
                    value={qrCodeValue}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Or enter this code manually:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-50 border rounded px-3 py-2 text-sm font-mono">
                      {secretKey}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopySecret}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => setStep('verify')}
                >
                  Continue to Verification
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {step === 'verify' && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Verify Setup</CardTitle>
              <CardDescription>
                Enter the 6-digit code from your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> The code changes every 30 seconds. Make sure to enter it before it expires.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('setup')}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6}
                >
                  Verify & Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
