import * as mathTool from '@/utils/math';

/**  《GB/T 4091-2001 常规控制图》
 *   A区（3σ），B区（2σ），C区（1σ）
 *  可查明原因的检验：
 *  1.1个点落在A区之外
 *  2.连续9个点在中心线同一侧
 *  3.连续6个点连续递增或递减
 *  4.连续14个点中相临交叉上下
 *  5.连续3点中有2点落在中心线同一侧的B区以外（2σ~3σ）
 *  6.连续5点中有4点落中中心线同一侧的C区以外（1σ~3σ）
 *  7.连续15点落在中心线两侧的C区内(0-1σ)
 *  8.连续8点落在中心线两侧且无一在C区内
 */

/**
 * [handleShewhartControlChart description]
 * @param  {[number]} src [待处理的Y轴数据]
 * @param  {[number]} spc [源数组的spc统计数据]
 * @return {[number]}     [供echarts调用的Y轴数据]
 *
 */
export const handleShewhartControlChart = (src, spc) => {
  // console.log(src);
  let dist: DistItem[] = new Array(src.length).fill(0);

  dist = checkRule2(src, dist, spc);
  dist = checkRule3(src, dist, spc);
  dist = checkRule4(src, dist, spc);
  dist = checkRule5(src, dist, spc);
  dist = checkRule6(src, dist, spc);
  dist = checkRule7(src, dist, spc);
  dist = checkRule8(src, dist, spc);

  return handleDistData(src, dist);
};

// 调整异常点的样式
export const handleDistData = (src, dist) => {
  let pointStyle = {
    symbolSize: 3,
    symbol: 'circle',
    itemStyle: {
      normal: {
        borderWidth: 3,
        borderColor: '#f23344',
      },
    },
  };
  dist.forEach((flag, i) => {
    if (flag) {
      src[i] = {
        value: src[i],
        ...pointStyle,
      };
    }
  });
  return src;
};

export type DistItem = -1 | 0 | 1;

// 校验2:连续9个点在中心线同一侧
export type FunCheckRule = (src: number[], dist: DistItem[], spc?: mathTool.SPC) => DistItem[];
export const checkRule2: FunCheckRule = (src, dist, spc) => {
  const checkNum: number = 9;
  if (src.length < checkNum) {
    return dist;
  }

  for (let i: number = 0; i <= src.length - checkNum; i++) {
    let iCount: number = 0, // 记录连续次数
      iNext: number = 0;

    while (Math.abs(iCount) == iNext && iNext < checkNum) {
      if (src[i + iNext] > spc.cl) {
        iCount++;
      } else if (src[i + iNext] < spc.cl) {
        iCount--;
      }
      iNext++;
    }

    // 校验通过，连续n个数据着色
    if (Math.abs(iCount) >= checkNum) {
      for (let j = i; j < i + checkNum; j++) {
        dist[j] = 1;
      }
    }
  }
  return dist;
};

// 校验3：连续6个点连续递增或递减
export const checkRule3: FunCheckRule = (src, dist) => {
  const checkNum: number = 6;
  if (src.length < checkNum) {
    return dist;
  }

  for (let i: number = 0; i <= src.length - checkNum; i++) {
    let iCount: number = 0, // 记录连续次数
      iNext: number = 0;

    while (Math.abs(iCount) == iNext && iNext < checkNum) {
      // 递减
      if (src[i + iNext] >= src[i + iNext + 1]) {
        iCount++;
      } else if (src[i + iNext] <= src[i + iNext + 1]) {
        iCount--;
      }
      iNext++;
    }
    // iCount && console.log(i, iCount);
    // 校验通过，连续n个数据着色
    if (Math.abs(iCount) >= checkNum) {
      for (let j = i; j <= i + checkNum; j++) {
        dist[j] = 1;
      }
    }
  }

  return dist;
};

// 校验4.连续14个点中相临交叉上下
export const checkRule4: FunCheckRule = (src, dist) => {
  const checkNum: number = 14;
  if (src.length < checkNum) {
    return dist;
  }

  // 先计算上升/下降趋势
  let srcTrend: DistItem[] = [];
  for (let i: number = 0; i < src.length - 1; i++) {
    const nextItem = src[i + 1];
    srcTrend.push(nextItem > src[i] ? 1 : nextItem < src[i] ? -1 : 0);
  }

  for (let i: number = 0; i <= src.length - checkNum; i++) {
    let iCount: number = 0, // 记录连续次数
      iNext: number = 0;
    let flag: boolean = false;

    while (iNext <= checkNum && iNext == iCount) {
      // 方向相反
      if (srcTrend[i + iNext] == -srcTrend[i + iNext + 1]) {
        iCount++;
      }
      iNext++;
    }

    flag = iCount == checkNum - 1;

    // 校验通过，连续n个数据着色
    if (flag) {
      for (let j = i; j <= i + checkNum; j++) {
        dist[j] = 1;
      }
    }
  }

  return dist;
};

