const emoji = require(`../../../utils/emoji`);
const _ = require(`lodash`);

module.exports = {
  informationMainMessage: ({
    playerName,
    statusName,
    systemName,
    versionName,
    batteryName,
    adapterName,
    processorName,
    voltagePercents,
    cryptoMoney,
    virtualMoney,
  }) => {
    return `${emoji.face}*${playerName}*, заряжен на ${voltagePercents} (_${statusName.toLowerCase()}_)` +
    `\n\n${emoji.tv}Система: _${systemName} ${versionName}_` +
    `\n${emoji.sandClock}Процессор: _${processorName}_` +
    `\n${emoji.battery}Аккумулятор: _${batteryName}_` +
    `\n${emoji.plug}Зарядное устройство: _${adapterName}_` +
    `\n\n${emoji.card}Сумма в криптовалюте: _${cryptoMoney}_` +
    `\n${emoji.money}Сумма в рублях: _${virtualMoney}_`
  },
}
