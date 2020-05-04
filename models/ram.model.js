const _ = require('lodash');

const data = require(`../data/ram.json`);

module.exports = {
  getRam: () => data,
  getRamObjectById: (id) => _.find(data, (x) => x.id === id),
  getRamNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getRamValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getRamTypeById: (id) => _.get(_.find(data, (x) => x.id === id), `type`),
  getRamPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getRamAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfRam: () => 1,
};
