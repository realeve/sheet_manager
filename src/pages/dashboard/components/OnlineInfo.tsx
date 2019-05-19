import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Card, Empty } from 'antd';
import styles from './OnlineInfo.less';
import ProdList from '@/pages/Search/components/cart/ProdList';
import SimpleChart from '@/pages/Search/components/SimpleChart';
import SimpleTable from '@/pages/Search/components/SimpleTable';
import { useFetch } from '../utils/useFetch';
import Err from '@/components/Err';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function OnlineInfo({ res: item, visible, onOk }) {
  const params = { type: 'line', simple: '2', x: 0, y: 1, smooth: true };
  const cart = item.cart_number;
  const { loading, ...mahouData } = useFetch({ params: cart, api: 'getOnlineinfo', init: [cart] });
  const { loading2, ...res } = useFetch({
    params: cart,
    api: 'getOnlineinfoByMachine',
    init: [cart],
  });
  // visible={visible} width="1200px" onOk={onOk} onCancel={onOk} bodyStyle={{ padding: 10 }}
  return (
    <Card style={{ marginTop: 20 }} bodyStyle={{ margin: 0, padding: 0 }} bordered={false}>
      <Card
        title={<p><span style={{ color: '#e23' }}>{item.machine_name}</span> 实时质量信息</p>}
        bodyStyle={{ padding: 10 }}
        style={{ marginBottom: 10 }}
        hoverable
      >
        <div className={styles.dashboard}>
          <ul className={styles.content}>
            <li>
              <div className={styles.mask}>
                <div className={styles.wrap}>
                  {item.image_1.length > 30 && <img src={item.image_1} alt={item.machine_name} />}
                  <div className={styles.block}>
                    第{item.k_info_1}开/{item.fake_num_1}条
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className={styles.mask}>
                <div className={styles.wrap}>
                  {item.image_2.length > 30 && <img src={item.image_2} alt={item.machine_name} />}
                  <div className={styles.block}>
                    第{item.k_info_2}开/{item.fake_num_2}条
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className={styles.mask}>
                <div className={styles.wrap}>
                  {item.image_3.length > 30 && <img src={item.image_3} alt={item.machine_name} />}
                  <div className={styles.block}>
                    第{item.k_info_3}开/{item.fake_info_3}条
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div className={styles.number} style={{ marginLeft: 20 }}>
            <p
              className={cx(
                {
                  well: item.good_rate >= 90,
                  poor: item.good_rate < 80,
                },
                styles.num
              )}
            >
              {Number(item.good_rate)}
            </p>
            <span>车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号: {item.cart_number}</span>
            <span>最近更新: {item.update_time.split(' ')[1]}</span>
            <span>印刷张数: {item.print_num}</span>
            <span>缺陷条数: {item.fake_num}</span>
          </div>
          <div className={styles.number}>
            <span>票面条数: {item.pm_num}</span>
            <span>号码条数: {item.code_num}</span>
            <span>荧光条数: {item.yg_num}</span>
            <span>透视条数: {item.ts_num}</span>
            <span>未检张数: {item.no_check}</span>
            <span>大张废数: {item.piece_fake}</span>
          </div>
          <div className={styles.number}>
            <span>
              票面站数据库: {(Number(item.vs_db.replace('MB', '')) / 1000).toFixed(1)}GB
            </span>
            <span>
              D盘空间(GB): {Number(item.disk_free_d)}/{Number(item.disl_vol_d)}
            </span>
            <span>上传车号: {item.upload_cart_num}</span>
            <span>完工车号: {item.print_cart_num}</span>
          </div>
        </div>
      </Card>

      <Row gutter={10}>
        <Col span={14}>
          <ProdList cart={item.cart_number} type="cart" />
        </Col>
        <Col span={10}>
          <Card
            title={mahouData.title}
            bodyStyle={{
              padding: '10px 20px',
            }}
            hoverable
            style={{ marginBottom: 10 }}
            loading={loading}
          >
            {mahouData.err ? (
              <Err err={mahouData.err} />
            ) : mahouData.rows === 0 ? (
              <Empty />
            ) : (
                  <SimpleChart data={mahouData} params={params} style={{ height: 180 }} />
                )}
          </Card>

          <Card
            title={res.title}
            bodyStyle={{
              padding: '10px 20px',
              // maxHeight: 300,
              overflowY: 'auto',
            }}
            hoverable
            style={{ marginBottom: 10 }}
            className={styles.cart}
            loading={loading2}
          >
            {res.err ? (
              <Err err={res.err} />
            ) : res.rows === 0 ? (
              <Empty />
            ) : (
                  <div>
                    <SimpleTable data={{ ...res, data: res.data2, header: res.header2 }} />
                    <SimpleChart data={res} params={{ type: 'line', simple: '2', x: 1, y: 2, smooth: true }} style={{ height: 180, marginTop: 20 }} />
                  </div>
                )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
