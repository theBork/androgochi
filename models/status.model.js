const _ = require('lodash');

const statusList = require(`../data/status.json`);

module.exports = {
  getStatusNameById: (statusId) => _.get(_.find(statusList, (x) => x.id === statusId), `name`),
  getStatusIdByType: (statusType) => _.get(_.find(statusList, (x) => x.type === statusType), `id`),
  getStatusTypeById: (statusId) => _.get(_.find(statusList, (x) => x.id === statusId), `type`),
  getDefaultStatusId: () => 1,
};
