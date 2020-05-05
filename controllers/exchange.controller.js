const _ = require(`lodash`);

const { updateStatus } = require("./status.controller");
const { getPlayerByChatId, updateMoneyValues } = require("../models/player.model");
const { getDiskValueById } = require("../models/disk.model");

const {
  exchangeEnterMessage,
  exchangeCryptoToVirtualMessage,
  exchangeVirtualToCryptoMessage,
  exchangeSessionExpiredMessage,
  exchangeNotNumberMessage,
  exchangeBigNumberMessage,
  exchangeErrorMessage,
  exchangeLowDiskSpaceMessage,
} = require(`../models/layout/messages/exchange`); // TODO: Replace with message variable

const {
  exchangeMainKeyboard,
  exchangeDeclineKeyboard,
} = require(`../models/layout/keyboards/exchange`);

const cryptoRates = require(`../data/cryptoRates.json`);

const EXCHANGE_SESSION_TIME = 1000 * 60;
const MONEY_ROUND_VALUE = 2;

const isSessionExpired = (createdAt) => {
  const now = +new Date();
  const expiresIn = createdAt + EXCHANGE_SESSION_TIME;
  return now > expiresIn;
};

const getErrorReply = (ctx) => {
  const exchangeSession = _.get(ctx, `scene.state.exchangeSession`);
  const sessionCreatedAt = _.get(exchangeSession, `createdAt`);
  if (!exchangeSession || !sessionCreatedAt) {
    return { message: exchangeErrorMessage(), keyboard: exchangeMainKeyboard() };
  }
  if (isSessionExpired(sessionCreatedAt)) {
    return { message: exchangeSessionExpiredMessage(), keyboard: exchangeDeclineKeyboard() };
  }
  return null;
}

module.exports = {
  enter: async (ctx) => {
    ctx.scene.state = {};
    await updateStatus({chatId: ctx.chat.id});
    const player = await getPlayerByChatId(ctx.chat.id);
    if (!player) {
      return ctx.scene.enter('register');
    }

    const hour = new Date().getHours();
    const cryptoToVirtualRate = _.get(_.first(_.filter(cryptoRates, (x) => x.hour === hour)), `rate`);
    const virtualToCryptoRate = _.round(2 - cryptoToVirtualRate, MONEY_ROUND_VALUE);
    ctx.scene.state.exchangeSession = { type: null, cryptoToVirtualRate, virtualToCryptoRate, createdAt: +new Date() };
    await ctx.replyWithMarkdown(
      exchangeEnterMessage({
        cryptoMoney: player.cryptoMoney,
        virtualMoney: player.virtualMoney,
        cryptoToVirtualRate,
        virtualToCryptoRate,
      }),
      exchangeMainKeyboard(),
    );
  },
  cryptoToVirtualSelect: async (ctx) => {
    const errorReply = getErrorReply(ctx);
    if (errorReply) {
      ctx.scene.state = {};
      return ctx.replyWithMarkdown(errorReply.message, errorReply.keyboard);
    }
    ctx.scene.state.exchangeSession.type = `cryptoToVirtual`;
    await ctx.replyWithMarkdown(exchangeCryptoToVirtualMessage(), exchangeDeclineKeyboard());
  },
  virtualToCryptoSelect: async (ctx) => {
    const errorReply = getErrorReply(ctx);
    if (errorReply) {
      ctx.scene.state = {};
      return ctx.replyWithMarkdown(errorReply.message, errorReply.keyboard);
    }
    ctx.scene.state.exchangeSession.type = `virtualToCrypto`;
    await ctx.replyWithMarkdown(exchangeVirtualToCryptoMessage(), exchangeDeclineKeyboard());
  },
  exchangeAction: async (ctx) => {
    try {
      const chatId = ctx.chat.id;
      const errorReply = getErrorReply(ctx);
      if (errorReply) {
        ctx.scene.state = {};
        return ctx.replyWithMarkdown(errorReply.message, errorReply.keyboard);
      }

      const exchangeSession = _.get(ctx, `scene.state.exchangeSession`);
      const {type: sessionType, cryptoToVirtualRate, virtualToCryptoRate } = exchangeSession;

      if (!sessionType) {
        throw new Error (`No type selected in exchange session`);
      }

      const moneyToExchange = _.toFinite(_.get(ctx, `message.text`, 0));
      if (moneyToExchange <= 0) {
        ctx.scene.state = {};
        return ctx.reply(exchangeNotNumberMessage(), exchangeDeclineKeyboard());
      }

      const player = await getPlayerByChatId(ctx.chat.id);
      if (!player) {
        return ctx.scene.enter('register');
      }

      if (sessionType === `cryptoToVirtual`) {
        if (player.cryptoMoney < moneyToExchange) {
          return ctx.replyWithMarkdown(exchangeBigNumberMessage(), exchangeDeclineKeyboard());
        }
        const cryptoMoneyIncreaseValue = -moneyToExchange;
        const virtualMoneyIncreaseValue = _.round(moneyToExchange * cryptoToVirtualRate, MONEY_ROUND_VALUE);
        const isSuccessIncrease = await updateMoneyValues({
          chatId,
          cryptoMoneyIncreaseValue,
          virtualMoneyIncreaseValue,
        });
        if (!isSuccessIncrease) {
          return ctx.reply(exchangeErrorMessage(), exchangeDeclineKeyboard());
        }
        ctx.scene.state = {};
        return ctx.scene.reenter();
      }

      if (sessionType === `virtualToCrypto`) {
        if (player.virtualMoney < moneyToExchange) {
          return ctx.replyWithMarkdown(exchangeBigNumberMessage(), exchangeDeclineKeyboard());
        }
        const cryptoMoneyIncreaseValue = _.round(moneyToExchange * virtualToCryptoRate, MONEY_ROUND_VALUE);
        const diskSpace = getDiskValueById(player.diskId);
        if (_.toFinite(player.cryptoMoney) + cryptoMoneyIncreaseValue > diskSpace) {
          return ctx.replyWithMarkdown(exchangeLowDiskSpaceMessage(), exchangeDeclineKeyboard());
        }
        const virtualMoneyIncreaseValue = -moneyToExchange;
        const isSuccessIncrease = await updateMoneyValues({
          chatId,
          cryptoMoneyIncreaseValue,
          virtualMoneyIncreaseValue,
        });
        if (!isSuccessIncrease) {
          return ctx.reply(exchangeErrorMessage(), exchangeDeclineKeyboard());
        }
        ctx.scene.state = {};
        return ctx.scene.reenter();
      }

      setTimeout(() => ctx.scene.reenter(), 500);
    } catch (e) {
      console.log(e);
      ctx.scene.state = {};
      await ctx.reply(exchangeErrorMessage(), exchangeDeclineKeyboard());
      ctx.scene.reenter();
    }
  },
  cancelExchange: (ctx) => {
    ctx.scene.state = {};
    return ctx.scene.reenter();
  },
  enterScene: (sceneName) => (ctx) =>ctx.scene.enter(sceneName),
  reEnter: (ctx) =>ctx.scene.reenter(),
}
