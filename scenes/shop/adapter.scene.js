const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/adapter.controller`);

const { getBuyCommandRegexp } = require(`../../utils/helpers/common`);
const buyCommandRegex = getBuyCommandRegexp();

const adapter = new Scene(`adapter`);

adapter.enter(controller.enter);
adapter.hears(buttons.info, controller.information);
adapter.hears(buyCommandRegex, controller.buy);
adapter.hears(buttons.back, controller.reEnter);
adapter.hears(buttons.exit, controller.enterScene(`shop`));
adapter.on('message', controller.reEnter);

module.exports = adapter;
