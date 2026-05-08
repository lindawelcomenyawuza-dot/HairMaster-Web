import type { Metadata } from 'next';
import Script from 'next/script';
import '../src/styles/index.css';
import { AppProvider } from '../src/app/context/AppContext';
import { Toaster } from '../src/app/components/ui/sonner';
import ApolloClientProvider from '../src/app/components/ApolloProvider';

export const metadata: Metadata = {
  title: 'Hair Master',
  description: 'Connect with professional barbers and hairstylists',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
        <ApolloClientProvider>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
