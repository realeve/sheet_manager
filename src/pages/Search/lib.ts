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
