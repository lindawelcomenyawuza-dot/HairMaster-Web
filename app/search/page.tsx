import { Suspense } from 'react';
import { SearchResultsPage } from '../../src/app/pages/SearchResultsPage';
export default function Page() {
  return (
    <Suspense>
      <SearchResultsPage />
    </Suspense>
  );
}
