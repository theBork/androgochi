const Scene = require('telegraf/scenes/base');

const _ = require(`lodash`);

const { getRatingByCryptoMoney } = require(`../rating.controller`);

const rating = new Scene(`rating`);

rating.enter(getRatingByCryptoMoney);

rating.on('message', (ctx) => ctx.scene.enter(`information`));

module.exports = [rating];
