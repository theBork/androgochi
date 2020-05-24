const buttons = require(`../buttons`);
const Markup = require('telegraf/markup');

module.exports = {
  shopMainKeyboard: () => Markup.keyboard([
    [buttons.motherboard, buttons.processor],
    [buttons.ram, buttons.disk],
    [buttons.videoCard, buttons.battery],
    [buttons.adapter, buttons.exit],
    ]).oneTime().resize().extra(),
  typesKeyboard: (list) => {
    return Markup.keyboard([list, [buttons.info], [buttons.exit]]).oneTime().resize().extra()
  },
  shopSectionKeyboard: () => Markup.keyboard([[buttons.info], [buttons.exit]]).oneTime().resize().extra(),
  shopBackKeyboard: () => Markup.keyboard([buttons.back]).oneTime().resize().extra(),
}

