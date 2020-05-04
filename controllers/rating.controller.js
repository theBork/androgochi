const messages = require(`../models/layout/messages/rating`);
const keyboards = require(`../models/layout/keyboards/rating`);

const { updateStatus } = require(`./status.controller`);
const { getPlayerByChatId } = require(`../models/player.model`);
const { getTopPlayersByCryptoMoney } = require(`../models/database/player.db`);
const { toCamelCase, parseError } = require(`../utils/helpers/common`);
const messages = require(`../models/layout/messages/rating`);
const messages = require(`../models/layout/keyboards/rating`);

const checkAuthAndReturnPlayer = async (ctx) => {
  try {
    await updateStatus({ chatId: ctx.chat.id });
    const player = await getPlayerByChatId(ctx.chat.id);
    if (!player) {
      ctx.scene.enter('register');
      return false;
    }
    return player;
  } catch (error) {
    parseError(ctx, { error, defaultMessage: `Ошибка входа в магазин` })
    return false;
  }
}

module.exports = {
  enter: async (ctx) => {
    try {
      const player = await checkAuthAndReturnPlayer(ctx);
      const topPlayersResponse = await getTopPlayersByCryptoMoney(5);
      const topPlayers = toCamelCase(topPlayersResponse);
      if (!topPlayers) throw new Error(`Ошибка получения райтинга по криптовалюте`);
      await ctx.replyWithMarkdown(
        messages.ratingMiningMessage(topPlayers),
        keyboards.back(),
      );
    } catch (e) {
      console.log(e);
      ctx.reply(`Произошла ошибка`);
      ctx.scene.enter(`information`);
    }
  },
  reEnter: (ctx) => ctx.scene.reenter(),
  enterScene: (sceneName) => (ctx) => ctx.scene.enter(sceneName),
}
