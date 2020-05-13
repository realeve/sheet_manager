import React, { Suspense } from 'react';
import style from './index.less';
import { data } from '../_mock';
import { PageLoading } from '../components/';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));

const ProductNum = React.lazy(() => import('./ProductNum'));
const Quality = React.lazy(() => import('./Quality'));
const Machine = React.lazy(() => import('./Machine'));

export default () => {
  return (
    <div className={style.dashboard}>
      <Suspense fallback={<PageLoading />}>
        <IntroduceRow loading={false} visitData={data.visitData} />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <ProductNum />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <Quality />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <Machine />
      </Suspense>
    </div>
  );
};
