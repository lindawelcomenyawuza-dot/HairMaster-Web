import type { Metadata } from 'next';
import '../src/styles/index.css';
import { AppProvider } from '../src/app/context/AppContext';
import { Toaster } from '../src/app/components/ui/sonner';

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
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
