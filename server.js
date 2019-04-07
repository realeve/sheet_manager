const { json } = require('micro');

module.exports = async req => {
  console.log(await json(req));
  return 200;
};
