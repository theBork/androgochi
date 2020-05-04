const _ = require('lodash');

const data = require(`../data/processor.json`);

module.exports = {
  getProcessors: () => data,
  getProcessorObjectById: (id) => _.find(data, (x) => x.id === id),
  getProcessorNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getProcessorSocketById: (id) => _.get(_.find(data, (x) => x.id === id), `socket`),
  getProcessorPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getProcessorAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfProcessor: () => 1,
};