// 校验5:连续3点中有2点落在中心线同一侧的B区以外（2σ~3σ）
export const checkRule5: FunCheckRule = (src, dist, spc) => {
  const checkNum: number = 3;
  if (src.length < checkNum) {
    return dist;
  }

  const SIGMA2 = spc.sigma * 2,
    SIGMA3 = spc.sigma * 3;

  // 先计算是否在B区以外
  let srcTrend: DistItem[] = [];
  for (let i: number = 0; i < src.length; i++) {
    const item = src[i];
    let itemFlag: DistItem = 0;
    if (item >= spc.cl + SIGMA2 && item < spc.cl + SIGMA3) {
      itemFlag = 1;
    } else if (item <= spc.cl - SIGMA2 && item > spc.cl - SIGMA3) {
      itemFlag = -1;
    }
    srcTrend.push(itemFlag);
  }

  for (let i: number = 0; i <= src.length - checkNum; i++) {
    let iCount: number = 0, // 记录连续次数
      iNext: number = 0;
    let flag: boolean = false;

    while (iNext < checkNum) {
      iCount += srcTrend[i + iNext];
      iNext++;
    }

    // 3个点中有2个落在A区，其和绝对值为2或3
    flag = Math.abs(iCount) >= checkNum - 1;
    // iCount && console.log(i, flag, iCount);

    // 校验通过，连续n个数据着色
    if (flag) {
      for (let j = i; j <= i + checkNum; j++) {
        dist[j] = srcTrend[j] != 0 ? 1 : 0;
      }
    }
  }

  return dist;
};

// 校验6:连续5点中有4点落中中心线同一侧的C区以外（1σ~3σ）
export const checkRule6: FunCheckRule = (src, dist, spc) => {
  const checkNum: number = 5;
  if (src.length < checkNum) {
    return dist;
  }

  const SIGMA = spc.sigma,
    SIGMA3 = spc.sigma * 3;

  // 先计算是否在B区以外
  let srcTrend: DistItem[] = [];
  for (let i: number = 0; i < src.length; i++) {
    const item = src[i];
    let itemFlag: DistItem = 0;
    if (item >= spc.cl + SIGMA && item < spc.cl + SIGMA3) {
      itemFlag = 1;
    } else if (item <= spc.cl - SIGMA && item > spc.cl - SIGMA3) {
      itemFlag = -1;
    }
    srcTrend.push(itemFlag);
  }

  for (let i: number = 0; i <= src.length - checkNum; i++) {
    let iCount: number = 0, // 记录连续次数
      iNext: number = 0;
    let flag: boolean = false;

    while (iNext < checkNum) {
      iCount += srcTrend[i + iNext];
      iNext++;
    }

    // 5个点中有4个落在A/B区，其和绝对值为4
    flag = Math.abs(iCount) >= checkNum - 1;
    // iCount && console.log(i, flag, iCount);
    // 校验通过，连续n个数据着色
    if (flag) {
      for (let j = i; j <= i + checkNum; j++) {
        dist[j] = srcTrend[j] != 0 ? 1 : 0;
      }
    }
  }

  return dist;
};

// 校验7:连续15点落在中心线两侧的C区内(0-1σ)
export const checkRule7: FunCheckRule = (src, dist, spc) => {
  const checkNum: number = 15;
  if (src.length < checkNum) {
    return dist;
  }

  const SIGMA = spc.sigma;

  // 先计算是否在B区以外
  let srcTrend: DistItem[] = [];
  for (let i: number = 0; i < src.length; i++) {
    const item = src[i];
    let itemFlag: DistItem = 0;
    if (item < spc.cl + SIGMA && item > spc.cl - SIGMA) {
      itemFlag = 1;
    }
    srcTrend.push(itemFlag);
  }
  // console.log(srcTrend);

  for (let i: number = 0; i <= src.length - checkNum; i++) {
    let iCount: number = 0, // 记录连续次数
      iNext: number = 0;
    let flag: boolean = false;

    while (iNext < checkNum) {
      iCount += srcTrend[i + iNext];
      iNext++;
    }

    // 5个点中有4个落在A/B区，其和绝对值为4
    flag = Math.abs(iCount) >= checkNum;
    // iCount && console.log(i, flag, iCount);
    // 校验通过，连续n个数据着色
    if (flag) {
      for (let j = i; j < i + checkNum; j++) {
        dist[j] = 1; //srcTrend[j] != 0 ? 1 : 0;
      }
    }
  }

  return dist;
};

// 校验8:连续8点落在中心线两侧且无一在C区内
export const checkRule8: FunCheckRule = (src, dist, spc) => {
  const checkNum: number = 8;
  if (src.length < checkNum) {
    return dist;
  }

  const SIGMA = spc.sigma;

  // 先计算是否在C区以外
  let srcTrend: DistItem[] = [];
  for (let i: number = 0; i < src.length; i++) {
    const item = src[i];
    let itemFlag: DistItem = 1;
    if (item < spc.cl + SIGMA && item > spc.cl - SIGMA) {
      itemFlag = 0;
    }
    srcTrend.push(itemFlag);
  }
  // console.log(srcTrend);

  for (let i: number = 0; i <= src.length - checkNum; i++) {
    let iCount: number = 0, // 记录连续次数
      iNext: number = 0;
    let flag: boolean = false;

    while (iNext < checkNum) {
      iCount += srcTrend[i + iNext];
      iNext++;
    }

    // 5个点中有4个落在A/B区，其和绝对值为4
    flag = Math.abs(iCount) >= checkNum;
    // iCount && console.log(i, flag, iCount);
    // 校验通过，连续n个数据着色
    if (flag) {
      for (let j = i; j < i + checkNum; j++) {
        dist[j] = 1; //srcTrend[j] != 0 ? 1 : 0;
      }
    }
  }

  return dist;
};
