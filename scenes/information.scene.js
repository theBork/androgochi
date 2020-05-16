const Scene = require('telegraf/scenes/base')

const buttons = require(`../models/layout/buttons`);
const controller = require(`../controllers/infomation.controller`);

const information = new Scene(`information`);

information.enter(controller.enter);
information.hears(buttons.refresh, controller.reEnter);
information.hears(buttons.shop, controller.enterScene(`shop`));
information.hears(buttons.missions, controller.enterScene(`missions`));
information.hears(buttons.statistic, controller.enterScene(`rating`));
information.hears(buttons.exchange, controller.enterScene(`exchange`));
information.hears(buttons.mining, controller.setStatus(`mining`));
information.hears(buttons.idle, controller.setStatus(`idle`));
information.hears(buttons.startCharging, controller.setStatus(`charge`));
information.hears(buttons.cancelCharging, controller.setStatus(`idle`));

information.on('message', controller.reEnter);

module.exports = information;
