import PinYin from './pinyin-dict';

function chnToPy(l1, shortMode) {
  var l2 = l1.length;
  var I1 = '';
  var reg = new RegExp('[a-zA-Z0-9- ]');
  for (var i = 0; i < l2; i++) {
    var val = l1.substr(i, 1);
    var name = arraySearch(val, PinYin, shortMode);
    if (reg.test(val)) {
      I1 += val;
    } else if (name !== false) {
      I1 += name;
    }
  }
  I1 = I1.replace(/ /g, '-');
  while (I1.indexOf('--') > 0) {
    I1 = I1.replace('--', '-');
  }
  return I1;
}

function arraySearch(l1, l2, shortMode) {
  for (var name in PinYin) {
    if (PinYin[name].indexOf(l1) !== -1) {
      return ucfirst(name, shortMode);
    }
  }
  return false;
}

function ucfirst(l1, shortMode) {
  // if (l1.length > 0)
  // {
  var first = l1.substr(0, 1).toUpperCase();
  var spare = shortMode ? '' : l1.substr(1, l1.length);
  return first + spare;
  // }
}

export default {
  toPinYin: (str) => chnToPy(str, true),
  toPinYinFull: (str) => chnToPy(str, false)
};
