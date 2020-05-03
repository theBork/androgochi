const Scene = require('telegraf/scenes/base');

const controller = require(`../controllers/rating.controller`);

const rating = new Scene(`rating`);

rating.enter(controller.enter);
rating.on('message', controller.reEnter);

module.exports = rating;
