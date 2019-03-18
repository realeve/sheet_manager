import React from 'react';
import { Card, Empty } from 'antd';
import styles from './ProdList.less';
import { useFetch } from '@/pages/Search/utils/useFetch';
import SimpleTable from '../SimpleTable';

export default function ProcAdjustList({ cart }) {
  const res = useFetch({ params: cart, api: 'getProcAdjustLog', init: [cart] });
  return (
    <Card
      title={`工艺调整记录`}
      bodyStyle={{
        padding: '10px 20px',
      }}
      hoverable
      style={{ marginBottom: 10 }}
      className={styles.cart}
    >
      {res.rows === 0 ? <Empty /> : <SimpleTable data={res} loading={res.loading} />}
    </Card>
  );
}
