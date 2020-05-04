const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/motherboard.controller`);

const { getBuyCommandRegexp } = require(`../../utils/helpers/common`);
const buyCommandRegex = getBuyCommandRegexp();

const motherboard = new Scene(`motherboard`);

motherboard.enter(controller.enter);
motherboard.hears(buttons.info, controller.information);
motherboard.hears(buyCommandRegex, controller.buy);
motherboard.hears(buttons.back, controller.reEnter);
motherboard.hears(buttons.exit, controller.enterScene(`shop`));
motherboard.on('message', controller.reEnter);

module.exports = motherboard;
