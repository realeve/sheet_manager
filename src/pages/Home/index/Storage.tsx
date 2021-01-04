import React, { useState, useEffect } from 'react';

import { Card, Radio } from 'antd';
import styles from './components/product_print.less';
import useFetch from '@/components/hooks/useFetch';
import * as R from 'ramda';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle } from '../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

import { useSetState } from 'react-use';
import classnames from 'classnames';

let chartHeight = 700;

const cardProp = cardStyle({
  title: <div>立体库货位使用情况</div>,
  height: chartHeight,
});

const getItemColor = (proc = '9607T') => {
  let procs = [
    '钞票纸',
    '白纸',
    '胶一印完成品',
    '胶二印完成品',
    '丝印完成品',
    '凹一印完成品',
    '凹二印完成品',
    '印码完成品',
    '涂布完成品',
  ];
  let color = [];
  switch (proc) {
    case '9607T':
      color = [
        '#DDD',
        '#FAFAFA',
        '#f7bfc6',
        null, // '#f4adb5',
        '#e6a13c',
        '#ffa2b6',
        '#f36983',
        '#df536e',
        // '#c1465e',
      ];
      break;
    case '9606T':
      color = [
        '#DDD',
        '#FAFAFA',
        '#A3F6A9',
        null, // '#A3F6A9',
        null, // '#6CA963',
        '#93D699',
        '#43BF49',
        '#239F29',
        '#035F09',
      ];
      break;
    case '9604T':
      color = [
        '#DDD',
        '#FAFAFA',
        '#bbcddb',
        null, //  '#acc8e0',
        null, // '#6C63A9',
        '#6a90b7',
        '#526f99',
        '#4e628e',
        '#0e2b67',
      ];
      break;
    case '9603T':
    case '9603A':
      color = [
        '#DDD',
        '#FAFAFA',
        '#F3A9F6',
        '#F3A9F6',
        null, // '#AC63A9',
        '#D399D6',
        '#B349BF',
        '#93299F',
        '#53095F',
      ];
      break;
    case '9602T':
    case '9602A':
      color = [
        '#DDD',
        '#FAFAFA',
        '#c8d0c1',
        '#b9c7ae',
        null, // '#6CA963',
        '#6e7b69',
        null, // '#6e7b69',
        '#404e3f',
        '#343e32',
      ];
      break;
    case 'NRB10':
      color = [
        '#DDD',
        '#FAFAFA',
        '#70ad72',
        '#70ad72',
        null, // '#AC63A9',
        '#c69488',
        '#8b6850',
        '#765843',
        '#5f4736',
      ];
      break;
  }

  let selected = {};
  let itemColor = {};
  procs.forEach((key, i) => {
    itemColor[key] = color[i];
    selected[key] = true;
  });
  return { itemColor, procs, selected, color };
};
// 10 72,18
// 三维开包量分布展示
export const getFeakOption = (data, proc, selected) => {
  let maxX = 10,
    maxZ = 18,
    maxY = 72;

  let selectedProcs = Object.keys(selected).filter(item => selected[item]);

  let { itemColor } = getItemColor(proc);

  function generateData(kilo) {
    let dataItem = [];
    for (let i = 1; i <= maxX; i++) {
      for (let j = 1; j <= maxY; j++) {
        let item = data.find(
          item =>
            item.排 == i && item.列 == j && kilo == item.层 && selectedProcs.includes(item.工序)
        );
        // console.log(item,kilo,i,j)
        dataItem.push({
          value: [
            j,
            i,
            1,
            item
              ? {
                  车号: item.车号,
                  品种: item.品种,
                  工序: item.工序,
                  工艺: item.工艺,
                  巷道: item.巷道,
                  列: item.列,
                  层: item.层,
                }
              : {},
          ],
          itemStyle: {
            opacity: item?.车号 ? 1 : 0,
            color: item ? itemColor[item.工序] : 'rgba(0,0,0,0)',
          },
        });
      }
    }
    return dataItem;
  }

  let series = [];
  for (let i = maxZ; i >= 0; i--) {
    series.push({
      // name: `第${i}层`,
      type: 'bar3D',
      data: generateData(maxZ - i),
      stack: 'stack',
      shading: 'realistic',
    });
  }

  let axisSetting = {
    axisLine: {
      lineStyle: {
        color: '#999',
        width: 2,
      },
    },
    nameTextStyle: {
      fontSize: 16,
      color: '#444',
    },
    splitLine: {
      show: true,
    },
    splitArea: {
      show: false,
    },
  };

  let option = {
    // title: {
    //   left: 'left',
    //   text: `每个方块代表5000张产品\n(滑动鼠标缩放)`,
    //   textStyle: {
    //     fontSize: 16,
    //   },
    // },
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'item',
      formatter({ value: [x, y, z, res], seriesIndex: kilo }) {
        return `<div>车号:${res.车号}<br/>
        品种：${res.品种}<br/>
        工艺：${res.工艺}<br/>
        工序：${res.工序}<br/>
        巷道：${res.巷道}<br/>
        列  ：${res.列}<br/>
        层  ：${res.层}<br/>
        数量：5000</div>`;
      },
    },
    yAxis3D: {
      type: 'value',
      ...axisSetting,
      min: 1,
      max: maxX,
      boundaryGap: true,
      axisLabel: {
        textStyle: {
          color: '#222',
        },
      },
      name: '排',
    },
    xAxis3D: {
      name: '列',
      type: 'value',
      ...axisSetting,
      min: 1,
      max: maxY,
      boundaryGap: true,
      axisLabel: {
        textStyle: {
          color: '#222',
        },
      },
    },
    zAxis3D: {
      name: '层',
      type: 'value',
      ...axisSetting,
      axisLabel: {
        textStyle: {
          color: '#222',
        },
        show: false,
      },
      max: maxZ,
      min: 1,
      interval: 1,
      boundaryGap: false,
    },
    grid3D: {
      boxDepth: maxX * 6,
      boxWidth: maxY * 1.5,
      boxHeight: maxZ * 2,
      viewControl: {
        // autoRotate: true,
        autoRotateSpeed: 2,
      },
      light: {
        main: {
          shadow: true,
          quality: 'ultra',
          intensity: 0.9,
        },
      },

      // light: {
      //   main: {
      //     shadow: true,
      //     quality: 'ultra',
      //     intensity: 1.2,
      //   },
      //   ambient: {
      //     intensity: 0.2,
      //   },
      //   ambientCubemap: {
      //     // texture: './lake.hdr',
      //     exposure: 1,
      //     diffuseIntensity: 0.5,
      //     specularIntensity: 2,
      //   },
      // },
      // postEffect: {
      //   enable: true,
      //   SSAO: {
      //     enable: true,
      //     radius: 2,
      //     intensity: 1,
      //     quality: 'high',
      //   },
      // },
      // temporalSuperSampling: {
      //   enable: true,
      // },
    },
    series,
  };
  return option;
};

