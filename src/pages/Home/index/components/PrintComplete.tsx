import React, { useState, useEffect } from 'react';

import { Card, Button, Radio } from 'antd';
import styles from './product_print.less';
import useFetch from '@/components/hooks/useFetch';
import * as R from 'ramda';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle, chartHeight } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

const keyName = '品种';

export default () => {
  const [state, setState] = useState(null);
  const [prod, setProd] = useState('');
  const [prodList, setProdList] = useState([]);

  /**
   *   useFetch (React hooks)
   *   @database: { MES系统_生产环境 }
   *   @desc:     { 印钞工序月度完成率 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, error, loading } = useFetch({
    param: {
      url: '/1175/a7d69ce75c.json',
    },
    callback(res) {
      if (!res.data) {
        return res;
      }
      res.data = res.data
        .filter(item => item['工序'] != '白纸')
        .map(item => {
          item['品种'] = item['品种'].replace('品', '');
          return item;
        });
      let prods = chartLib.getUniqByIdx({
        key: keyName,
        data: res.data,
      });
      setProdList(prods);
      setProd(prods[0]);
      return res;
    },
  });

  useEffect(() => {
    if (prod?.length == 0 || !data) {
      return;
    }
    let res = R.clone(data);
    let nextData = res.data.filter(item => item[keyName] == prod);
    let firstLine = nextData[0];

    nextData.push({
      ...firstLine,
      工序: '年度计划',
      累计产量: firstLine?.计划量 || 0,
    });

    res.data = nextData;
    res.hash += prod;
    setState(res);
  }, [prod, data?.hash]);

  return (
    <Card
      {...cardStyle({
        title: (
          <div>
            各工序年度完成情况(单位：大万)
            <Button
              type="default"
              size="small"
              style={{ marginLeft: 20, fontSize: 12 }}
              onClick={() => {
                window.open('/table#id=1175/a7d69ce75c&datetype=none');
              }}
              title="点击查看详细数据报表"
            >
              详情
            </Button>
          </div>
        ),
        height: chartHeight + 62,
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
            {prodList.map(item => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      }
    >
      {!loading && data && (
        <SimpleChart
          data={{ ...state, err: error }}
          params={{
            type: 'bar',
            simple: CHART_MODE.HIDE_ALL,
            x: 1,
            y: 2,
            barWidth: 40,
            reverse: true,
          }}
          style={{ height: chartHeight + 62 - 15, width: '100%' }}
          beforeRender={e => {
            let series = R.head(e.series);
            if (!series) {
              return e;
            }
            let plan = state.data[0];
            series.label.normal.position = 'insideRight';
            e.yAxis.data = e.yAxis.data.reverse();

            // 最后一项隐藏显示
            series.data = series.data
              .map((item, idx) => {
                if (idx < series.data.length - 1) {
                  return item;
                }
                return {
                  value: item,
                  itemStyle: {
                    color: '#2FC25B',
                    // opacity: 0,
                  },
                };
              })
              .reverse();
            const needPrint = (((plan.计划量 - plan.铺底量) * plan.时间进度) / 100).toFixed(0);

            let formatter = param => {
              let idx = param[0].dataIndex;
              let res = state.data[state.data.length - 1 - idx];
              let percent = res.计划完成比;

              return e.tooltip.formatter(
                [
                  {
                    ...param[0],
                    percent:
                      `万张 <br/>完工比例:${percent}%<br/>` +
                      (percent >= plan.时间进度
                        ? ''
                        : `比时间进度延误：${plan.时间进度 - percent}%,约${Number(needPrint) -
                            res.累计产量}万`),
                  },
                ],
                '大万'
              );
            };
            if (plan.计划量 && plan.铺底量) {
              series.markLine = {
                data: [
                  {
                    xAxis: plan.计划量,
                    label: {
                      formatter(a) {
                        return (
                          '年度计划\n' +
                          plan.计划量 +
                          '万' +
                          (plan.铺底量 > 0 ? `\n(含上年结存:${plan.铺底量}万)` : '')
                        );
                      },
                    },
                    lineStyle: { normal: { type: 'dashed', color: '#e23' } },
                  },
                  {
                    xAxis: ((plan.计划量 - plan.铺底量) * plan.时间进度) / 100,
                    label: {
                      formatter(a) {
                        return '全年时间进度\n' + plan.时间进度 + '%\n应完工量:' + needPrint + '万';
                      },
                    },
                    lineStyle: { normal: { type: 'dashed', color: '#e23' } },
                  },
                ],
                symbolSize: 0,
              };
            }

            return {
              ...e,
              grid: {
                ...e.grid,
                left: 90,
                right: 50,
                top: 45,
              },
              series: [series],
              tooltip: {
                ...e.tooltip,
                formatter,
              },
            };
          }}
        />
      )}
    </Card>
  );
};
