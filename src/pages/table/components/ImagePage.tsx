import React, { useRef, useEffect, useState } from 'react';
import styles from './style.less';
import * as R from 'ramda'
import { Card, Empty } from 'antd';
import 'animate.css';
import { isInt, isCart, imgUrl } from '@/utils/lib'

const prefix = 'data:image/jpg;base64,';

const getCartLink = cart => isCart(cart) ? <a href={`${imgUrl}${cart}`} target="_blank">{cart}</a> : cart;

const ImageTitle = ({ data, header }) => {
  let titles = header.map((key, value) => <span key={value}>{key}: {getCartLink(data[value])}</span>);
  let [resLeft, resRight] = R.splitEvery(Math.ceil(titles.length / 2), titles);
  return <div className={styles.block}>
    <div>{resLeft.map(item => <p>{item}</p>)}</div>
    <div>{resRight.map(item => <p>{item}</p>)}</div>
  </div>
}

const filterBlob = (data, blob) => {
  let row = [];
  data.forEach((item, idx) => {
    if (idx !== blob) {
      row.push(item)
    }
  });
  return row;
}

const prehandleData = ({ header, blob }) => {
  if (!isInt(blob)) {
    blob = R.findIndex(item => item == blob)(header);
  } else {
    blob = Number(blob);
  }

  return [filterBlob(header, blob), blob]
}

function ImageItem({ data, blob, gutter }) {
  let [header, blobIdx] = prehandleData({ blob, header: data.header });

  return data.data.map((row, idx) => {
    // 分离图像数据，其它数据
    let image = row[blobIdx];
    if (!image.includes('base64')) {
      image = prefix + image;
    }
    let titleList = filterBlob(row, blobIdx);

    return (
      <li
        key={idx}
        className="animated zoomIn"
        style={{ margin: gutter }}
      >
        <div className={styles.wrap}>
          <img src={image} alt={idx} />
        </div>
        <div className={styles.desc}>
          <ImageTitle data={titleList} header={header} />
        </div>
      </li>
    )
  })
}

function Index({ data, blob, subTitle }) {
  let { title, source, rows } = data;
  let container = useRef(null);
  let [gutter, setGutter] = useState(5);

  // 自动调整间隙占满容器
  useEffect(() => {
    let maxWidth = container.current.offsetWidth - 16;
    let imgNum = Math.floor(maxWidth / 180);
    let gutterNum = maxWidth % 180;
    let curGutter = Math.floor(gutterNum / imgNum / 2);
    setGutter(curGutter)
  }, [])

  return (<Card title={<div>
    <h3 style={{ fontWeight: 'lighter' }}>{title} <small>({source})</small></h3>
    {subTitle}
  </div>}>
    {
      rows === 0 ? <Empty /> : <ul className={styles.content} ref={container}><ImageItem data={data} blob={blob} gutter={gutter} /></ul>
    }
  </Card>)
}

export default React.memo(Index, (prevProps, nextProps) => {
  return R.equals(prevProps.data, nextProps.data)
})