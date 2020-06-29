const dayjs = require('../node_modules/dayjs');
const path = require('path');
const fs = require('fs');

const hash = () =>
  Math.random()
    .toString(36)
    .substring(2, 10);

const getDir = () => {
  let str = process.cwd();
  return str.replace(/\\/g, '/');
};
const getFileName = (env, dir = 'public') => {
  let filename = `/${dir}/version${env}.json`;
  return getDir() + filename;
};

const decodeHtmlHash = () => {
  let file = fs.readFileSync(getDir() + '/dist/index.html', 'utf8');
  if (!file) {
    return hash();
  }
  // 注入log文件
  file.replace('<head>', '<head><script src="http://cdn.cdyc.cbpm/lib/cbpc_log.min.js"></script>');
  fs.writeFileSync(`${getDir()}/dist/index.html`, JSON.stringify(data), 'utf8');

  let res = file.match(/(script src="\/umi.)(\w)+/);
  return res[0].replace(res[1], '');
};

const init = (env = '') => {
  let file = '';
  try {
    file = fs.readFileSync(getFileName(env), 'utf8');
  } catch (e) {
    file = '{"version":"1.0"}';
  }
  file = JSON.parse(file);
  let preVersion = Number(file.version);
  const data = {
    version: String((preVersion + 0.1).toFixed(1)),
    hash: env === '' ? decodeHtmlHash() : hash(),
    date: dayjs().format('YYYY-MM-DD HH:mm'),
  };
  fs.writeFileSync(getFileName(env), JSON.stringify(data), 'utf8');
  fs.writeFileSync(getFileName(env, 'dist'), JSON.stringify(data), 'utf8');
};

let argv = JSON.parse(process.env.npm_config_argv);
argv = argv.original[1] || argv.original[0];

if (argv === 'build') {
  init();
} else {
  init('dev');
}

module.exports = {
  init,
};
