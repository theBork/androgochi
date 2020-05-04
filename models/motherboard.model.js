const _ = require('lodash');

const data = require(`../data/motherboard.json`);

module.exports = {
  getMotherboards: () => data,
  getMotherboardObjectById: (id) => _.find(data, (x) => x.id === id),
  getMotherboardNameById: (id) => _.get(_.find(data, (x) => x.id === id), `name`),
  getMotherboardSocketsById: (id) => _.get(_.find(data, (x) => x.id === id), `sockets`),
  getMotherboardRamTypesById: (id) => _.get(_.find(data, (x) => x.id === id), `ramTypes`),
  getMotherboardRamMaxSizeById: (id) => _.get(_.find(data, (x) => x.id === id), `maxRam`),
  getMotherboardDiskTypesById: (id) => _.get(_.find(data, (x) => x.id === id), `diskTypes`),
  getMotherboardVideoCardTypesById: (id) => _.get(_.find(data, (x) => x.id === id), `videocardTypes`),
  getMotherboardAmperageById: (id) => _.get(_.find(data, (x) => x.id === id), `amperage`),
  getFirstVersionOfMotherboard: () => 1,
};
