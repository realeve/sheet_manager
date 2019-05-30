import React from 'react';
import { Card } from 'antd';
import styles from './cart/ProdList.less';
import SimpleTable from './SimpleTable';

export default function CardTable({ data, loading, title, bodyStyle = {} }) {
  return (
    <>
      <Card
        title={title}
        bodyStyle={{
          padding: '10px 20px',
          maxHeight: 300,
          overflowY: 'auto',
          ...bodyStyle
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
