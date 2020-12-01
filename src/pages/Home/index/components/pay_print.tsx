import React, { useState } from 'react';
import { Card, Button, Radio } from 'antd';
import useFetch from '@/components/hooks/useFetch';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle, chartHeight } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';
import styles from './product_print.less';

const config = {
  完成量: {
    params: {
      type: 'bar',
      simple: CHART_MODE.HIDE_ALL,
      legend: 0,
      x: 1,
      y: 2,
      reverse: '1',
      stack: '1',
    },
    title: '印钞生产计划年度完成数(单位：千尺)',
    beforeRender: e => {
      e.grid = { ...e.grid, left: 50 };
      if (e.legend) {
        e.legend.top = 5;
      }
      return e;
    },
  },
  百分比: {
    title: '印钞生产计划年度完成百分比(单位：%)',
    params: {
      type: 'bar',
      simple: CHART_MODE.HIDE_ALL,
      legend: 0,
      x: 1,
      y: 2,
      reverse: '1',
    },
    beforeRender: e => {
      e.grid = { ...e.grid, left: 50, right: 35, top: 30 };
      if (e.legend) {
        e.legend.top = 5;
      }
      e.series = e.series.map(item => {
        item.label.normal.position = 'right';
        item.label.normal.formatter = e => {
          return e.value + '%';
        };
        return item;
      });
      return e;
    },
  },
};

export default () => {
  const [percent, setPercent] = useState(null);
  const [prod, setProd] = useState('完成量');
  /**
   *   useFetch (React hooks)
   *   @database: { MES系统_生产环境 }
   *   @desc:     { 印钞工序月度完成率 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, error, loading } = useFetch({
    param: {
      url: `/1141/91959bab96.json`,
      params: {
        cache: 1,
      },
    },
    callback(res) {
      if (!res.data) {
        return res;
      }
      let data = [];
      let state = [];
      res.data.reverse().forEach(item => {
        let prod = item['品种'].replace('品', '');
        data.push({
          类型: '已解缴',
          品种: prod,
          value: item['累计解缴'],
          计划数: item['计划数'],
        });

        let notPay = Math.max(0, item['年累计生产量'] - item['累计解缴']);
        data.push({
          类型: '成品库存',
          品种: prod,
          value: notPay,
          计划数: item['计划数'],
        });

        data.push({
          类型: '未完工',
          品种: prod,
          value:
            notPay == 0 && item['年累计生产量'] > 0
              ? 0
              : Math.max(0, item['计划数'] - item['年累计生产量']),
          计划数: item['计划数'],
        });

        state.push({
          类型: '年进度',
          品种: prod,
          value: Math.max(item['年度解缴(%)'], item['年度生产(%)']),
        });

        state.push({
          类型: '解缴进度',
          品种: prod,
          value: item['年度解缴(%)'],
        });
      });

      setPercent({
        ...res,
        data: state,
        header: ['类型', '品种', 'value'],
        rows: data.length,
      });

      return {
        ...res,
        data,
        header: ['类型', '品种', 'value', '计划数'],
        rows: data.length,
      };
    },
  });

  return (
    <Card
      {...cardStyle({
        title: (
          <div>
            {config[prod].title}
            <Button
              type="default"
              size="small"
              style={{ marginLeft: 20, fontSize: 12 }}
              onClick={() => {
                window.open('/table#id=1141/91959bab96&datetype=none&cache=0');
              }}
              title="点击查看详细数据报表"
            >
              详情
            </Button>
          </div>
        ),
        height: chartHeight,
      })}
      loading={loading}
      extra={
        <div className={styles.action}>
          <Radio.Group
            value={prod}
            onChange={e => {
              setProd(e.target.value);
            }}
            buttonStyle="solid"
            size="small"
          >
            {['完成量', '百分比'].map(item => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      }
    >
      <SimpleChart
        data={{ ...(prod === '完成量' ? data : percent), err: error }}
        params={config[prod].params}
        style={{ height: chartHeight - 15, width: '100%' }}
        beforeRender={config[prod].beforeRender}
      />
    </Card>
  );
};
