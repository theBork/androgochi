const buttons = require(`../buttons`);
const Markup = require('telegraf/markup');

module.exports = {
  back: () => Markup.keyboard(
    [buttons.back]
  ).oneTime().resize().extra(),
}
