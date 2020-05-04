const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/battery.controller`);

const { getBuyCommandRegexp } = require(`../../utils/helpers/common`);
const buyCommandRegex = getBuyCommandRegexp();

const battery = new Scene(`battery`);

battery.enter(controller.enter);
battery.hears(buttons.info, controller.information);
battery.hears(buyCommandRegex, controller.buy);
battery.hears(buttons.back, controller.reEnter);
battery.hears(buttons.exit, controller.enterScene(`shop`));
battery.on('message', controller.reEnter);

module.exports = battery;
