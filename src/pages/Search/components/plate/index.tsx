import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import Table from '@/components/Table';

export default connect(({ search: { plate } }) => ({
  plate,
}))(({ plate }) => {
  const [data, setData] = useState({
    data: [
      [
        '9603A品',
        '119331032961305013',
        '19010019',
        '1130.961310.00',
        '激光雕刻凹印色模版',
        '背面第1色.40K.W92型 正图',
        '195.50',
        '2020-01-10 17:05:57',
        '2020-03-11 10:56:38',
        'W92型凹印机',
        'W92A型凹印机3#',
        '正常下机',
        '凹印牟军机台',
        '郑旭阳',
        '何秋菡',
      ],
      [
        '9606T品',
        '119331007962601115',
        'NP19020070',
        '1120.962602.00',
        '镍凹印版',
        '正面.35K.通用',
        '97.07',
        '2020-01-10 16:17:23',
        '2020-03-11 13:55:59',
        'W92型凹印机',
        'W92C型凹印机12#',
        '裂版',
        '凹印刘健康机台',
        '刘潺',
        '何秋菡',
      ],
      [
        '9607T品',
        '119331021962702129',
        'SW19080038',
        '1130.962701.00',
        '丝网版',
        '周长1200mm',
        '124.80',
        '2020-02-24 20:05:44',
        '2020-03-11 22:57:51',
        'DMK08A型丝印码联合印钞机',
        'DMK08A型丝凸印联合印钞机1#',
        '正常下机',
        '丝凸罗昭机台',
        '罗昭',
        '温力',
      ],
    ],
    rows: 3,
    dates: ['20200311', '20200311'],
    ip: '10.8.18.243',
    header: [
      '品种',
      '版号',
      '总公司版号',
      'ERP编码',
      '版别',
      '色别',
      '总印数',
      '上机时间',
      '下机时间',
      '机型',
      '机台',
      '下机原因',
      '机长',
      '付出方',
      '接收人员',
    ],
    title: '胶凹印版印数查询',
    time: '23334.71ms',
    serverTime: '2020-03-12 15:49:19',
    cache: { length: 300, time: '2020-03-12 15:49:19' },
    source: '数据来源：MES系统_生产环境',
    hash: 'W/"b6bc052e77991983845dbd7feea1a7be"',
  });
  return (
    <div>
      <Card title={<span>版号信息查询 (总公司版号：{plate}) </span>} style={{ marginBottom: 20 }}>
        {data.rows > 0 ? (
          <Row gutter={10}>
            {data.header.map((item, idx) => (
              <Col span={6} className={styles.item}>
                <div className={styles.title}>{item}:</div>
                <span>{data.data[0][idx]}</span>
              </Col>
            ))}
          </Row>
        ) : (
          <div>无数据</div>
        )}
      </Card>
      <Card>
        <Table dataSrc={data} />
      </Card>
    </div>
  );
});
