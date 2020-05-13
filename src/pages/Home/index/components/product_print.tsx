import React from 'react';

import { Card, Button } from 'antd';

export default () => {
  return (
    <Card
      title="印钞生产计划完成率"
      bodyStyle={{ height: 300 }}
      extra={
        <Button type="default" size="small">
          查看详情
        </Button>
      }
    ></Card>
  );
};
