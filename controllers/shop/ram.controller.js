const _ = require(`lodash`);

const messages = require(`../../models/layout/messages/shop`);
const keyboards = require(`../../models/layout/keyboards/shop`);

const { updateStatus } = require(`../status.controller`);
const { getPlayerByChatId, buyDetail } = require(`../../models/player.model`);
const { parseError } = require(`../../utils/helpers/common`);
const { getRam, getRamObjectById } = require(`../../models/ram.model`);
const { getMotherboardRamTypesById, getMotherboardRamMaxSizeById } = require(`../../models/motherboard.model`);

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
    const list = getRam();
    await ctx.reply(
      messages.shopDetailsListMessage({ list, currentId: player.ramId }),
      keyboards.shopSectionKeyboard(),
    );
  },
  information: async (ctx) => {
    await checkAuthAndReturnPlayer(ctx);
    await ctx.replyWithMarkdown(
      messages.shopRamInfoMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  buy: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    const message = _.get(ctx, `message.text`)
    const idToBuy = _.toFinite(_.nth(_.split(message, `_`, 2), 1));

    if (!idToBuy) return ctx.replyWithMarkdown(messages.shopBuyErrorMessage(), keyboards.shopBackKeyboard());

    const ram = getRamObjectById(idToBuy);

    if (player.virtualMoney < ram.price) {
      return ctx.replyWithMarkdown(messages.shopLowFundsMessage(), keyboards.shopBackKeyboard());
    }

    const motherboardRamTypes = getMotherboardRamTypesById(player.motherboardId);
    const motherboardRamMaxSize = getMotherboardRamMaxSizeById(player.motherboardId);

    if (_.indexOf(motherboardRamTypes, ram.type) === -1) {
      return ctx.replyWithMarkdown(messages.shopWrongRamTypeMessage(), keyboards.shopBackKeyboard());
    }
    if (motherboardRamMaxSize < ram.value) {
      return ctx.replyWithMarkdown(messages.shopWrongRamSizeMessage(), keyboards.shopBackKeyboard());
    }

    try {
      const isSuccessBuy = buyDetail({
        chatId: ctx.chat.id,
        player,
        detailType: `ram`,
        detailId: idToBuy,
        spentVirtualMoney: ram.price,
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
