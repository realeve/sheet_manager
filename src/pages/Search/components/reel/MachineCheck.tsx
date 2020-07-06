import React from 'react';
import { Col, Card, Empty } from 'antd';
import SimpleTable from '../SimpleTable';
import styles from '../cart/ProdList.less';
import { useFetch } from '@/pages/Search/utils/useFetch';
import Err from '@/components/Err';

export default function MachineCheck({ reel }) {
  const { loading, ...res } = useFetch({
    params: reel,
    type: 'reel',
    api: 'getViewPaperQuality',
    init: [reel],
  });

  return (
    <Col span={24}>
      <Card
        title={`机检质量统计`}
        bodyStyle={{
          padding: '10px 20px',
        }}
        hoverable
        style={{ marginBottom: 10 }}
        className={styles.cart}
      >
        {res.err ? (
          <Err err={res.err} />
        ) : res.rows === 0 ? (
          <Empty description="查询无结果，请更换轴号重试" />
        ) : (
          <SimpleTable data={res} loading={loading} />
        )}
      </Card>
    </Col>
  );
}
