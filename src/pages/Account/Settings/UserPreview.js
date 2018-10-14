import React from 'react';
import { Card, Spin } from 'antd';
import styles from './UserPreview.less';

const { Meta } = Card;

export default function UserPreview({ style, avatar, dept_name, fullname }) {
  const loading = !!!avatar;
  return (
    <Card
      className={styles.user_preview}
      hoverable
      style={style}
      cover={<img alt={fullname} src={avatar} />}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Meta title={fullname} description={dept_name} />
      )}
    </Card>
  );
}
