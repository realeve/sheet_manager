import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import SimpleChart from '../SimpleChart';
import SimpleTable from '../SimpleTable';
import { Col, Row, Card } from 'antd';
import * as R from 'ramda';
import styles from './ProdList.less';
import * as lib from '@/pages/Search/utils/lib';
const { Meta } = Card;

export default function CodeInfo({ cart }) {
  // 载入状态
  const [loading, setLoading] = useState(false);

  // 码后检测
  const [state, setState] = useState({ data: [], header: [], rows: 0 });
  const [errDetail, setErrDetail] = useState({ data: [], header: [], rows: 0 });
  const [macInfo, setMacInfo] = useState([]);
  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    let src = await db.getMahoudataLog(cart);
    let errDetail = { header: [], data: [], rows: 9 };
    let res = { header: [], data: [], rows: 1 };
    let hechaId = 0;
    let macDetail = [];
    if (src.rows) {
      let srcData = src.data[0];
      hechaId = srcData.id;

      errDetail.header = ['client', 'err'];
      errDetail.data = R.map(key => ({ client: key, err: Number(srcData[key]) }))(
        src.header.slice(-9)
      );

      // 宏区信息
      macDetail = R.range(1, 4).map(idx => ({
        mac: srcData['宏区' + idx],
        position: srcData['开位' + idx],
        count: srcData['报错条数' + idx],
        status: srcData['判废结果' + idx],
      }));

      res.header = R.slice(3, 16)(src.header);
      res.data[0] = R.props(res.header)(srcData);
      res.data[0][0] = Number(res.data[0][0]).toFixed(2);
    }
    setMacInfo(macDetail);
    setHechaId(hechaId);
    setErrDetail({ ...src, ...errDetail });
    setState(res);
    setLoading(false);
  };

  const [hechaId, setHechaId] = useState(0);
  const [fakeImg, setFakeImg] = useState([]);
  useEffect(() => {
    getFakeImg();
  }, [hechaId]);

  const getFakeImg = async () => {
    if (!hechaId) {
      return;
    }
    let { data } = await db.getImagedata(hechaId);
    data = Object.values(data[0]).map(item => `data:image/jpg;base64,${item}`);
    setFakeImg(data);
  };

  // 图核判废
  const [errCount, setErrCount] = useState({ data: [], header: [], rows: 0 });
  const getImgCheck = async () => {
    let res = await db.getViewPrintHechaImageCheck(cart);
    setErrCount(res);
  };
  useEffect(() => {
    getImgCheck();
  }, [cart]);

  const params = {
    type: 'bar',
    simple: '2',
    barwidth: 20,
  };
  const beforeRender = option => {
    if (option.series.length) {
      option.series[0].label.normal.position = 'top';
      option.yAxis.show = false;
      option.grid.left = 0;
    }
    return option;
  };

  return (
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
      loading={loading}
    >
      <div className={styles.title}>
        <span className={styles.text}>1.码后机检</span>
      </div>
      <SimpleTable data={state} />
      <Row gutter={20}>
        <Col span={12} md={12} lg={16}>
          <Row gutter={10} className={styles.card}>
            {fakeImg.map((url, idx) => (
              <Col span={8} key={String(hechaId) + '_' + idx}>
                <Card
                  hoverable
                  bodyStyle={{
                    padding: 0,
                    overflow: 'hidden',
                  }}
                  style={{ width: 180 }}
                  cover={<img alt="缺陷图像" src={url} />}
                >
                  <Meta
                    title={`宏区编号 ${macInfo[idx].mac} / 第 ${macInfo[idx].position} 开`}
                    description={`${macInfo[idx].count}条(${lib.getFakeStatus(
                      macInfo[idx].status
                    )})`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={12} md={12} lg={8}>
          <Card
            bordered={false}
            bodyStyle={{
              padding: 0,
            }}
          >
            <SimpleChart
              data={errDetail}
              params={params}
              beforeRender={beforeRender}
              style={{ height: 150 }}
            />
          </Card>
        </Col>
      </Row>
      <div className={styles.title}>
        <span className={styles.text}>2.图核判废</span>
      </div>
      <SimpleTable data={errCount} />
    </Card>
  );
}
