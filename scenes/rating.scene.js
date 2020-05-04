const Scene = require('telegraf/scenes/base');

const _ = require(`lodash`);

const controller = require(`../controllers/rating.controller`);

const rating = new Scene(`rating`);

rating.enter(controller.enter);
rating.on('message', (ctx) => ctx.scene.enter(`information`));
module.exports = rating;
