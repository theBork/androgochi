const _ = require(`lodash`);

const messages = require(`../../models/layout/messages/shop`);
const keyboards = require(`../../models/layout/keyboards/shop`);

const { updateStatus } = require(`../status.controller`);
const { getPlayerByChatId, buyDetail } = require(`../../models/player.model`);
const { parseError } = require(`../../utils/helpers/common`);
const { getBatteries, getBatteryObjectById } = require(`../../models/battery.model`);

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
    const list = getBatteries();
    await ctx.reply(
      messages.shopDetailsListMessage({ list, currentId: player.batteryId }),
      keyboards.shopSectionKeyboard(),
    );
  },
  information: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);
    await ctx.replyWithMarkdown(
      messages.shopBatteryInfoMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  buy: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    const message = _.get(ctx, `message.text`)
    const idToBuy = _.toFinite(_.nth(_.split(message, `_`, 2), 1));

    if (!idToBuy) return ctx.replyWithMarkdown(messages.shopBuyErrorMessage(), keyboards.shopBackKeyboard());

    const battery = getBatteryObjectById(idToBuy);

    if (player.virtualMoney < battery.price) {
      return ctx.replyWithMarkdown(messages.shopLowFundsMessage(), keyboards.shopBackKeyboard());
    }

    try {
      const isSuccessBuy = buyDetail({
        chatId: ctx.chat.id,
        player,
        detailType: `battery`,
        detailId: idToBuy,
        spentVirtualMoney: battery.price,
      });

      if (!isSuccessBuy) return ctx.replyWithMarkdown(messages.shopBuyErrorMessage(), keyboards.shopBackKeyboard());

      await ctx.replyWithMarkdown(
        messages.shopBuySuccessMessage(),
        keyboards.shopBackKeyboard(),
      );
    } catch (error) {
      return parseError(ctx, { error, defaultMessage: `Ошибка покупки` });
    }
  },
  reEnter: (ctx) => ctx.scene.reenter(),
  enterScene: (sceneName) => (ctx) => ctx.scene.enter(sceneName),
}
