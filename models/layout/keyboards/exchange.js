const buttons = require(`../buttons`);
const Markup = require('telegraf/markup');

module.exports = {
  exchangeMainKeyboard: () => Markup.keyboard(
    [[buttons.cryptoToVirtual], [buttons.virtualToCrypto], [buttons.refresh], [buttons.back]]
  ).oneTime().resize().extra(),
  exchangeDeclineKeyboard: () => Markup.keyboard(
    [buttons.decline]
  ).oneTime().resize().extra(),
}
