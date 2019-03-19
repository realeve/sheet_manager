import React from 'react';
import styles from '../Image.less';
import 'animate.css';

export default function ImageItem({ data, type, ImageTitle, visible }) {
  return (
    visible &&
    data.map((item, idx) => (
      <li key={type + idx} className="animated zoomIn">
        <div className={styles.wrap}>
          <img src={`data:image/jpg;base64,${item.image}`} alt={item.code} />
        </div>
        <div className={styles.desc}>
          <ImageTitle data={item} />
        </div>
      </li>
    ))
  );
}
