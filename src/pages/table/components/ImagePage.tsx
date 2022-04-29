import React, { useRef, useEffect, useState } from 'react';
import styles from './style.less';
import * as R from 'ramda';
import { Card, Empty } from 'antd';
import 'animate.css';
import { isInt, isCart, imgUrl } from '@/utils/lib';

const prefix = 'data:image/jpg;base64,';

const getCartLink = cart =>
  isCart(cart) ? (
    <a href={`${imgUrl}${cart}`} target="_blank">
      {cart}
    </a>
  ) : (
    cart
  );

const ImageTitle = ({ data, header }) => {
  let titles = header.map((key, value) => (
    <span key={value}>
      {key}: {getCartLink(data[value])}
    </span>
  ));
  let [resLeft, resRight] = R.splitEvery(Math.ceil(titles.length / 2), titles);
  return (
    <div className={styles.block}>
      <div>
        {resLeft.map((item, idx) => (
          <p key={idx}>{item}</p>
        ))}
      </div>
      <div>
        {resRight.map((item, idx) => (
          <p key={idx}>{item}</p>
        ))}
      </div>
    </div>
  );
};

const filterBlob = (data, blob) => {
  let row = [];

  data.forEach((item, idx) => {
    if (idx !== blob) {
      row.push(item);
    }
  });
  return row;
};

const prehandleData = ({ header, blob }) => {
  if (!isInt(blob)) {
    blob = R.findIndex(item => item == blob)(header);
  } else {
    blob = Number(blob);
  }
  return [filterBlob(header, blob), blob];
};

function ImageItem({ data, blob, gutter, onImageClick }) {
  let [header, blobIdx] = prehandleData({ blob, header: data.header });

  return data.data.map((row, idx) => {
    // 分离图像数据，其它数据
    let image = row[blobIdx] || '';
    if (!image.includes('base64')) {
      image = prefix + image;
    } else {
      if (image.length < 30) {
        image = null;
      }
    }
    let titleList = filterBlob(row || [], blobIdx);
    return (
      <li
        key={idx}
        className="animated zoomIn"
        style={{ marginRight: gutter }}
        onClick={() => onImageClick(row)}
      >
        <div className={styles.wrap}>{image && <img src={image} alt={idx} />}</div>
        <div className={styles.desc}>
          <ImageTitle data={titleList} header={header} key={idx} />
        </div>
      </li>
    );
  });
}

function Index({ data, blob, extra = null, subTitle = null, onImageClick = () => { } }) {
  let { title, source, rows } = data;
  let container = useRef({ current: { offsetWidth: 0 } });
  let [gutter, setGutter] = useState(5);

  // 自动调整间隙占满容器
  useEffect(() => {
    if (!container?.current?.offsetWidth) {
      return;
    }
    let maxWidth = container.current.offsetWidth - 16;
    let imgNum = Math.floor(maxWidth / 180);
    let gutterNum = maxWidth % 180;
    let curGutter = Math.floor(gutterNum / imgNum);
    setGutter(curGutter > 100 ? 5 : curGutter);
  }, [container?.current?.offsetWidth]);

  if (null == data || data.data.length === 0 || R.type(data.data[0]) === 'Object') {
    return null;
  }

  return (
    <Card
      title={
        <div>
          <h3 style={{ fontWeight: 'lighter' }}>
            {title} <small>({source})</small>
          </h3>
          {subTitle}
        </div>
      }
      bodyStyle={{ padding: 5 }}
      extra={extra}
    >
      {rows === 0 ? (
        <Empty description="查询无结果，请更换检索车号重试" />
      ) : (
        <ul className={styles.content} ref={container}>
          <ImageItem data={data} blob={blob} gutter={gutter} onImageClick={onImageClick} />
        </ul>
      )}
    </Card>
  );
}

export default React.memo(Index, (prevProps, nextProps) => {
  return R.equals(prevProps.data, nextProps.data);
});
