import React from 'react';
import { Col, Card } from 'antd';
import SimpleTable from '../SimpleTable';
import styles from '../cart/ProdList.less';
import { Scrollbars } from 'react-custom-scrollbars';
import SimpleChart from '@/pages/Search/components/SimpleChart';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import useFetch from '@/components/hooks/useFetch';

import ComponentPage from '@/pages/Search/components/ComponentPage';

export default function MachineCheck({ reel }) {
  const res = useFetch({
    param: {
      url: `/1178/a54df3f428.json`,
      params: {
        reel: ['A', 'B', 'C'].includes(reel[reel.length - 1]) ? reel : reel + '%',
      },
    },
    callback(res) {
      res.data = res.data.map(item => {
        item['好品率'] = Number(item['好品率']);
        return item;
      });
      return res;
    },
  });

  const res2 = useFetch({
    param: {
      url: `/1177/451dd98d51.json`,
      params: {
        prefix: reel,
      },
    },
  });

  return (
    <>
      <Col span={12}>
        <Card
          title={
            <div>
              机检质量统计<small>(滚动鼠标查看全部数据)</small>
            </div>
          }
          bodyStyle={{
            padding: '10px 20px',
          }}
          hoverable
          style={{ marginBottom: 10 }}
          className={styles.cart}
        >
          <ComponentPage data={res}>
            <Scrollbars
              autoHide
              style={{
                height: 300,
                marginTop: 20,
              }}
            >
              <SimpleTable data={res.data} loading={res.loading} />
            </Scrollbars>
          </ComponentPage>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title={`安全线缺陷对比分析`}
          bodyStyle={{
            padding: '10px 20px',
          }}
          hoverable
          style={{ marginBottom: 10 }}
          className={styles.cart}
          loading={res2.loading}
        >
          <ComponentPage data={res2}>
            <SimpleChart
              data={res2.data}
              params={{ type: 'bar', simple: CHART_MODE.HIDE_ALL }}
              style={{ height: 300, marginTop: 20 }}
            />
          </ComponentPage>
        </Card>
      </Col>
    </>
  );
}
