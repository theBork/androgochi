const Scene = require('telegraf/scenes/base')

const exchange = new Scene(`exchange`);

const controller = require(`../controllers/exchange.controller`);
const buttons = require(`../models/layout/buttons`);
exchange.enter(controller.enter);

exchange.hears(buttons.back, controller.enterScene(`information`));
exchange.hears(buttons.cryptoToVirtual, controller.cryptoToVirtualSelect);
exchange.hears(buttons.virtualToCrypto, controller.virtualToCryptoSelect);
exchange.hears(buttons.refresh, controller.reEnter);
exchange.hears(buttons.decline, controller.cancelExchange);

exchange.on('message', controller.exchangeAction);

module.exports = exchange;
