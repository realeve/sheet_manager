import React from 'react';
import router from 'umi/router';
import { Result, Button } from 'antd';
export default () => (
  <Result
    status="500"
    title="500"
    subTitle="抱歉,服务器出错了."
    extra={
      <Button
        type="primary"
        onClick={() => {
          router.goBack();
        }}
      >
        返回
      </Button>
    }
  />
);
