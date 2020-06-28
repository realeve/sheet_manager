import React, { useState, useEffect } from 'react';
import useFetch from '@/components/hooks/useFetch';
import Chart from '@/pages/chart/components/ChartComponent';

export const handleData = (data, cart) => {
  let nodes = [],
    edges = [];
  let nodeObj = {};

  data.forEach(({ cart_num, ream_count, ...item }) => {
    // 是否为当前大万
    let append = cart_num.includes(cart) ? { itemStyle: { color: '#F61D16' } } : {};

    if (cart_num.length == 0) {
      return;
    }

    nodeObj[cart_num] = nodeObj[cart_num]
      ? (nodeObj[cart_num].value += ream_count)
      : { value: ream_count, id: cart_num, category: '车号' };

    edges.push({
      source: cart_num,
      target: cart_num.substr(0, 8),
    });

    if (nodeObj[cart_num.substr(0, 8)]) {
      nodeObj[cart_num.substr(0, 8)].value += ream_count;
    } else {
      nodeObj[cart_num.substr(0, 8)] = {
        value: ream_count,
        id: cart_num.substr(0, 8),
        category: '大万号',
        ...append,
      };
    }

    for (let i = 1; i <= 10; i++) {
      let key = `reel_no${i}`;
      let reel = item[key];
      let reel_count = item[`ream_num${i}`];
      let _append = String(reel).includes(cart) ? { itemStyle: { color: '#F61D16' } } : {};
      if (reel && reel.length > 0) {
        if (nodeObj[reel]) {
          nodeObj[reel].value += reel_count;
        } else {
          nodeObj[reel] = { value: reel_count, id: reel, category: '轴号', ..._append };
        }

        edges.push({
          source: cart_num,
          target: reel,
        });
      }
    }
  });

  Object.entries(nodeObj).forEach(([name, item]) => {
    nodes.push({
      name,
      symbolSize: item.value * 4,
      label: { show: true },
      ...item,
    });
  });

  return {
    color: [
      '#5B8FF9',
      '#5AD8A6',
      '#5D7092',
      '#F6BD16',
      '#E8684A',
      '#6DC8EC',
      '#9270CA',
      '#FF9D4D',
      '#269A99',
      '#FF99C3',
    ],
    legend: {},
    tooltip: {
      show: true,
      formatter(e) {
        if (e.dataType == 'edge') {
          return;
        }

        return `${e.name}: ${e.value} 令`;
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        edgeLabel: {
          show: true,
          position: 'inside',
        },
        draggable: true,
        roam: true,
        label: {
          position: 'right',
        },
        lineStyle: {
          color: 'source',
          curveness: 0.2,
        },
        force: {
          repulsion: 900,
        },
        edges,
        data: nodes,
        categories: [
          {
            name: '车号',
          },
          { name: '轴号' },
          { name: '大万号' },
        ],
      },
    ],
  };
};
export const handleChartData = res => {
  let data = res.data.filter(item => item.cart_num.length > 0);
  let rows = data.length;
  return {
    ...res,
    data,
    rows,
  };
};
export default ({ cart }) => {
  const [option, setOption] = useState({});
  /**
   *   useFetch (React hooks)
   *   @database: { 质量信息系统 }
   *   @desc:     { 装箱产品关联分析查询 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, loading } = useFetch({
    param: {
      url: `/960/f8261a89e2.json`,
      params: { cart },
    },
    valid: () => cart, // params中指定参数存在时才发起请求
    callback: handleChartData,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data.data, cart);
    setOption(handleData(data.data, cart));
  }, [data]);

  console.log(data, option);
  return (
    data &&
    data.rows > 0 && <Chart renderer="svg" option={option} style={{ width: '100%', height: 600 }} />
  );
};
