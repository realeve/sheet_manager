import theme from './theme';
const R = require('ramda');

let gColor = {
  '9602A': '#7ECF51',
  '103-G-2A': '#7ECF51',
  '9603A': 'rgb(189,66,175)',
  '103-G-3A': 'rgb(189,66,175)',
  '9604A': '#61A5E8',
  '103-G-4A': '#61A5E8',
  '9605A': 'rgb(200,200,30)',
  '103-G-5A': 'rgb(200,200,30)',
  '9606A': '#3D7F18',
  '103-G-6A': '#3D7F18',
  '9607A': '#ff4d68',
  '103-G-7A': '#ff4d68',
  '9607T': '#ff4d68',
  '103-G-7T': '#ff4d68',
};

let handleColor = option => {
  if (!option.series || !R.keys(gColor).includes(option.series[0].name)) {
    return option;
  }
  let idx = 0;

  let color = R.map(({ name }) =>
    !R.isNil(gColor[name]) ? gColor[name] : theme.color[idx++ % option.legend.data.length]
  )(option.series);

  option.color = color;
  return option;
};
export default {
  handleColor,
};
