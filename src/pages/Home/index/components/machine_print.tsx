import React from 'react';

import { Card, Button } from 'antd';

export default () => {
  return (
    <Card
      title="印钞设备运行情况"
      bodyStyle={{ height: 300 }}
      extra={
        <Button type="default" size="small">
          查看详情
        </Button>
      }
    ></Card>
  );
};
