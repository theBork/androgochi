const _ = require(`lodash`);

const buttons = require(`../buttons`);
const Markup = require('telegraf/markup');

const sortButtons = (buttonsArray) => {
  const size = 2;
  let sortedButtonsArray = [];
  for (let i = 0; i < Math.ceil(buttonsArray.length / size); i++) {
    sortedButtonsArray[i] = buttonsArray.slice((i * size), (i * size) + size);
  }
  return sortedButtonsArray;
}

module.exports = {
  missionSelectKeyboard: () => Markup.keyboard([
    buttons.missionAdditional, buttons.missionScientific, buttons.exit,
  ]).oneTime().resize().extra(),
  areaSelectKeyboard: (list) => {
    const areaButtons = _.map(list, (item) => `Место: ${item}`);
    const sortedButtons = sortButtons(areaButtons);
    const keyboard = sortedButtons.concat([[buttons.back, buttons.exit]]);
    return Markup.keyboard(keyboard).oneTime().resize().extra();
  },
  sectionSelectKeyboard: (list) => {
    const sectionButtons = _.map(list, (item) => `Локация: ${item}`);
    const sortedButtons = sortButtons(sectionButtons);
    console.log(sortedButtons);
    const keyboard = sortedButtons.concat([[buttons.back, buttons.exit]]);
    return Markup.keyboard(keyboard).oneTime().resize().extra();
  },
  actionSelectKeyboard: (list) => {
    const actionButtons = _.map(list, (item) => [`Действие: ${item}`]);
    const keyboard = actionButtons.concat([[buttons.back, buttons.exit]]);
    return Markup.keyboard(keyboard).oneTime().resize().extra();
  },
  homeKeyboard: () => Markup.keyboard([buttons.home]).oneTime().resize().extra(),
  backKeyboard: () => Markup.keyboard([buttons.back, buttons.exit]).oneTime().resize().extra(),
}

