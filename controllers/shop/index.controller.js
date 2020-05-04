const messages = require(`../../models/layout/messages/shop`);
const keyboards = require(`../../models/layout/keyboards/shop`);

const { updateStatus } = require(`../status.controller`);
const { getStatusIdByType } = require(`../../models/status.model`);
const { getPlayerByChatId } = require(`../../models/player.model`);
const { parseError } = require(`../../utils/helpers/common`);
const { getProcessors } = require(`../../models/processor.model`);

const checkAuthAndReturnPlayer = async (ctx) => {
  try {
    const newStatusId = getStatusIdByType(`idle`);
    await updateStatus({ chatId: ctx.chat.id, newStatusId });
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
    const player = await checkAuthAndReturnPlayer(ctx);
    await ctx.replyWithMarkdown(
      messages.shopMainMessage(),
      keyboards.shopMainKeyboard(),
    );
  },
  reEnter: (ctx) => ctx.scene.reenter(),
  enterScene: (sceneName) => (ctx) => ctx.scene.enter(sceneName),
}
