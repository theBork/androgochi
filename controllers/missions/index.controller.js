const messages = require(`../../models/layout/messages/missions`);
const keyboards = require(`../../models/layout/keyboards/missions`);

const { updateStatus } = require(`../status.controller`);
const { getPlayerByChatId } = require(`../../models/player.model`);
const { parseError } = require(`../../utils/helpers/common`);

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
    console.log(`Enter missions`);
    const player = await checkAuthAndReturnPlayer(ctx);
    await ctx.replyWithMarkdown(
      messages.missionsSelectMessage(),
      keyboards.missionSelectKeyboard(),
    );
  },
  reEnter: (ctx) => ctx.scene.reenter(),
  enterScene: (sceneName) => (ctx) => ctx.scene.enter(sceneName),
}
