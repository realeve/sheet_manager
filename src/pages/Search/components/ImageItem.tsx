import React from 'react';
import styles from '../Image.less';
import 'animate.css';
import copy from 'copy-to-clipboard';
import { message } from 'antd';

const prefix = 'data:image/jpg;base64,';
// todo 增加点击复制url链接功能.
export default function ImageItem({ data, type, ImageTitle, visible }) {
  const copyImg = img => {
    copy(img);
    message.success('图像拷贝成功');
  };
  return (
    visible &&
    data.map((item, idx) => (
      <li
        key={type + idx}
        className="animated zoomIn"
        onClick={() => copyImg(`${prefix}${item.image}`)}
      >
        <div className={styles.wrap}>
          <img src={`${prefix}${item.image}`} alt={item.code} />
        </div>
        <div className={styles.desc}>
          <ImageTitle data={item} />
        </div>
      </li>
    ))
  );
}
