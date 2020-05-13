import React from 'react';

import { Card, Button } from 'antd';
import { jump } from '@/utils/lib';
export default () => {
  return (
    <Card
      title="印钞生产计划完成率"
      bodyStyle={{ height: 300 }}
      extra={
        <Button
          type="default"
          size="small"
          onClick={() => {
            jump(
              '/chart#id=940/bd3aba9285&select=550/12623689ae&selectkey=prod&daterange=9&group=1&legend=2&x=0&y=3&type=line&smooth=1&dr0_id=941/958dada9e0&dr0_type=bar&dr0_legend=1&dr0_x=0&dr0_y=2&dr1_id=942/47a7d8b252&dr1_type=bar&dr2_id=943/64fbe9194a&dr2_drilltype=table&cache=0'
            );
          }}
        >
          查看详情
        </Button>
      }
    ></Card>
  );
};
