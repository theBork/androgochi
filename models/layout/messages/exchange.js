const emoji = require(`../../../utils/emoji`);
const _ = require(`lodash`);

module.exports = {
  exchangeEnterMessage: ({ cryptoMoney, virtualMoney, cryptoToVirtualRate, virtualToCryptoRate }) => {
    return `${emoji.bank} ОБМЕННЫЙ ПУНКТ` +
      `\n\n*Доступные средства*` +
      `\nРобокоины: _${cryptoMoney}_` +
      `\nРоборубли: _${virtualMoney}_` +
      `\n\n*Обменный курс*` +
      `\nРобокоины в роборубли: 1 к ${cryptoToVirtualRate}` +
      `\nРоборубли в робокоины: 1 к ${virtualToCryptoRate}`
  },
  exchangeCryptoToVirtualMessage: () => `Какое количество робокоинов перевести в роборубли?`,
  exchangeVirtualToCryptoMessage: () => `Какое количество роборублей перевести в робокоины?`,
  exchangeSessionExpiredMessage: () => `Время на обмен по данному курсу истекло.`,
  exchangeNotNumberMessage: () => `Введено некорректное число.`,
  exchangeBigNumberMessage: () => `Введено число больше имеющегося.`,
  exchangeErrorMessage: () => `Ошибка во время обмена валют.`,
}
