import React, { Suspense } from 'react';
const Cost = React.lazy(() => import('./components/plan'));

export default () => {
  return (
    <Suspense fallback={null}>
      <Cost />
    </Suspense>
  );
};
