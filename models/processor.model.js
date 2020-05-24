const _ = require('lodash');

const data = require(`../data/processor.json`);

module.exports = {
  getProcessors: () => data,
  getProcessorsBySocketName: (socketName) => _.filter(data, (x) => x.socket_text === socketName),
  getProcessorObjectById: (id) => _.find(data, (x) => x.id === id),
  getProcessorNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getProcessorSocketById: (id) => _.get(_.find(data, (x) => x.id === id), `socket_slug`),
  getProcessorPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getProcessorAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfProcessor: () => 1,
};
