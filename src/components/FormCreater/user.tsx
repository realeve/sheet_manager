import React from 'react';
import { Avatar } from 'antd';
import styles from './index.less';
import router from 'umi/router';

export default ({ user }) => {
  return (
    <>
      <div
        title="点击切换班次"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          router.push(`/login?redirect=${window.location.href}`);
        }}
      >
        <Avatar className={styles.avatar} src={user.avatar} alt="avatar" />
        <span className={styles.name} style={{ margin: '0 10px' }}>
          {user.fullname}
        </span>
      </div>
    </>
  );
};
