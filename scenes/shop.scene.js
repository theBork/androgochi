const Scene = require('telegraf/scenes/base');

const buttons = require(`../models/layout/buttons`);
const controller = require(`../controllers/shop.controller`);

const shop = new Scene(`shop`);

shop.enter(controller.enter);
shop.hears(buttons.motherboard, controller.motherboard);
shop.hears(buttons.processor, controller.processor);
shop.hears(buttons.ram, controller.ram);
shop.hears(buttons.disc, controller.disc);
shop.hears(buttons.videoCard, controller.videoCard);
shop.hears(buttons.battery, controller.battery);
shop.hears(buttons.adapter, controller.adapter);
shop.hears(buttons.back, controller.reEnter);
shop.hears(buttons.exit, controller.enterScene(`information`));
shop.on('message', controller.reEnter);

module.exports = shop;
