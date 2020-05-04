const _ = require('lodash');

const data = require(`../data/adapter.json`);

module.exports = {
  getAdapters: () => data,
  getAdapterObjectById: (id) => _.find(data, (x) => x.id === id),
  getAdapterNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getAdapterValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getAdapterResourceById: (id) => _.get(_.find(data, (x) => x.id === id), `resource`),
  getFirstVersionOfAdapter: () => 1,
};
