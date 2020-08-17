import React from 'react';
import { formatMessage } from 'umi/locale'; 
export default () => (
  <div className="ant-result ant-result-403">
    <div className="ant-result-icon ant-result-image">
      <img src="/img/403.svg" />
    </div>
    <div className="ant-result-title">身份校验失败</div>
    <div className="ant-result-subtitle">
      {formatMessage({ id: 'app.exception.description.403' })}
    </div>
  </div>
);
