import { Suspense } from 'react';
import { ShopDetailPage } from '../../../src/app/pages/ShopDetailPage';
export default function Page() {
  return (
    <Suspense>
      <ShopDetailPage />
    </Suspense>
  );
}
