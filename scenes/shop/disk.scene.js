const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/disk.controller`);

const { getBuyCommandRegexp } = require(`../../utils/helpers/common`);
const buyCommandRegex = getBuyCommandRegexp();

const disk = new Scene(`disk`);

disk.enter(controller.enter);
disk.hears(buttons.info, controller.information);
disk.hears(buyCommandRegex, controller.buy);
disk.hears(buttons.back, controller.reEnter);
disk.hears(buttons.exit, controller.enterScene(`shop`));
disk.on('message', controller.reEnter);

module.exports = disk;
