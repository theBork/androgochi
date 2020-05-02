const _ = require(`lodash`);
const Markup = require('telegraf/markup');
const emoji = require(`../utils/emoji`);

const START_CRYPTO_MONEY = 0;
const START_VIRTUAL_MONEY = 0;

const { createNewPlayer, getPlayerByChatId, setPlayerStatus } = require(`../models/database/player.model`);
const { getStatusIdByType, getDefaultStatusCode, getStatusNameById, getStatusTypeById } = require(`../models/status.model`);
const { getFirstVersionOfSystem, getSystemNameById, getSystemVersionNameById } = require(`../models/system.model`);
const { getFirstVersionOfBattery, getBatteryValueById, getBatteryNameById } = require(`../models/battery.model`);
const { getFirstVersionOfCharger, getChargerNameById } = require(`../models/charger.model`);
const { getFirstVersionOfProcessor, getProcessorNameById } = require(`../models/processor.model`);
const { objectToCamelCase, getVoltageLevelInPercents } = require(`../utils/helper`);
const { getInformationMessage } = require(`../models/layout`);


module.exports = {
  createNewPlayer: async ({ chatId, playerName, systemId }) => {
    try {
      const batteryId = getFirstVersionOfBattery();
      const batteryValue = getBatteryValueById(batteryId);
      await createNewPlayer({
        chatId,
        playerName,
        creationDate: +new Date(),
        systemId,
        systemVersionId: getFirstVersionOfSystem(),
        statusCode: getDefaultStatusCode(),
        cryptoMoney: START_CRYPTO_MONEY,
        virtualMoney: START_VIRTUAL_MONEY,
        voltageValue: batteryValue,
        batteryId,
        chargerId: getFirstVersionOfCharger(),
        processorId: getFirstVersionOfProcessor(),
      });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false };
    }
  },
  getPlayerByChatId: async (chatId) => {
    try {
      const response = await getPlayerByChatId(chatId);
      if (!_.size(response)) return { ok: true, data: null };
      const data = _.first(response);
      return { ok: true, data };
    } catch (e) {
      console.log(e);
      return { ok: false };
    }
  },
  sendInformationMessage: async ({ ctx, player }) => {
    const statusType = getStatusTypeById(player.statusCode);
    await ctx.replyWithMarkdown(
      getInformationMessage({
        playerName: player.playerName,
        statusName: getStatusNameById(player.statusCode),
        systemName: getSystemNameById(player.systemId),
        versionName: getSystemVersionNameById(player.systemId, player.systemVersionId),
        voltagePercents: getVoltageLevelInPercents({
          batteryValue: getBatteryValueById(player.batteryId),
          voltageValue: player.voltageValue,
        }),
        batteryName: getBatteryNameById(player.batteryId),
        chargerName: getChargerNameById(player.chargerId),
        processorName: getProcessorNameById(player.processorId),
        cryptoMoney: player.cryptoMoney,
        virtualMoney: player.virtualMoney,
      }),
      Markup.keyboard(
        [
          [`${emoji.refresh} Обновить`, `${emoji.statistic} Статистика`],
          [`${statusType === `charge` ? `${emoji.cancel} Убрать с зарядки` : `${emoji.check} Поставить на зарядку`}`],
          [`${emoji.shop} Магазин`, `${emoji.bank} Обмен валют`]
        ]).oneTime().resize().extra(),
    );
  },
  getRatingByCryptoMoney: ({ ctx }) => {

  },
  setChargeStatus: async (chatId) => {
    const timestamp = +new Date();
    const statusCode = getStatusIdByType(`charge`);
    try {
      const response = await setPlayerStatus({ chatId, timestamp, statusCode });
      if (_.get(response, `affectedRows`) === 1) return { ok: true };
      return { ok: false };
    } catch (e) {
      console.log(e);
      return { ok: false };
    }
  },
  setMiningStatus: async (chatId) => {
    const timestamp = +new Date();
    const statusCode = getStatusIdByType(`mining`);
    try {
      const response = await setPlayerStatus({ chatId, timestamp, statusCode });
      if (_.get(response, `affectedRows`) === 1) return { ok: true };
      return { ok: false };
    } catch (e) {
      console.log(e);
      return { ok: false };
    }
  }
}
