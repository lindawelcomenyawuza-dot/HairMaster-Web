'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, FileText, CheckCircle2, XCircle, Clock, 
  AlertCircle, ArrowLeft, Camera, File
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';

interface DocumentUpload {
  type: string;
  label: string;
  description: string;
  file?: File;
  status: VerificationStatus;
  rejectionReason?: string;
  required: boolean;
}

export default function Verification() {
  const router = useRouter();
  const { user } = useApp();
  const isBusinessAccount = user?.accountType === 'business';

  const [documents, setDocuments] = useState<DocumentUpload[]>(
    isBusinessAccount
      ? [
          {
            type: 'government_id',
            label: 'Government ID',
            description: 'Valid driver\'s license, passport, or national ID',
            status: 'approved',
            required: true,
          },
          {
            type: 'business_license',
            label: 'Business License',
            description: 'Certificate of incorporation or business registration',
            status: 'pending',
            required: true,
          },
          {
            type: 'barber_certification',
            label: 'Barber/Stylist Certification',
            description: 'Professional certification or cosmetology license',
            status: 'not_submitted',
            required: true,
          },
          {
            type: 'proof_of_address',
            label: 'Proof of Shop Address',
            description: 'Utility bill or lease agreement (last 3 months)',
            status: 'rejected',
            rejectionReason: 'Document is older than 3 months. Please upload a recent document.',
            required: true,
          },
        ]
      : [
          {
            type: 'government_id',
            label: 'Government ID',
            description: 'Valid driver\'s license, passport, or national ID',
            status: 'not_submitted',
            required: true,
          },
          {
            type: 'selfie',
            label: 'Selfie Verification',
            description: 'Take a selfie holding your ID',
            status: 'not_submitted',
            required: true,
          },
        ]
  );

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Submitted
          </Badge>
        );
    }
  };

  const handleFileUpload = (index: number, file: File) => {
    const updatedDocs = [...documents];
    updatedDocs[index].file = file;
    updatedDocs[index].status = 'pending';
    setDocuments(updatedDocs);
    toast.success(`${updatedDocs[index].label} uploaded successfully`);
  };

  const handleSubmit = () => {
    const allRequired = documents
      .filter(doc => doc.required)
      .every(doc => doc.status === 'approved' || doc.status === 'pending');

    if (!allRequired) {
      toast.error('Please upload all required documents');
      return;
    }

    toast.success('Documents submitted for review. This usually takes 1-2 business days.');
  };

  const overallStatus: VerificationStatus = documents.every(doc => doc.status === 'approved')
    ? 'approved'
    : documents.some(doc => doc.status === 'pending')
    ? 'pending'
    : documents.some(doc => doc.status === 'rejected')
    ? 'rejected'
    : 'not_submitted';

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
          <h1 className="text-2xl font-bold">Account Verification</h1>
          <p className="text-white/90 mt-1">
            {isBusinessAccount 
              ? 'Verify your business to start receiving bookings' 
              : 'Verify your identity to book appointments'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-4">
        {/* Overall Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>
                  {overallStatus === 'approved' && 'Your account is fully verified'}
                  {overallStatus === 'pending' && 'Your documents are under review'}
                  {overallStatus === 'rejected' && 'Some documents were rejected'}
                  {overallStatus === 'not_submitted' && 'Submit documents to verify your account'}
                </CardDescription>
              </div>
              {getStatusBadge(overallStatus)}
            </div>
          </CardHeader>
          {overallStatus !== 'approved' && (
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Important Information</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Documents must be clear and readable</li>
                      <li>All information must be visible</li>
                      <li>Documents must be valid and not expired</li>
                      <li>Review typically takes 1-2 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Restrictions Warning */}
        {overallStatus !== 'approved' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">Account Restrictions</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    {isBusinessAccount 
                      ? 'You cannot receive bookings or payments until your account is verified.'
                      : 'You cannot book appointments until your account is verified.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Upload Cards */}
        {documents.map((doc, index) => (
          <Card key={doc.type} className={doc.status === 'rejected' ? 'border-red-200' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{doc.label}</CardTitle>
                    {doc.required && (
                      <span className="text-xs text-red-600 font-medium">Required</span>
                    )}
                  </div>
                  <CardDescription className="mt-1">{doc.description}</CardDescription>
                </div>
                {getStatusBadge(doc.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {doc.status === 'rejected' && doc.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {doc.rejectionReason}
                  </p>
                </div>
              )}

              {doc.status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">
                    Document approved and verified
                  </p>
                </div>
              )}

              {doc.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Under review by our verification team
                  </p>
                </div>
              )}

              {(doc.status === 'not_submitted' || doc.status === 'rejected') && (
                <div className="space-y-3">
                  <input
                    type="file"
                    id={`file-${doc.type}`}
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, file);
                    }}
                  />
                  <label htmlFor={`file-${doc.type}`}>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-colors">
                      {doc.type === 'selfie' ? (
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      ) : (
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      )}
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {doc.type === 'selfie' ? 'Take Photo' : 'Click to upload'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or PDF (max. 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {doc.file && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <File className="w-8 h-8 text-purple-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Submit Button */}
        {overallStatus !== 'approved' && (
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Submit for Verification
          </Button>
        )}
      </div>
    </div>
  );
}
