import React, { Suspense } from 'react';
import style from './index.less';
import { data } from '../_mock';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
export default () => {
  return (
    <div className={style.dashboard}>
      <Suspense fallback={null}>
        <IntroduceRow loading={false} visitData={data.visitData} />
      </Suspense>
    </div>
  );
};
