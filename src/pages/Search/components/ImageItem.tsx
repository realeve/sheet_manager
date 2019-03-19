import React from 'react';
import styles from '../Image.less';
import 'animate.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function ImageItem({ data, type, ImageTitle, visible }) {
  return data.map(
    (item, idx) =>
      visible && (
        <li key={type + idx} className={cx(['animated', { zoomIn: visible }])}>
          <div className={styles.wrap}>
            <img src={`data:image/jpg;base64,${item.image}`} alt={item.code} />
          </div>
          <div className={styles.desc}>
            <ImageTitle data={item} />
          </div>
        </li>
      )
  );
}
