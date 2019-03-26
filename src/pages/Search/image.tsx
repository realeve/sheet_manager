import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Input, Tooltip } from 'antd';
import styles from './Image.less';
import { useFetch } from './utils/useFetch';
import ImageItem from './components/ImageItem';
import classNames from 'classnames/bind';
import * as R from 'ramda';
const cx = classNames.bind(styles);

function ImageSearch({ cart }) {
  const [code, setCode] = useState(null);
  const [filter, setFilter] = useState(0);
  const res = useFetch({ params: cart, api: 'getQfmWipJobsHechaImage', init: [cart] });
  const { data: silk } = useFetch({ params: cart, api: 'getWipJobsSilkImage', init: [cart] });
  const { data: codeList } = useFetch({ params: cart, api: 'getWipJobsCodeImage', init: [cart] });
  let hecha = R.filter(R.propEq('type', 'mahou'))(res.data);
  let tubu = R.filter(R.propEq('type', 'tubu'))(res.data);

  const [imgnum, setImgnum] = useState([0, 0, 0, 0]);

  useEffect(() => {
    setImgnum([
      hecha.length + silk.length + codeList.length + tubu.length,
      hecha.length,
      silk.length,
      codeList.length,
      tubu.length,
    ]);
  }, [hecha, silk, codeList, tubu]);

  const onChange = e => {
    let code = e.target.value.trim().toUpperCase();
    setCode(code);
  };

  // 添加涂布
  let checkList = ['所有图像', '票面', '丝印', '号码', '涂布'];

  const onFilter = item => R.isNil(code) || item.code.includes(code);
  const titleRender = ({ data: item }) => (
    <div>
      <p>
        相机：{item.camera} / 第{item.pos}开
      </p>
      <p>印码号：{item.code}</p>
    </div>
  );

  return (
    <Card>
      <div className={styles.imgsearch}>
        <div className={styles.title}>
          <div className={styles.container}>
            {checkList.map((name, i) => (
              <Tooltip placement="top" title={imgnum[i]} key={name}>
                <div
                  className={cx({ item: true, 'item-active': filter === i })}
                  onClick={() => setFilter(i)}
                >
                  {name}
                </div>
              </Tooltip>
            ))}
          </div>
          <Input.Search
            value={code}
            onChange={onChange}
            placeholder="开位/印码号筛选"
            className={styles.search}
            style={{ width: 200 }}
            maxLength={8}
          />
        </div>
        <ul className={styles.content}>
          <ImageItem
            visible={[0, 3].includes(filter)}
            data={R.filter(onFilter, codeList)}
            type="code"
            ImageTitle={titleRender}
          />
          <ImageItem
            visible={[0, 2].includes(filter)}
            data={R.filter(onFilter, silk)}
            ImageTitle={titleRender}
            type="silk"
          />
          <ImageItem
            visible={[0, 1].includes(filter)}
            data={R.filter(onFilter, hecha)}
            type="hecha"
            ImageTitle={titleRender}
          />
          <ImageItem
            visible={[0, 4].includes(filter)}
            data={tubu}
            type="tubu"
            ImageTitle={titleRender}
          />
        </ul>
      </div>
    </Card>
  );
}

export default connect(({ search: { cart } }) => ({
  cart,
}))(ImageSearch);
