const _ = require('lodash');

const data = [
  {
    id: 0,
    name: `500mAh`,
    value: 500,
    price: 0,
  },
  {
    id: 1,
    name: `800mAh`,
    value: 800,
    price: 1000,
  },
  {
    id: 2,
    name: `1000mAh`,
    value: 1000,
    price: 1200,
  },
  {
    id: 3,
    name: `1200mAh`,
    value: 1200,
    price: 1500,
  },
];

module.exports = {
  getBatteryNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getBatteryValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getFirstVersionOfBattery: (id) => 0,
};
