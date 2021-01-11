export const getFakeStatus: (s: string) => string = status => {
  let str: string = '';
  switch (Number(status)) {
    case 0:
      str = '未判废';
      break;
    case 1:
      str = '误废';
      break;
    case 2:
      str = '二次误废';
      break;
    case 3:
      str = '人工实废';
      break;
    case 7:
      str = '二次疑似废';
      break;
    case 8:
      str = '锁定实废';
      break;
    default:
      str = '未知';
      break;
  }
  return str;
};

/**
 * 根据车号返回对应品种单张小开数
 * @param carts:string 车号
 * @return number:最大开数
 */
export const getMaxPapersByCarts: (carts: string) => number = carts => {
  let prodid: string = carts[2];
  if ([0, 4, 5, 6, 7, 8].includes(Number(prodid))) {
    return 35;
  }
  return 40;
};

/**
 *
 * @param param0 col:列,row:行,cart:车号
 * @return 对应小开数
 */
export interface PositionCfg {
  col: number;
  row: number;
  maxPaper: number;
}

export const getPosByRowAndCol: (param: PositionCfg) => number = ({ col, row, maxPaper }) => {
  let maxCol: number = 5;
  let maxRow: number = maxPaper === 40 ? 8 : 7;

  let curCol = maxCol - col - 1;
  let curRow = maxRow - row;
  return curCol * maxRow + curRow;
};

export const convertCodeInfo: (code: string) => string = code => {
  if (code.length === 0) {
    return '';
  }
  let num: string = code.match(/(\d+)/g).join('');
  let alpha: string = code
    .match(/([A-Z])(|\d)+(|[A-Z])+/g)
    .join('')
    .replace(/\d/g, '*');

  return alpha + num;
};

// 三维开包量分布展示
export const getFeakOption = (res, prodName = '9607T') => {
  let maxRow = prodName.includes('9602') || prodName.includes('9603') ? 8 : 7;

  function generateData(kilo) {
    let data = [];
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= maxRow; j++) {
        let item = res.data.find(item => item.col == i && item.row == j && kilo == item.kilo);
        data.push({
          value: [
            i,
            j,
            1,
            (item && item.err_num) || 0,
            (item && item.format_pos) || (5 - i) * maxRow + (maxRow - j) + 1,
          ],
          itemStyle: {
            opacity: item ? 1 : 0, //.07
          },
        });
      }
    }
    return data;
  }

  let series = [];
  for (let i = 9; i >= 0; i--) {
    series.push({
      name: '千位' + i,
      type: 'bar3D',
      data: generateData(i),
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
    title: {
      left: 'left',
      text: `每个方块代表一包产品(合计:${res.rows})\n(滑动鼠标缩放)`,
      textStyle: {
        fontSize: 16,
      },
    },
    backgroundColor: '#fff',
    color: [
      '#737EE6',
      '#1890FF',
      '#73C9E6',
      '#13C2C2',
      '#6CD9B3',
      '#2FC25B',
      '#9DD96C',
      '#FACC14',
      '#E6965C',
      '#d73027',
    ],
    tooltip: {
      trigger: 'item',
      formatter({ value: [x, y, z, err, format_pos], seriesIndex: kilo }) {
        return `开位:${format_pos}<br/>票面实废:${err}条<br/>千位:${9 - kilo}`;
      },
    },
    legend: {
      orient: 'vertical',
      right: 30,
      bottom: 30,
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => '千位' + item),
    },
    xAxis3D: {
      type: 'value',
      ...axisSetting,
      min: 1,
      boundaryGap: true,
      axisLabel: {
        formatter(a) {
          return 6 - a;
        },
        textStyle: {
          color: '#222',
        },
      },
      name: '列',
    },
    yAxis3D: {
      name: '行',
      type: 'value',
      ...axisSetting,
      min: 1,
      boundaryGap: true,
      axisLabel: {
        formatter(a) {
          return maxRow - a + 1;
        },
        textStyle: {
          color: '#222',
        },
      },
    },
    zAxis3D: {
      name: '千位',
      type: 'value',
      ...axisSetting,
      axisLabel: {
        formatter(a) {
          return 9 - a;
        },
        textStyle: {
          color: '#222',
        },
        show: false,
      },
      max: 9,
      min: 0,
      boundaryGap: false,
    },
    grid3D: {
      viewControl: {
        autoRotate: true,
      },
      light: {
        main: {
          shadow: true,
          quality: 'ultra',
          intensity: 1.2,
        },
        ambient: {
          intensity: 0.2,
        },
        ambientCubemap: {
          // texture: './lake.hdr',
          exposure: 1,
          diffuseIntensity: 0.5,
          specularIntensity: 2,
        },
      },
      postEffect: {
        enable: true,
        SSAO: {
          enable: true,
          radius: 2,
          intensity: 1,
          quality: 'high',
        },
      },
      temporalSuperSampling: {
        enable: true,
      },
    },
    series,
  };
  return option;
};
