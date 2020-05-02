const emoji = require(`node-emoji`);
const _ = require(`lodash`);

module.exports = {
  getInformationMessage: ({
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
    return `${emoji.get(`:man:`)}*${playerName}*, заряжен на ${voltagePercents} (_${statusName.toLowerCase()}_)` +
    `\n\n${emoji.get(`:tv:`)}Система: _${systemName} ${versionName}_` +
    `\n${emoji.get(`:hourglass:`)}Процессор: _${processorName}_` +
    `\n${emoji.get(`:battery:`)}Аккумулятор: _${batteryName}_` +
    `\n${emoji.get(`:electric_plug:`)}Зарядное устройство: _${adapterName}_` +
    `\n\n${emoji.get(`:credit_card:`)}Сумма в криптовалюте: _${cryptoMoney}_` +
    `\n${emoji.get(`:moneybag:`)}Сумма в рублях: _${virtualMoney}_`
  },
  welcomeMessage: () => {
    return `${emoji.get(`:raised_hand`)} Добро пожаловать в игру Андрогочи. ` +
      `Это как Тамагочи, только тебе придется выращивать не какую-то бесполезную зверюшку, а настоящего андроида.` +
      `\n\nВ игре тебе предстоит апгрейдить детали своего робота, майнить биткоины, следить за уровнем заряда, ` +
      `а также выполнять миссии различной сложности.`
  },
  cryptoMoneyRatingMessage: (arrayOfRows) => {
    let messageBody = `${emoji.get(`:bar_chart`)} ТОП ИГРОКОВ ПО РОБОКОИНАМ\n`;
    if (!_.size(arrayOfRows)) {
      messageBody += `\nНе найдено игроков.`;
    } else {
      arrayOfRows.forEach((item, index) => {
        messageBody += `\n${index + 1}. ${item.playerName} (${item.cryptoMoney})`
      });
    }
    return messageBody;
  },
  nameSelectionMessage: () => `Пожалуйста, введите имя своего Андроида. Имя должно быть не длиннее 16 символов.`,
}
