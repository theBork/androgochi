const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/processor.controller`);

const { getBuyCommandRegexp } = require(`../../utils/helpers/common`);
const buyCommandRegex = getBuyCommandRegexp();

const processor = new Scene(`processor`);

processor.enter(controller.enter);
processor.hears(buttons.info, controller.information);
processor.hears(buyCommandRegex, controller.buy);
processor.hears(buttons.back, controller.reEnter);
processor.hears(buttons.exit, controller.enterScene(`shop`));
processor.on('message', controller.reEnter);

module.exports = processor;
