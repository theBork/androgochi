const _ = require('lodash');

const data = require(`../data/battery.json`);

module.exports = {
  getBatteryNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getBatteryValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getFirstVersionOfBattery: () => 1,
};
