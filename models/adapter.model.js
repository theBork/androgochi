const _ = require('lodash');

const data = require(`../data/adapter.json`);

module.exports = {
  getAdapterNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getAdapterValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getFirstVersionOfAdapter: () => 1,
};
