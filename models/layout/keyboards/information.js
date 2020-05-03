const buttons = require(`../buttons`);
const Markup = require('telegraf/markup');

module.exports = {
  informationMain: (statusType) => {
    switch (statusType) {
      case `off`:
        return Markup.keyboard([buttons.startCharging]).oneTime().resize().extra();
      case `idle`:
        return Markup.keyboard([
          [buttons.refresh, buttons.statistic],
          [buttons.mining, buttons.missions],
          [buttons.startCharging],
          [buttons.shop, buttons.exchange]
        ]).oneTime().resize().extra();
      case `charge`:
        return Markup.keyboard([
          [buttons.refresh, buttons.statistic],
          [buttons.missions],
          [buttons.cancelCharging],
          [buttons.shop, buttons.exchange]
        ]).oneTime().resize().extra();
      case `mining`:
        return Markup.keyboard([
          [buttons.refresh, buttons.statistic],
          [buttons.idle, buttons.missions],
          [buttons.startCharging],
          [buttons.shop, buttons.exchange]
        ]).oneTime().resize().extra();
      default:
        return Markup.keyboard(
          [buttons.refresh, buttons.statistic]
        ).oneTime().resize().extra();
    }
  },
}
