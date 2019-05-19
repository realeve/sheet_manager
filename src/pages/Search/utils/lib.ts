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
