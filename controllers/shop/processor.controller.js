const _ = require(`lodash`);

const messages = require(`../../models/layout/messages/shop`);
const keyboards = require(`../../models/layout/keyboards/shop`);

const { updateStatus } = require(`../status.controller`);
const { getPlayerByChatId, buyDetail } = require(`../../models/player.model`);
const { parseError, toCamelCase } = require(`../../utils/helpers/common`);
const {
  getProcessors,
  getProcessorObjectById,
  getProcessorsBySocketName,
  getProcessorNameById,
} = require(`../../models/processor.model`);
const { getMotherboardSocketsById } = require(`../../models/motherboard.model`);

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
    const list = toCamelCase(getProcessors());
    const sortedList = list.reduce((accumulator, item) => {
      return _.indexOf(accumulator, item.socketText) === -1 ? accumulator.concat([item.socketText]) : accumulator;
    }, []);
    const currentProcessorName = getProcessorNameById(player.processorId)
    await ctx.replyWithMarkdown(
      messages.processorMainMessage({ currentProcessor: currentProcessorName }),
      keyboards.processorTypesKeyboard(sortedList),
    );
  },
  section: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);
    const socketName = _.get(ctx, `message.text`);
    const list = toCamelCase(getProcessorsBySocketName(socketName));
    if (!_.size(list)) return ctx.scene.reenter();
    await ctx.reply(
      messages.shopDetailsListMessage({ list, currentId: player.processorId }),
      keyboards.shopBackKeyboard(),
    );
  },
  information: async (ctx) => {
    await checkAuthAndReturnPlayer(ctx);
    await ctx.replyWithMarkdown(
      messages.shopProcessorInfoMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  buy: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    const message = _.get(ctx, `message.text`)
    const idToBuy = _.toFinite(_.nth(_.split(message, `_`, 2), 1));

    if (!idToBuy) return ctx.replyWithMarkdown(messages.shopBuyErrorMessage(), keyboards.shopBackKeyboard());

    const processor = toCamelCase(getProcessorObjectById(idToBuy));

    if (player.virtualMoney < processor.price) {
      return ctx.replyWithMarkdown(messages.shopLowFundsMessage(), keyboards.shopBackKeyboard());
    }

    const motherboardSockets = getMotherboardSocketsById(player.motherboardId);

    if (_.indexOf(motherboardSockets, processor.socketSlug) === -1) {
      return ctx.replyWithMarkdown(messages.shopWrongProcessorMessage(), keyboards.shopBackKeyboard());
    }

    try {
      const isSuccessBuy = buyDetail({
        chatId: ctx.chat.id,
        player,
        detailType: `processor`,
        detailId: idToBuy,
        spentVirtualMoney: processor.price,
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
