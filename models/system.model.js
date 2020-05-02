const _ = require('lodash');

const systems = [
  {
    id: 0,
    name: `Windows`,
    versions: [
      { id: 0, name: `3.1`, amperage: 150 },
      { id: 1, name: `3.11`, amperage: 150 },
      { id: 2, name: `95`, amperage: 150 },
      { id: 3, name: `98`, amperage: 150 },
    ],
  },
  {
    id: 1,
    name: `Linux`,
    versions: [
      { id: 0, name: `14.01`, amperage: 150 },
      { id: 1, name: `16.01`, amperage: 150 },
      { id: 2, name: `18.01`, amperage: 150 },
      { id: 3, name: `20.01`, amperage: 150 },
    ],
  },
  {
    id: 2,
    name: `macOS`,
    versions: [
      { id: 0, name: `1`, amperage: 150 },
      { id: 1, name: `2`, amperage: 150 },
      { id: 2, name: `3`, amperage: 150 },
      { id: 3, name: `4`, amperage: 150 },
    ],
  },
];

module.exports = {
  getSystemNames: () => _.map(systems, (item) => item.name),
  getSystemId: (name) => _.get(_.find(systems, (x) => x.name === name), `id`),
  getSystemNameById: (id) => _.get(_.find(systems, (x) => x.id === id), `name`),
  getSystemVersionNameById: (systemId, systemVersionId) => {
    const versions = _.get(_.find(systems, (x) => x.id === systemId), `versions`);
    return _.get(_.find(versions, (x) => x.id === systemVersionId), `name`);
  },
  getSystemVersionAmperageById: (systemId, systemVersionId) => {
    const versions = _.get(_.find(systems, (x) => x.id === systemId), `versions`);
    return _.get(_.find(versions, (x) => x.id === systemVersionId), `amperage`);
  },
  getFirstVersionOfSystem: (id) => 0,
};
