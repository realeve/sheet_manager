import React from 'react';
import { formatMessage } from 'umi/locale';

import Footer from '@/layouts/Footer';

export default () => (
  <>
    <div className="ant-result ant-result-403" style={{ flex: 1 }}>
      <div className="ant-result-icon ant-result-image">
        <img src="/img/403.svg" />
      </div>
      <div className="ant-result-title">身份校验失败</div>
      <div className="ant-result-subtitle">
        {formatMessage({ id: 'app.exception.description.403' })}，有疑问请致电028-82756129.
      </div>
    </div>
    <Footer />
  </>
);
