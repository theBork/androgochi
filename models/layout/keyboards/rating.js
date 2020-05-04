const buttons = require(`../buttons`);
const Markup = require('telegraf/markup');

module.exports = {
  main: () => Markup.keyboard(
    [buttons.mining, buttons.exit]
  ).oneTime().resize().extra(),
  back: () => Markup.keyboard(
    [buttons.back]
  ).oneTime().resize().extra(),
}
