import React from 'react';
import { Card } from 'antd';
import styles from './cart/ProdList.less';
import SimpleTable from './SimpleTable';

export default function CardTable({ data, loading, title }) {
  return (
    <>
      <Card
        title={title}
        bodyStyle={{
          padding: '20px',
        }}
        hoverable
        style={{ marginBottom: 10 }}
        className={styles.cart}
        loading={loading}
      >
        <SimpleTable data={data} />
      </Card>
    </>
  );
}
