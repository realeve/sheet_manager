import React, { useState } from 'react';

import { Card, Button, Radio } from 'antd';
import { jump } from '@/utils/lib';
import styles from './product_print.less';

export default () => {
  const [url, setUrl] = useState('');
  return (
    <Card
      title="印钞生产计划完成率"
      bodyStyle={{ height: 300 }}
      extra={
        // <Button
        //   type="default"
        //   size="small"
        //   onClick={() => {
        //     jump(
        //       '/chart#id=940/bd3aba9285&prod=9602T&daterange=9&group=1&legend=2&x=0&y=3&type=line&smooth=1&dr0_id=941/958dada9e0&dr0_type=bar&dr0_legend=1&dr0_x=0&dr0_y=2&dr1_id=942/47a7d8b252&dr1_type=bar&dr2_id=943/64fbe9194a&dr2_drilltype=table&cache=0'
        //     );
        //   }}
        // >
        //   查看详情
        // </Button>

        <div className={styles.action}>
          <Radio.Group defaultValue="9603T" buttonStyle="solid" size="small">
            <Radio.Button value="9602T">9602T</Radio.Button>
            <Radio.Button value="9603T">9603T</Radio.Button>
            <Radio.Button value="9604T">9604T</Radio.Button>
            <Radio.Button value="9606T">9606T</Radio.Button>
            <Radio.Button value="9607T">9607T</Radio.Button>
          </Radio.Group>
        </div>
      }
    ></Card>
  );
};
