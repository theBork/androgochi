const _ = require('lodash');

const statusList = [
  {
    id: 0,
    name: `Майнинг`,
    type: `mining`,
  },
  {
    id: 1,
    name: `Зарядка`,
    type: `charge`,
  },
  {
    id: 2,
    name: `Переустановка ОС`,
    type: `os_setup`,
  },
  {
    id: 3,
    name: `Смена деталей`,
    type: `upgrade`,
  },
];

module.exports = {
  getStatusNameById: (statusId) => _.get(_.find(statusList, (x) => x.id === statusId), `name`),
  getStatusIdByType: (statusType) => _.get(_.find(statusList, (x) => x.type === statusType), `id`),
  getStatusTypeById: (statusId) => _.get(_.find(statusList, (x) => x.id === statusId), `type`),
  getDefaultStatusCode: () => 0,
};
