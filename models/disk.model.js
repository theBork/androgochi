const _ = require('lodash');

const data = require(`../data/disk.json`);

module.exports = {
  getDisks: () => data,
  getDiskObjectById: (id) => _.find(data, (x) => x.id === id),
  getDiskNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getDiskTypeById: (id) => _.get(_.find(data, (x) => x.id === id), `type`),
  getDiskValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getDiskPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getDiskAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfDisk: () => 1,
};
