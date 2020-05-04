const emoji = require(`../../../utils/emoji`);
const _ = require(`lodash`);

module.exports = {
  informationMainMessage: ({
    playerName,
    statusName,
    systemName,
    versionName,
    batteryName,
                             isAdapterFirst,
    adapterName,
    adapterUses,
    adapterResource,
    motherboardName,
    processorName,
    ramName,
    diskName,
    videoCardName,
    voltagePercents,
    cryptoMoney,
    virtualMoney,
  }) => {
    return `${emoji.face}*${playerName}*, заряжен на ${voltagePercents} (_${statusName.toLowerCase()}_)` +
    `\n\n${emoji.tv}Система: _${systemName} ${versionName}_` +
    `\n${emoji.motherboard}Системная плата: _${motherboardName}_` +
    `\n${emoji.sandClock}Процессор: _${processorName}_` +
    `\n${emoji.ram}Оперативная память: _${ramName}_` +
    `\n${emoji.disk}Жесткий диск: _${diskName}_` +
    `\n${emoji.videoCard}Видеокарта: _${videoCardName}_` +
    `\n${emoji.battery}Аккумулятор: _${batteryName}_` +
    `\n${emoji.plug}ЗУ: _${adapterName}_ ${isAdapterFirst ? '' : `(использовано ${adapterUses} из ${adapterResource} раз)`}` +
    `\n\n${emoji.card}Сумма в криптовалюте: _${cryptoMoney}_` +
    `\n${emoji.money}Сумма в рублях: _${virtualMoney}_`
  },
}
