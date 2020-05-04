const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/shop/videoCard.controller`);

const { getBuyCommandRegexp } = require(`../../utils/helpers/common`);
const buyCommandRegex = getBuyCommandRegexp();

const videoCard = new Scene(`videoCard`);

videoCard.enter(controller.enter);
videoCard.hears(buttons.info, controller.information);
videoCard.hears(buyCommandRegex, controller.buy);
videoCard.hears(buttons.back, controller.reEnter);
videoCard.hears(buttons.exit, controller.enterScene(`shop`));
videoCard.on('message', controller.reEnter);

module.exports = videoCard;
