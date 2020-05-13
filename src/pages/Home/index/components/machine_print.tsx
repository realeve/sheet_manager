import React from 'react';

import { Card, Button } from 'antd';

export default () => {
  return (
    <Card
      title="产品变动成本"
      bodyStyle={{ height: 300 }}
      extra={
        <Button type="default" size="small">
          查看详情
        </Button>
      }
    >
      各品种产品成本展示
    </Card>
  );
};
