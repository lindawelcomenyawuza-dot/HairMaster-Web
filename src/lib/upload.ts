import { getBackendBaseUrl } from './backend';

const BACKEND = getBackendBaseUrl();

export async function uploadFile(file: File): Promise<{ fileUrl: string; fileKey: string; fileType: string; mediaId: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('hm_token') : null;
  if (!token) throw new Error('Authentication required');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BACKEND}/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }

  return res.json();
}

export async function getSignedUploadUrl(
  filename: string,
  contentType: string
): Promise<{ signedUrl: string; fileUrl: string; fileKey: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('hm_token') : null;
  if (!token) throw new Error('Authentication required');

  const res = await fetch(`${BACKEND}/media/upload/signed-url`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename, contentType }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to get upload URL' }));
    throw new Error(err.error || 'Failed to get upload URL');
  }

  return res.json();
}

export async function uploadViaSignedUrl(file: File): Promise<string> {
  const { signedUrl, fileUrl } = await getSignedUploadUrl(file.name, file.type);

  const uploadRes = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('Direct upload to storage failed');

  return fileUrl;
}
