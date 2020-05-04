const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/index.controller`);

const shop = new Scene(`shop`);

shop.enter(controller.enter);
shop.hears(buttons.motherboard, controller.enterScene(`motherboard`));
shop.hears(buttons.processor, controller.enterScene(`processor`));
shop.hears(buttons.ram, controller.enterScene(`ram`));
shop.hears(buttons.disk, controller.enterScene(`disk`));
shop.hears(buttons.videoCard, controller.enterScene(`videoCard`));
shop.hears(buttons.battery, controller.enterScene(`battery`));
shop.hears(buttons.adapter, controller.enterScene(`adapter`));
shop.hears(buttons.back, controller.reEnter);
shop.hears(buttons.exit, controller.enterScene(`information`));
shop.on('message', controller.reEnter);

module.exports = shop;
