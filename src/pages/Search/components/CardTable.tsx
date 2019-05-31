import React from 'react';
import { Card } from 'antd';
import styles from './cart/ProdList.less';
import SimpleTable from './SimpleTable';
import { Scrollbars } from 'react-custom-scrollbars';

export default function CardTable({ data, loading, title, bodyStyle = {} }) {
  return (
    <>
      <Card
        title={title}
        bodyStyle={{
          padding: 10,
          ...bodyStyle
        }}
        hoverable
        style={{ marginBottom: 10 }}
        className={styles.cart}
        loading={loading}
      >
        <Scrollbars
          autoHide
          autoHeight
          autoHeightMin={200}
          autoHeightMax={300}
          thumbMinSize={30} >
          <SimpleTable data={data} />
        </Scrollbars>
      </Card>
    </>
  );
}
