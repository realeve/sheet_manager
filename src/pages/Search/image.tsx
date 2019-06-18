import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Tooltip } from 'antd';
import styles from './Image.less';
import { useFetch } from './utils/useFetch';
import ImageItem from './components/ImageItem';
import classNames from 'classnames/bind';
import * as R from 'ramda';
import HeatmapChart from './HeatmapChart';
import ImageList from '@/pages/table/components/ImagePage'
import { useSetState } from 'react-use';
import Err from '@/components/Err';

const cx = classNames.bind(styles);

function ImageSearch({ cart }) {
  const [code, setCode] = useState(null);
  const [filter, setFilter] = useState(0);
  const res = useFetch({ params: cart, api: 'getQfmWipJobsHechaImage', init: [cart] });
  const { data: silk } = useFetch({ params: cart, api: 'getWipJobsSilkImage', init: [cart] });
  const { data: codeList, err: errCode } = useFetch({ params: cart, api: 'getWipJobsCodeImage', init: [cart] });
  let hecha = R.filter(R.propEq('type', 'mahou'))(res.data);
  let tubu = R.filter(R.propEq('type', 'tubu'))(res.data);

  const mainFake = useFetch({ params: cart, api: 'getQfmWipJobsMain', init: [cart] })

  const [imgnum, setImgnum] = useState([0, 0, 0, 0]);

  useEffect(() => {
    setImgnum([
      hecha.length + silk.length + (codeList ? codeList.length : 0) + tubu.length,
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


  let [fakeInfo, setFakeInfo] = useSetState({ camera: '0', macro: '0' });

  const getCurData = data => {
    let dataByPos = curpos > 0 ? R.filter(R.propEq('pos', String(curpos)), data) : data;
    if (fakeInfo.camera > '0') {
      return R.filter(item => item.camera.slice(0, 2) == fakeInfo.camera && item.macro_id == fakeInfo.macro)(dataByPos);
    }
    return dataByPos;
  }

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
    setGutterCode(getGutter(320));
  }, [container.current.offsetWidth])


  return (
    <>
      <Row gutter={16}>
        <Col span={12} >
          <Card style={{ marginBottom: 20 }}
            bodyStyle={{
              padding: '10px 20px',
            }} title="各开位实废分布"
            extra={<div className={styles.container}>
              {curpos > 0 && <div
                className={cx('item')}
                style={{ cursor: 'not-allowed' }}
              >
                第{curpos}开
            </div>}
              <div
                className={cx('item', 'item-active')}
                onClick={() => setCurpos(0)}
                style={{ marginRight: 10, borderColor: '#e56', backgroundColor: '#e56' }}
              >
                显示所有开
              </div>
            </div>}
          >
            <HeatmapChart cart={cart} onFilter={onFilterPos} />
          </Card>
        </Col>
        <Col span={12} >
          <ImageList data={mainFake} blob={3} subTitle={<div>点击图像显示指定区域缺陷</div>} onImageClick={([camera, macro]: [string, string]) => {
            setFakeInfo({ camera, macro });
          }} extra={<div className={styles.container}>
            {fakeInfo.macro > '0' && <div
              className={cx('item')}
              style={{ cursor: 'not-allowed' }}
            >
              宏区{fakeInfo.macro}
            </div>}
            <div
              className={cx('item', 'item-active')}
              onClick={() => setFakeInfo({ camera: '0', macro: '0' })}
              style={{ marginRight: 10, borderColor: '#e56', backgroundColor: '#e56' }}
            >
              所有区域
              </div>
          </div>} />
        </Col>
      </Row>

      <Card >
        <div className={styles.imgsearch}>
          <div className={styles.title}>
            <div className={styles.container} ref={container}>
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
          <ul className={styles.content}>
            {!errCode && <ImageItem
              visible={[0, 3].includes(filter)}
              data={R.filter(onFilter, getCurData(codeList))}
              type="code"
              gutter={gutterCode}
            />}
            <ImageItem
              visible={[0, 2].includes(filter)}
              data={R.filter(onFilter, getCurData(silk))}
              type="silk"
              gutter={gutter}
            />
            <ImageItem
              visible={[0, 1].includes(filter)}
              data={R.filter(onFilter, getCurData(hecha))}
              type="hecha"
              gutter={gutter}
            />
            <ImageItem
              visible={[0, 4].includes(filter)}
              data={getCurData(tubu)}
              type="tubu"
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
