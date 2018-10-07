import React from 'react';
import { Card } from 'antd';
import styles from './UserPreview.less';

const { Meta } = Card;

export default function UserPreview({ avatar, dept_name, fullname }) {
  return (
    <div>
      <h3>用户预览</h3>
      <Card
        className={styles.user_preview}
        hoverable
        style={{ width: 240 }}
        cover={<img alt={fullname} src={avatar} />}>
        <Meta title={fullname} description={dept_name} />
      </Card>
    </div>
  );
}
