const _ = require('lodash');

const data = [
  {
    id: 0,
    name: `0.5A`,
    value: 500,
    price: 0,
  },
  {
    id: 1,
    name: `1A`,
    value: 1000,
    price: 2000,
  },
  {
    id: 2,
    name: `1.5A`,
    value: 1500,
    price: 3000,
  },
  {
    id: 3,
    name: `2A`,
    value: 2000,
    price: 5000,
  },
];

module.exports = {
  getChargerNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getChargerValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getFirstVersionOfCharger: (id) => 0,
};
