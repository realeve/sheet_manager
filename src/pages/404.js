import React from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { Result, Button } from 'antd';
export default () => (
  <Result
    status="404"
    title="404"
    style={{ minHeight: 500, height: '100%' }}
    subTitle={formatMessage({ id: 'app.exception.description.403' })}
    extra={
      <Button
        type="primary"
        onClick={() => {
          router.goBack();
        }}
      >
        {formatMessage({ id: 'app.exception.back' })}
      </Button>
    }
  />
);
