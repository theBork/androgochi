const _ = require(`lodash`);
const Markup = require('telegraf/markup');

const emoji = require(`../utils/emoji`);

const { getTopPlayersByCryptoMoney } = require(`../models/database/player.model`);
const { cryptoMoneyRatingMessage } = require(`../models/layout`);
const { toCamelCase } = require(`../utils/helpers/common`);

module.exports = {
  getRatingByCryptoMoney: async (ctx) => {
    try {
      const topPlayersResponse = await getTopPlayersByCryptoMoney(5);
      const topPlayers = toCamelCase(topPlayersResponse);
      if (!topPlayers) throw new Error(`Ошибка получения райтинга по криптовалюте`);
      await ctx.replyWithMarkdown(
        cryptoMoneyRatingMessage(topPlayers),
        Markup.keyboard([`${emoji.back} Назад`]).oneTime().resize().extra(),
      );
    } catch (e) {
      console.log(e);
      ctx.reply(`Произошла ошибка`);
      ctx.scene.enter(`information`);
    }
  },
}
