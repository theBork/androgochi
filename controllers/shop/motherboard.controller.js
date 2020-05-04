const _ = require(`lodash`);

const messages = require(`../../models/layout/messages/shop`);
const keyboards = require(`../../models/layout/keyboards/shop`);

const { updateStatus } = require(`../status.controller`);
const { getPlayerByChatId, buyDetail } = require(`../../models/player.model`);
const { parseError } = require(`../../utils/helpers/common`);
const { getMotherboards, getMotherboardObjectById } = require(`../../models/motherboard.model`);
const { getProcessorSocketById } = require(`../../models/processor.model`);
const { getRamValueById, getRamTypeById } = require(`../../models/ram.model`);
const { getDiskTypeById } = require(`../../models/disk.model`);
const { getVideoCardTypeById } = require(`../../models/videoCard.model`);

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
    const list = getMotherboards();
    await ctx.reply(
      messages.shopDetailsListMessage({ list, currentId: player.motherboardId }),
      keyboards.shopSectionKeyboard(),
    );
  },
  information: async (ctx) => {
    await checkAuthAndReturnPlayer(ctx);
    await ctx.replyWithMarkdown(
      messages.shopMotherboardInfoMessage(),
      keyboards.shopBackKeyboard(),
    );
  },
  buy: async (ctx) => {
    const player = await checkAuthAndReturnPlayer(ctx);

    const message = _.get(ctx, `message.text`)
    const idToBuy = _.toFinite(_.nth(_.split(message, `_`, 2), 1));

    if (!idToBuy) return ctx.replyWithMarkdown(messages.shopBuyErrorMessage(), keyboards.shopBackKeyboard());

    const motherboard = getMotherboardObjectById(idToBuy);

    if (player.virtualMoney < motherboard.price) {
      return ctx.replyWithMarkdown(messages.shopLowFundsMessage(), keyboards.shopBackKeyboard());
    }

    // Проверка на совместимость с имеющимся процессором
    const processorSocket = getProcessorSocketById(player.processorId);
    const motherboardSockets = motherboard.sockets;
    if (_.indexOf(motherboardSockets, processorSocket) === -1) {
      return ctx.replyWithMarkdown(
        messages.shopWrongMotherboardByProcessorSocketMessage(), keyboards.shopBackKeyboard(),
      );
    }

    // // Проверка на совместимость с типом имеющейся оперативной памяти
    // const ramType = getRamTypeById(player.ramId);
    // const motherboardRamTypes = motherboard.ramTypes;
    // if (_.indexOf(motherboardRamTypes, ramType) === -1) {
    //   return ctx.replyWithMarkdown(messages.shopWrongMotherboardByRamTypeMessage(), keyboards.shopBackKeyboard());
    // }
    //
    // // Проверка на совместимость с размером имеющейся оперативной памяти
    // const ramSize = getRamValueById(player.ramId);
    // const motherboardMaxRamSize = motherboard.maxRam;
    // if (motherboardMaxRamSize < ramSize) {
    //   return ctx.replyWithMarkdown(messages.shopWrongMotherboardByRamSizeMessage(), keyboards.shopBackKeyboard());
    // }

    // Проверка на совместимость с типом имеющегося жесткого диска
    const diskType = getDiskTypeById(player.diskId);
    const motherboardDiskTypes = motherboard.diskTypes;
    if (_.indexOf(motherboardDiskTypes, diskType) === -1) {
      return ctx.replyWithMarkdown(messages.shopWrongMotherboardByDiskTypeMessage(), keyboards.shopBackKeyboard());
    }

    // Проверка на совместимость с типом имеющейся видеокарты
    const videoCardType = getVideoCardTypeById(player.videocardId);
    const motherboardVideoCardTypes = motherboard.videocardTypes;
    if (_.indexOf(motherboardVideoCardTypes, videoCardType) === -1) {
      return ctx.replyWithMarkdown(messages.shopWrongMotherboardByVideoCardTypeMessage(), keyboards.shopBackKeyboard());
    }

    try {
      const isSuccessBuy = buyDetail({
        chatId: ctx.chat.id,
        player,
        detailType: `motherboard`,
        detailId: idToBuy,
        spentVirtualMoney: motherboard.price,
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
