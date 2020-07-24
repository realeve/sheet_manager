import React, { Suspense } from 'react';
import style from './index.less';
import { PageLoading } from '../components/';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));

const ProductNum = React.lazy(() => import('./ProductNum'));
const Quality = React.lazy(() => import('./Quality'));
const FakePrint = React.lazy(() => import('./FakePrint'));

const ProductDetail = React.lazy(() => import('./ProductDetail'));

const PaperRun = React.lazy(() => import('./PaperRun'));

export default () => {
  return (
    <div className={style.dashboard}>
      <Suspense fallback={<PageLoading />}>
        <IntroduceRow />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <ProductNum />
      </Suspense>

      <Suspense fallback={<PageLoading />}>
        <ProductDetail />
      </Suspense>

      <Suspense fallback={<PageLoading />}>
        <Quality />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <FakePrint />
      </Suspense>

      <Suspense fallback={<PageLoading />}>
        <PaperRun />
      </Suspense>
    </div>
  );
};
