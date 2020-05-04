const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/ram.controller`);

const { getBuyCommandRegexp } = require(`../../utils/helpers/common`);
const buyCommandRegex = getBuyCommandRegexp();

const ram = new Scene(`ram`);

ram.enter(controller.enter);
ram.hears(buttons.info, controller.information);
ram.hears(buyCommandRegex, controller.buy);
ram.hears(buttons.back, controller.reEnter);
ram.hears(buttons.exit, controller.enterScene(`shop`));
ram.on('message', controller.reEnter);

module.exports = ram;
