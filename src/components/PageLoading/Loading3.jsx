import React from 'react';
import styles from './Loading3.less';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const cls = cx('circular', 'another');
export default () => (
  <div className={styles.wrap}>
    <div className={styles.loader} />
    <div className={styles.loaderbefore} />
    <div className={styles.circular} />
    <div className={cls} />
    <div className={styles.text}>载入中</div>
  </div>
);
