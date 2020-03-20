import React from 'react';
import { Col, Empty, Row } from 'antd';
import styles from './SimpleList.less';
import Err from '@/components/Err';
import * as R from 'ramda';
import * as lib from '@/utils/lib';
import * as setting from '@/utils/setting';

export type tListWidth = 6 | 8 | 12 | 24;

export const renderItem = item => {
  if (lib.isCartOrReel(item)) {
    return (
      <a href={`${setting.searchUrl}${item}`} target="_blank" style={{ textDecoration: 'none' }}>
        {item}
      </a>
    );
  }
  if (lib.isFloat(item)) {
    return Number(item);
  }
  return item;
};

const ListItem = ({ data, header, span }) => {
  let newHeader = [];
  header.forEach(key => {
    if (String(data[key]).trim().length > 0) {
      newHeader.push(key);
    }
  });
  return <ListItemFull data={data} header={newHeader} span={span} />;
};

const ListItemFull = ({ data, header, span }) => {
  // 自动清除空数据
  let headerData = R.splitEvery(Math.ceil(header.length / Math.ceil(24 / span)), header);
  return headerData.map((item, idx) => (
    <Col span={span} key={idx} style={{ marginBottom: 15 }}>
      <ul style={{ marginRight: 15 }}>
        {item.map(title => (
          <li key={title}>
            <strong>{title}</strong>
            {data[title] === '0.0' ? '' : renderItem(data[title])}
          </li>
        ))}
      </ul>
    </Col>
  ));
};

/**
 * removeEmpty:是否移除其中的空数据
 */
export default ({
  data,
  span = 8,
  removeEmpty = false,
}: {
  span: tListWidth;
  removeEmpty?: boolean;
}) => {
  if (data.err) {
    return <Err err={data.err} />;
  }
  if (data.rows === 0) {
    return <Empty />;
  }

  return (
    <Row className={styles.detail}>
      {data.data.map((srcData, rowId) =>
        removeEmpty ? (
          <ListItem key={rowId} header={data.header} data={srcData} span={span} />
        ) : (
          <ListItemFull key={rowId} header={data.header} data={srcData} span={span} />
        )
      )}
    </Row>
  );
};
