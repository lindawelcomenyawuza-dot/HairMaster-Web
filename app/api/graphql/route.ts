import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_GRAPHQL_URL || 'http://localhost:8000/graphql';

async function handler(req: NextRequest) {
  const body = req.method === 'POST' ? await req.text() : undefined;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const auth = req.headers.get('authorization');
  if (auth) headers['authorization'] = auth;

  try {
    const response = await fetch(BACKEND_URL, {
      method: req.method,
      headers,
      body,
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GraphQL proxy error:', err);
    return NextResponse.json(
      { errors: [{ message: 'Backend unavailable. Please try again later.' }] },
      { status: 503 }
    );
  }
}

export { handler as GET, handler as POST };
