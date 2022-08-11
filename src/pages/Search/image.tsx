import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Tooltip, Tabs, Switch } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './Image.less';
import { useFetch } from './utils/useFetch';
import ImageItem from './components/ImageItem';
import FakeImageItem from './components/FakeImageItem';
import classNames from 'classnames/bind';
import * as R from 'ramda';
import HeatmapChart from './HeatmapChart';
import ImageList from '@/pages/table/components/ImagePage';
import { useSetState } from 'react-use';

import OpennumCart from './OpennumChart';

const cx = classNames.bind(styles);

const TabPane = Tabs.TabPane;

function ImageSearch({ cart }) {
  const [code, setCode] = useState(null);
  const [filter, setFilter] = useState(0);
  const res = useFetch({ params: cart, api: 'getQfmWipJobsHechaImage', init: [cart] });
  const { data: silk, hash: silkHash } = useFetch({
    params: cart,
    api: 'getWipJobsSilkImage',
    init: [cart],
  });
  const { data: codeList, err: errCode, hash: codeHash } = useFetch({
    params: cart,
    api: 'getWipJobsCodeImage',
    init: [cart],
  });

  let hecha = R.filter(R.propEq('type', 'mahou'))(res.data);

  let tubu = R.filter(R.propEq('type', 'tubu'))(res.data);

  const mainFake = useFetch({ params: cart, api: 'getQfmWipJobsMain', init: [cart] });

  let imgnum = [
    res.rows + silk.length + (codeList ? codeList.length : 0),
    hecha.length,
    silk.length,
    codeList.length,
    tubu.length,
  ];

  const onChange = e => {
    let code = e.target.value.trim().toUpperCase();
    setCode(code);
  };

  let [curpos, setCurpos] = useState(0);

  const onFilterPos = pos => {
    setCurpos(pos);
  };

  // 添加涂布
  let checkList = ['所有图像', '票面', '丝印', '号码', '涂布'];

  const onFilter = item => R.isNil(code) || item.code.includes(code);

  let [fakeInfo, setFakeInfo] = useSetState({ camera: '0', macro: '0' });

  const getCurData = data => {
    let dataByPos = curpos > 0 ? R.filter(R.propEq('pos', curpos), data) : data;

    if (fakeInfo.camera > '0') {
      dataByPos = R.filter(
        item =>
          String(item.camera).slice(0, 2) == fakeInfo.camera && item.macro_id == fakeInfo.macro
      )(dataByPos);
    }
    return R.filter(onFilter, dataByPos);
  };

  let container = useRef({ current: { offsetWidth: 0 } });
  let [gutter, setGutter] = useState(5);
  let [gutterCode, setGutterCode] = useState(5);
  // 自动调整间隙占满容器

  let getGutter = (width, maxWidth) => {
    let imgNum = Math.floor(maxWidth / width);
    let gutterNum = maxWidth % width;
    let curGutter = Math.floor(gutterNum / imgNum);
    return curGutter;
  };

  useEffect(() => {
    if (container.current.offsetWidth === 0) {
      return;
    }
    let maxWidth = container.current.offsetWidth - 16;
    setGutter(getGutter(180, maxWidth));
    setGutterCode(getGutter(320, maxWidth));
  }, [container.current.offsetWidth]);

  const [imgs, setImgs] = useState([]);

  useEffect(() => {
    let list = [];
    switch (filter) {
      case 0:
        if (!res.hash) {
          list = R.concat(silk || [], codeList || []);
        } else {
          list = R.concat(R.concat(res.data, silk || []), codeList || []);
        }
        break;
      case 1:
        if (res.hash) {
          list = hecha;
        }
        break;
      case 2:
        list = silk || [];
        break;
      case 3:
        list = codeList || [];
        break;
      case 4:
        list = tubu || [];
        break;
    }
    setImgs(getCurData(list));
  }, [filter, res.hash, codeHash, silkHash, code, curpos, fakeInfo]);

  const [showKilo, setShowKilo] = useState(false);

  // 目前暂时只处理4T品
  useEffect(() => {
    setShowKilo(!['45', '75'].includes(cart.slice(2, 4)));
  }, [cart]);

  return (
    <>
      <Row gutter={16}>
        <Col span={14}>
          <Tabs defaultActiveKey="1" animated={false} style={{ background: '#fff' }}>
            <TabPane tab="实废分布" key="1">
              <Card
                style={{ marginBottom: 20 }}
                bodyStyle={{
                  padding: '10px 20px',
                  height: 500,
                }}
                title="各开位实废分布"
                bordered={false}
                extra={
                  <div className={styles.container}>
                    {curpos > 0 && (
                      <div className={cx('item')} style={{ cursor: 'not-allowed' }}>
                        第{curpos}开
                      </div>
                    )}
                    <div
                      className={cx('item', 'item-active')}
                      onClick={() => setCurpos(0)}
                      style={{ marginRight: 10, borderColor: '#e56', backgroundColor: '#e56' }}
                    >
                      显示所有开
                    </div>
                  </div>
                }
              >
                <HeatmapChart cart={cart} onFilter={onFilterPos} />
              </Card>
            </TabPane>
            <TabPane tab="开包量分布" key="2">
              <OpennumCart cart={cart} />
            </TabPane>
          </Tabs>
        </Col>
        <Col span={10}>
          <ImageList
            data={mainFake}
            blob={3}
            subTitle={<div>点击图像显示指定区域缺陷</div>}
            onImageClick={([camera, macro]: [string, string]) => {
              if (['45', '75'].includes(cart.slice(2, 4))) {
                return;
              }
              setFakeInfo({ camera, macro });
            }}
            extra={
              <div className={styles.container}>
                {fakeInfo.macro > '0' && (
                  <div className={cx('item')} style={{ cursor: 'not-allowed' }}>
                    宏区{fakeInfo.macro}
                  </div>
                )}
                <div
                  className={cx('item', 'item-active')}
                  onClick={() => setFakeInfo({ camera: '0', macro: '0' })}
                  style={{ marginRight: 10, borderColor: '#e56', backgroundColor: '#e56' }}
                >
                  所有区域
                </div>
              </div>
            }
          />
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <div className={styles.imgsearch}>
          <div className={styles.title}>
            <div className={styles.container} ref={container}>
              <div>
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
                <div
                  className={cx({ item: true })}
                  style={{ marginLeft: 20, color: '#333', border: 'none' }}
                >
                  <span>
                    <Tooltip title="截止2022年5月，已将9604T品2020年以来生产所有产品标记缺陷类型。后续陆续将7T品以及2022年以前的4T标注。">
                      <QuestionCircleOutlined /> 显示方式：
                    </Tooltip>
                  </span>
                  <Switch
                    checked={showKilo}
                    onChange={setShowKilo}
                    checkedChildren="千位"
                    unCheckedChildren="类型"
                  />
                </div>
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
          </div>
          {showKilo ? (
            <ImageItem visible data={imgs} type="tubu" gutter={gutter} />
          ) : (
            <FakeImageItem visible data={imgs} type="tubu" gutter={gutter} />
          )}
        </div>
      </Card>
    </>
  );
}

export default connect(({ search: { cart } }) => ({
  cart,
}))(ImageSearch);
