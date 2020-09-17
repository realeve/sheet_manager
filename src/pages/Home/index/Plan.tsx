import React, { Suspense } from 'react';
const Plan = React.lazy(() => import('./components/plan')); 

export default () => {
  return (
    <Suspense fallback={null}>
      <Plan /> 
    </Suspense>
  );
};
