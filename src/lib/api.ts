export function getRequiredGraphqlUrl() {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim().replace(/\/$/, '');

  if (!graphqlUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_GRAPHQL_URL. Frontend environment variables are injected at build time and must use the NEXT_PUBLIC_ prefix.'
    );
  }

  return graphqlUrl;
}

export function getPublicCloudflareUrl() {
  return process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL?.trim().replace(/\/$/, '') || '';
}

export function getRequiredPublicApiUrl() {
  const graphqlUrl = getRequiredGraphqlUrl();

  try {
    const apiUrl = new URL(graphqlUrl);
    apiUrl.pathname = apiUrl.pathname.replace(/\/graphql\/?$/, '');
    apiUrl.search = '';
    apiUrl.hash = '';

    return apiUrl.toString().replace(/\/$/, '');
  } catch {
    throw new Error('Invalid NEXT_PUBLIC_GRAPHQL_URL. Expected an absolute GraphQL endpoint URL.');
  }
}
