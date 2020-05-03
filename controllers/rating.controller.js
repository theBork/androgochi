const messages = require(`../models/layout/messages/rating`);
const keyboards = require(`../models/layout/keyboards/rating`);

const { getTopPlayersByCryptoMoney } = require(`../models/database/player.db`);
const { toCamelCase } = require(`../utils/helpers/common`);

module.exports = {
  enter: async (ctx) => {
    try {
      const topPlayersResponse = await getTopPlayersByCryptoMoney(5);
      const topPlayers = toCamelCase(topPlayersResponse);
      if (!topPlayers) throw new Error(`Ошибка получения райтинга по криптовалюте`);
      await ctx.replyWithMarkdown(
        messages.ratingMainMessage(topPlayers),
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
