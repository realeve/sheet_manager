import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Tooltip } from 'antd';
import styles from './Image.less';
import { useFetch } from './utils/useFetch';
import ImageItem from './components/ImageItem';
import classNames from 'classnames/bind';
import * as R from 'ramda';
import HeatmapChart from './HeatmapChart';
import ProdList from './components/cart/ProdList';


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

  let [curpos, setCurpos] = useState(0);

  const onFilterPos = pos => {
    setCurpos(pos);
  }

  // 添加涂布
  let checkList = ['所有图像', '票面', '丝印', '号码', '涂布'];

  const onFilter = item => R.isNil(code) || item.code.includes(code);

  const titleRender = ({ data: { camera, macro_id, pos, code } }) => (
    <div>
      <p>
        相机：{camera} / 宏区{macro_id} / 第{pos}开
      </p>
      <p>印码号：{code}</p>
    </div>
  );

  const getCurData = data => curpos > 0 ? R.filter(R.propEq('pos', String(curpos)), data) : data

  let container = useRef({ current: { offsetWidth: 0 } });
  let [gutter, setGutter] = useState(5);
  let [gutterCode, setGutterCode] = useState(5)
  // 自动调整间隙占满容器
  useEffect(() => {
    if (container.current.offsetWidth === 0) {
      return;
    }
    let maxWidth = container.current.offsetWidth - 16;
    let getGutter = width => {
      let imgNum = Math.floor(maxWidth / width);
      let gutterNum = maxWidth % width;
      let curGutter = Math.floor(gutterNum / imgNum);
      return curGutter;
    }
    setGutter(getGutter(180))
    setGutterCode(getGutter(320))
  }, [container.current.offsetWidth])

  return (
    <>
      <Row gutter={16}>
        <Col span={12} >
          <Card style={{ marginBottom: 20 }}
            bodyStyle={{
              padding: '10px 20px',
            }} title="各开位实废分布">
            <HeatmapChart cart={cart} onFilter={onFilterPos} />
          </Card>
        </Col>
        <Col span={12} >
          <ProdList cart={cart} type="cart" beforeRender={res => {
            res.data = res.data.filter(item => item.ProcName === '印码');
            return res;
          }} />
        </Col>
      </Row>

      <Card>
        <div className={styles.imgsearch}>
          <div className={styles.title}>
            <div className={styles.container}>
              <div>
                <div
                  className={cx('item', 'item-active')}
                  onClick={() => setCurpos(0)}
                  style={{ marginRight: 10, borderColor: '#e56', backgroundColor: '#e56' }}
                >
                  显示所有开
              </div>{curpos > 0 && <div
                  className={cx('item')}
                  style={{ cursor: 'not-allowed' }}
                >
                  第{curpos}开
              </div>}</div>

              <div> {checkList.map((name, i) => (
                <Tooltip placement="top" title={imgnum[i]} key={name}>
                  <div
                    className={cx({ item: true, 'item-active': filter === i })}
                    onClick={() => setFilter(i)}
                  >
                    {name}
                  </div>
                </Tooltip>
              ))} </div>
              <Input.Search
                value={code}
                onChange={onChange}
                placeholder="开位/印码号筛选"
                className={styles.search}
                style={{ width: 200 }}
                maxLength={8}
              />
            </div>
          </div>
          <ul className={styles.content} ref={container}>
            <ImageItem
              visible={[0, 3].includes(filter)}
              data={R.filter(onFilter, getCurData(codeList))}
              type="code"
              ImageTitle={titleRender}
              gutter={gutterCode}
            />
            <ImageItem
              visible={[0, 2].includes(filter)}
              data={R.filter(onFilter, getCurData(silk))}
              ImageTitle={titleRender}
              type="silk"
              gutter={gutter}
            />
            <ImageItem
              visible={[0, 1].includes(filter)}
              data={R.filter(onFilter, getCurData(hecha))}
              type="hecha"
              ImageTitle={titleRender}
              gutter={gutter}
            />
            <ImageItem
              visible={[0, 4].includes(filter)}
              data={getCurData(tubu)}
              type="tubu"
              ImageTitle={titleRender}
              gutter={gutter}
            />
          </ul>
        </div>
      </Card></>
  );
}

export default connect(({ search: { cart } }) => ({
  cart,
}))(ImageSearch);
