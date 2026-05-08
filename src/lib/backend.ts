export const DEFAULT_BACKEND_URL = 'https://hairmaster-backend-1.onrender.com';

export function getBackendBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;
  return configured.replace(/\/api\/graphql\/?$/, '').replace(/\/graphql\/?$/, '').replace(/\/$/, '');
}

export function getGraphqlUrl() {
  return `${getBackendBaseUrl()}/graphql`;
}
