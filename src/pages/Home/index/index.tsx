import React, { Suspense } from 'react';
import style from './index.less';
import { data } from '../_mock';
import { PageLoading } from '../components/';
import ProductNum from './ProductNum';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
export default () => {
  return (
    <div className={style.dashboard}>
      <Suspense fallback={<PageLoading />}>
        <IntroduceRow loading={false} visitData={data.visitData} />
      </Suspense>
      <Suspense fallback={<PageLoading />}>
        <ProductNum />
      </Suspense>
    </div>
  );
};
