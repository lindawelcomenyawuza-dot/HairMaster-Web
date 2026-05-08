export function getRequiredPublicApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  return apiUrl;
}
