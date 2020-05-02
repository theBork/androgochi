const _ = require('lodash');

const data = require(`../data/processor.json`);

module.exports = {
  getProcessorNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getProcessorPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getProcessorAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfProcessor: () => 1,
};
