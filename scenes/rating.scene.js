const Scene = require('telegraf/scenes/base');

const buttons = require(`../models/layout/buttons`);
const controller = require(`../controllers/rating.controller`);

const rating = new Scene(`rating`);

rating.enter(controller.enter);
rating.hears(buttons.back, controller.enterScene(`information`));
rating.on('message', controller.reEnter);

module.exports = rating;
