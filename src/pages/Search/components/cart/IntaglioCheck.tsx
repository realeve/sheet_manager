import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs, Button, Modal, Skeleton, Empty } from 'antd';
import styles from './IntaglioCheck.less';
import { useFetch } from '@/pages/Search/utils/useFetch';
import SimpleList from '../SimpleList';
import * as db from '../../utils/db';
import SimpleChart from '../SimpleChart';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import Err from '@/components/Err';
import * as lib from '@/utils/lib';
import 'animate.css';

const TabPane = Tabs.TabPane;

const ImageTitle = ({ data: { 缺陷等级, 宏区编号, 开位, 机台, 印刷顺序号, 检测时间 }, cart }) => (
  <div>
    <p style={{ marginBottom: 0 }}>
      宏区{宏区编号} / 第{开位}开 / {缺陷等级} / 背面开位:{lib.convertPos(cart, 开位)}开
    </p>
    <p style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between' }}>
      <span>印刷顺序号：{印刷顺序号}</span>
      <span>{机台}</span>
    </p>
    <p style={{ marginBottom: 0 }}>检测时间:{检测时间}</p>
  </div>
);

const IntagImgs = ({ cart }) => {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    db.getViewErrorImage(cart)
      .then(setState)
      .finally(() => {
        setLoading(false);
      });
  }, [cart]);

  return (
    <Tabs defaultActiveKey="胶印">
      {state.map(item => (
        <TabPane tab={item.title} key={item.title}>
          <Skeleton active loading={loading}>
            <ul className={styles.intaglioImg}>
              {item.data.map(subItem => (
                <li key={subItem.id} className="animated zoomIn">
                  <div className={styles.wrap}>
                    <img src={`${subItem.img}`} />
                    {subItem.roi && <div className={styles.border} style={subItem.roi} />}
                  </div>
                  <div className={styles.desc}>
                    <ImageTitle data={subItem} cart={cart} />
                  </div>
                </li>
              ))}
            </ul>
          </Skeleton>
        </TabPane>
      ))}
    </Tabs>
  );
};

const PrintLine = ({ cart }) => {
  const { loading, ...state } = useFetch({ params: cart, api: 'getViewPrintDetail', init: [cart] });
  const params = {
    renderer: 'canvas',
    type: 'line',
    simple: CHART_MODE.SHOW_TITLE,
    legend: 0,
    x: 1,
    y: 2,
    smooth: true,
  };
  const beforeRender = option => {
    return {
      ...option,
      legend: {
        ...option.legend,
        y: 10,
      },
      grid: {
        left: 55,
        right: 35,
        top: 35,
        bottom: 25,
      },
    };
  };

  return state.err ? (
    <Err err={state.err} />
  ) : state.rows === 0 ? null : (
    <SimpleChart
      data={state}
      params={params}
      beforeRender={beforeRender}
      style={{ height: 300, width: '75%' }}
    />
  );
};

export default function IntagCheck({ cart }) {
  let fetchReel = api =>
    useFetch({
      params: cart,
      type: 'cart',
      api,
      init: [cart],
    });

  let res1 = fetchReel('getIntaglioMain');

  const [show, setShow] = useState(false);

  return (
    <Col span={24}>
      <Card hoverable style={{ marginBottom: 10 }} className={styles.intaglio}>
        <Modal
          title={`${cart}凹印在线检测缺陷详情`}
          visible={show}
          footer={null}
          onCancel={() => setShow(false)}
          onOk={() => setShow(false)}
          width={1055}
          bodyStyle={{ padding: '12px 5px' }}
        >
          <IntagImgs cart={cart} />
        </Modal>
        <Tabs defaultActiveKey="intag">
          {res1 && (
            <TabPane tab="凹印在线检测" key="intag">
              <SimpleList data={res1} span={6} />
              {res1?.rows > 0 && (
                <Button
                  type="primary"
                  className={styles.btnDanger}
                  style={{ position: 'absolute', right: 30, top: 30 }}
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  实废图像
                </Button>
              )}
              <PrintLine cart={cart} />
            </TabPane>
          )}
        </Tabs>
      </Card>
    </Col>
  );
}
