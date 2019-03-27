import * as R from 'ramda';
let getType = arr => R.type(arr).toLowerCase();
let isArr = arr => getType(arr) === 'array';

export const convertLang = src => {
  function translator(src, item, parentKey) {
    src = src || {};
    parentKey = parentKey || '';
    Object.keys(item).map(key => {
      let childrenKey = parentKey === '' ? key : parentKey + '.' + key;
      if (typeof item[key] != 'string') {
        //object
        src[childrenKey] = translator(src, item[key], childrenKey);
      } else if (isArr(item[key])) {
        childrenKey += idx;
        item[key].forEach(detail => {
          src[childrenKey] = detail;
        });
      } else {
        src[childrenKey] = item[key];
      }
    });
    return src;
  }
  src = translator({}, src);
  let dist = {};
  Object.keys(src).forEach(key => {
    if (typeof src[key] === 'string') {
      dist[key] = src[key];
    }
  });
  return dist;
};
