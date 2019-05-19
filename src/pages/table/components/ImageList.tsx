import React from 'react';
import styles from './ImageList.less';
import 'animate.css';
import * as R from 'ramda'
const prefix = 'data:image/jpg;base64,';
// todo 增加点击复制url链接功能.

const ImageTitle = data => {
  let titles = Object.entries(data).map((key, value) => `${key}:${value}`);
  let [resLeft, resRight] = R.splitEvery(Math.ceil(titles.length / 2), titles);
  return <div>
    <p>{resLeft.map(item => <span>{item}</span>)}</p>
    <p>{resRight.map(item => <span>{item}</span>)}</p>
  </div>
}

function ImageItem({ data, blob }) {
  return data.map((imgList, idx) => {
    // 分离图像数据，其它数据
    let { [blob]: _image_, ...item } = imgList;
    return (
      <li
        key={idx}
        className="animated zoomIn"
      >
        <div className={styles.wrap}>
          <img src={`${prefix}${_image_}`} alt={idx} />
        </div>
        <div className={styles.desc}>
          <ImageTitle data={item} />
        </div>
      </li>
    )
  })
}

export default React.memo(ImageItem, (prevProps, nextProps) => {
  return R.equals(prevProps.data, nextProps.data)
})