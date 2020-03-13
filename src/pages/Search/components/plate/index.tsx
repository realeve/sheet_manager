import React from 'react';
import { Row, Col, Card } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import Table from '@/components/Table';
import useFetch from '@/components/hooks/useFetch';

export default connect(({ search: { plate } }) => ({
  plate,
}))(({ plate }) => {
  const { data, loading } = useFetch({
    param: {
      url: '/867/544c43fc47.array',
      params: {
        plate,
      },
    },
    valid: plate => String(plate).length > 0,
  });
  const { data: plateData, loading: plateLoading } = useFetch({
    param: {
      url: '/868/9ea8e4ef41.array',
      params: {
        plate,
      },
    },
    valid: plate => String(plate).length > 0,
  });
  return (
    <div>
      <Card
        loading={loading}
        title={<span>版号信息查询 (总公司版号：{plate}) </span>}
        style={{ marginBottom: 10 }}
        bodyStyle={{ paddingBottom: 12, paddingTop: 12 }}
      >
        {data && data.rows > 0 ? (
          <Row gutter={10}>
            {data.header.map((item, idx) => (
              <Col span={6} className={styles.item} key={item}>
                <div className={styles.title}>{item}:</div>
                <span>{data.data[0][idx]}</span>
              </Col>
            ))}
          </Row>
        ) : (
          <div>无数据</div>
        )}
      </Card>
      {plateData && (
        <Card loading={plateLoading} bodyStyle={{ paddingBottom: 12 }}>
          <Table dataSrc={plateData} sheetHeight={460} />
        </Card>
      )}
    </div>
  );
});
