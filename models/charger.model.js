const _ = require('lodash');

const data = require(`../data/charger.json`);

module.exports = {
  getChargerNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getChargerValueById: (id) => _.get(_.find(data, (x) => x.id === id), `value`),
  getFirstVersionOfCharger: () => 1,
};
