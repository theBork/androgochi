const messages = require(`../models/layout/messages/shop`);
const keyboards = require(`../models/layout/keyboards/shop`);

const { updateStatus } = require(`./status.controller`);
const { getPlayerByChatId } = require(`../models/player.model`);
const { parseError } = require(`../utils/helpers/common`);

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
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopMainMessage(),
      keyboards.shopMainKeyboard(),
    );
  },
  motherboard: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopMotherboardMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  processor: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopProcessorMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  ram: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopRamMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  disc: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopDiscMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  videoCard: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopVideoCardMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  battery: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopBatteryMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  adapter: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    await ctx.replyWithMarkdown(
      messages.shopAdapterMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  reEnter: (ctx) => ctx.scene.reenter(),
  enterScene: (sceneName) => (ctx) => ctx.scene.enter(sceneName),
}
