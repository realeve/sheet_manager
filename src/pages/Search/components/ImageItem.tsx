import React from 'react';
import styles from '../Image.less';
import 'animate.css';
import copy from 'copy-to-clipboard';
import { message } from 'antd';
import * as R from 'ramda'
const prefix = 'data:image/jpg;base64,';
// todo 增加点击复制url链接功能.

const ImageTitle = ({ data: { camera, macro_id, pos, code } }) => (
  <div>
    <p>
      相机：{camera} / 宏区{macro_id} / 第{pos}开
    </p>
    <p>印码号：{code}</p>
  </div>
);

function ImageItem({ data, type, visible, gutter }) {
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
        style={{ marginRight: gutter }}
      >
        <div className={styles.wrap}>
          <img src={`${prefix}${item.image}`} alt={item.code} />
        </div>
        <div className={styles.desc}>
          <ImageTitle data={item} />
        </div>
      </li >
    ))
  );
}

export default React.memo(ImageItem, (prevProps, nextProps) => {
  return prevProps.gutter === nextProps.gutter && prevProps.visible === nextProps.visible && R.equals(prevProps.data, nextProps.data)
})