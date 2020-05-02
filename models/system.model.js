const _ = require('lodash');

const data = require(`../data/system.json`);

module.exports = {
  getSystemNames: () => _.map(data, (item) => item.name),
  getSystemId: (name) => _.get(_.find(data, (x) => x.name === name), `id`),
  getSystemNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getSystemVersionNameById: (systemId, systemVersionId) => {
    const versions = _.get(_.find(data, (x) => x.id === systemId), `versions`);
    return _.get(_.find(versions, (x) => x.id === systemVersionId), `name`);
  },
  getSystemVersionAmperageById: (systemId, systemVersionId) => {
    const versions = _.get(_.find(data, (x) => x.id === systemId), `versions`);
    return _.get(_.find(versions, (x) => x.id === systemVersionId), `amperage`);
  },
  getFirstVersionOfSystem: () => 1,
};
