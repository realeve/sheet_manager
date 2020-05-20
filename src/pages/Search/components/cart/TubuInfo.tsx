import React, { useState, useEffect } from 'react';
import * as db from '../../utils/db';
import SimpleChart from '../SimpleChart';
import SimpleTable from '../SimpleTable';
import { Col, Row, Card, Empty } from 'antd';
import * as R from 'ramda';
import Err from '@/components/Err';
import { CHART_MODE } from '@/pages/chart/utils/lib';

export default function CodeInfo({ cart }) {
  // 载入状态
  const [loading, setLoading] = useState(false);

  // 码后检测
  const [state, setState] = useState({ data: [], header: [], rows: 0 });
  const [errDetail, setErrDetail] = useState({ data: [], header: [], rows: 0 });

  const [err, setErr] = useState(false);

  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    let src = await db.getViewPrintTubu(cart).catch(e => {
      setErr(e);
      return { rows: 0 };
    });
    let errDetail = { header: [], data: [], rows: 0 };
    let res = { header: [], data: [], rows: 0 };

    if (src.rows) {
      let srcData = src.data[0];
      errDetail.rows = 19;
      errDetail.header = ['client', '缺陷条数'];
      errDetail.data = R.map(key => ({ client: key, 缺陷条数: Number(srcData[key]) }))(
        src.header.slice(-19)
      );

      res.rows = 1;
      res.header = R.slice(0, 28)(src.header);
      res.data[0] = R.props(res.header)(srcData);
    }

    setErrDetail({ ...src, ...errDetail });
    setState(res);
    setLoading(false);
  };

  const params = {
    type: 'bar',
    simple: CHART_MODE.HIDE_ALL,
    barwidth: 20,
  };
  const beforeRender = option => {
    if (option.series && option.series.length) {
      option.series[0].label.normal.position = 'top';
      option.yAxis.show = false;
      option.grid.left = 0;
    }
    return { ...option, color: ['#e74c3c'] };
  };

  return err ? (
    <Err err={err} />
  ) : state.rows === 0 ? (
    <Empty />
  ) : (
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
      loading={loading}
    >
      <SimpleTable data={state} />
      <Row>
        <Col span={24} md={24} lg={24}>
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
    </Card>
  );
}
