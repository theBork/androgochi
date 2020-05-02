const _ = require('lodash');

const data = [
  {
    id: 0,
    name: `Intel i386, 25MHz`,
    performance: 0.033,
    frequency: 0.025,
    amperage: 50,
    price: 0,
  },
  {
    id: 1,
    name: `Intel i486DX, 33MHz`,
    performance: 0.033,
    frequency: 0.033,
    amperage: 60,
    price: 100,
  },
  {
    id: 2,
    name: `Intel i486DX2, 50MHz`,
    performance: 0.05,
    frequency: 0.05,
    amperage: 70,
    price: 300,
  },
  {
    id: 3,
    name: `Intel i486DX4, 75MHz`,
    performance: 0.075,
    frequency: 0.075,
    amperage: 80,
    price: 500,
  },
];

module.exports = {
  getProcessorNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getProcessorPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getProcessorAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfProcessor: (id) => 0,
};
