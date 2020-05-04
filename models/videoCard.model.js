const _ = require('lodash');

const data = require(`../data/videoCard.json`);

module.exports = {
  getVideoCards: () => data,
  getVideoCardObjectById: (id) => _.find(data, (x) => x.id === id),
  getVideoCardNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getVideoCardTypeById: (id) => _.get(_.find(data, (x) => x.id === id), `type`),
  getVideoCardPerformanceById: (id) => _.get(_.find(data, (x) => x.id === id), `performance`),
  getVideoCardAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfVideoCard: () => 1,
};
