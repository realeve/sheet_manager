import React from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { Result, Button } from 'antd';
export default () => (
  <Result
    status="403"
    title="403"
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
