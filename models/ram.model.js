const _ = require('lodash');

const data = require(`../data/ram.json`);

module.exports = {
  getRam: () => data,
  getRamObjectById: (id) => _.find(data, (x) => x.id === id),
  getRamNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getRamPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getRamAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfRam: () => 1,
};
