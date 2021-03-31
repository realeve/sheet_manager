import theme from './theme';
const R = require('ramda');

let gColor = {
  '9602A': '#89825a',
  '9602T': '#6d7e45',
  '103-G-2A': '#89825a',
  '103-G-2T': '#6d7e45',
  '9603A': '#7b4690',
  '9603T': '#7b4690',
  '103-G-3A': '#7b4690',
  '103-G-3T': '#7b4690',
  '103-G-3TZ': '#7b4690',
  '9604A': '#426bb0',
  '9604T': '#37bce8',
  '103-G-4A': '#426bb0',
  '103-G-4T': '#37bce8',
  '9605A': '#e48444',
  '103-G-5A': '#e48444',
  '9605T': '#e48444',
  '103-G-5T': '#e48444',
  '9606A': '#3ab591',
  '9606T': '#3ab591',
  '103-G-6A': '#3ab591',
  '103-G-6T': '#3ab591',
  '9607A': '#d35351',
  '103-G-7A': '#d35351',
  '9607T': '#d35351',
  '103-G-7T': '#d35351',
  NRB10: '#775452',
};

let handleColor = option => {
  let name = option?.series?.[0]?.name;

  if (!name || !R.keys(gColor).includes(name)) {
    return option;
  }
  let idx = 0;

  let color = R.map(({ name }) =>
    !R.isNil(gColor[name])
      ? gColor[name]
      : theme.color[idx++ % option.legend ? option.legend.data.length : option.series.length]
  )(option.series);

  option.color = color;
  return option;
};
export default {
  handleColor,
};
