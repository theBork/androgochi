const _ = require('lodash');

const data = require(`../data/motherboard.json`);

module.exports = {
  getMotherboards: () => data,
  getMotherboardObjectById: (id) => _.find(data, (x) => x.id === id),
  getMotherboardNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getMotherboardPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getMotherboardAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfMotherboard: () => 1,
};
