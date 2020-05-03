const buttons = require(`../buttons`);
const Markup = require('telegraf/markup');

module.exports = {
  shopMainKeyboard: () => Markup.keyboard([
    [buttons.motherboard, buttons.processor],
    [buttons.ram, buttons.disc],
    [buttons.videoCard, buttons.battery],
    [buttons.adapter, buttons.exit],
    ]).oneTime().resize().extra(),
  shopBackKeyboard: () => Markup.keyboard([buttons.back]).oneTime().resize().extra(),
}

