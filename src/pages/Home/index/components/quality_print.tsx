import React from 'react';

import { Card, Button } from 'antd';

export default () => {
  return (
    <Card
      title="印钞主要质量指标"
      bodyStyle={{ height: 300 }}
      extra={
        <Button type="default" size="small">
          查看详情
        </Button>
      }
    ></Card>
  );
};
