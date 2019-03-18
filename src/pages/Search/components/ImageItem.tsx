import React from 'react';
import styles from '../Image.less';

export default function ImageItem({ data, type, title }) {
  return data.map((item, idx) => (
    <li key={type + idx} className={styles.imgCard}>
      <div className={styles.wrap}>
        <img src={`data:image/jpg;base64,${item.image}`} alt={item.code} />
      </div>
      <div className={styles.desc}>{title(item)}</div>
    </li>
  ));
}