export default () => {
  const [state, setState] = useState(null);
  const [prod, setProd] = useState('');
  const [prodList, setProdList] = useState([]);

  const { data, error, loading } = useFetch({
    param: {
      url: `1167/1252ddb336.json`,
    },
    callback(res) {
      let data = R.filter(res => res['品种'] != null && !res['品种'].includes('辅料-'))(res.data);
      let prods = chartLib.getUniqByIdx({
        key: '品种',
        data: data,
      });

      setProdList(prods);
      setProd(prods[0]);
      return res;
    },
  });

  // 颜色表
  const [colorMap, setColorMap] = useState({});

  // 选中工序
  const [selected, setSelected] = useSetState({});

  const [prodData, setProdData] = useState([]);

  useEffect(() => {
    if (prod?.length == 0 || !data) {
      return;
    }
    let res = R.clone(data);
    res.data = res.data.filter(item => item['品种'] == prod);
    res.hash += prod;
    setState(res);

    let colors = getItemColor(prod);
    setColorMap(colors.itemColor);
    setSelected(colors.selected);
    setProdData(data.data.filter(item => item.品种 == prod));
  }, [prod, data?.hash]);

  return (
    <Card
      {...cardProp}
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
      <div className={styles.wrapper}>
        <ul className={styles.colors}>
          {Object.keys(colorMap).map(
            item =>
              colorMap[item] && (
                <li
                  key={item}
                  style={{ background: selected[item] ? colorMap[item] : '#eee' }}
                  onClick={() => {
                    setSelected({
                      [item]: !selected[item],
                    });
                  }}
                  className={classnames({ [styles.active]: selected[item] })}
                >
                  {item.replace('完成品', '')}
                  <br />
                  {prodData.filter(res => res.工序 == item).length / 2}万
                </li>
              )
          )}
        </ul>
      </div>
      <SimpleChart
        data={{ ...state, err: error }}
        params={{
          type: 'scatter3d',
          smooth: true,
          simple: CHART_MODE.HIDE_ALL,
          x: 4,
          y: 5,
          z: 6,
          renderer: 'canvas',
        }}
        style={{ height: chartHeight - 100, width: '100%' }}
        option={data ? getFeakOption(prodData, prod, selected) : {}}
      />
    </Card>
  );
};
