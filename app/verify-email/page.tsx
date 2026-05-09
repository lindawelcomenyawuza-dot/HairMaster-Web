import { Suspense } from 'react';
import VerifyEmailPage from '../../src/app/pages/VerifyEmailPage';

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
