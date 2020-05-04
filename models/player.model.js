const _ = require(`lodash`);

const START_CRYPTO_MONEY = 0;
const START_VIRTUAL_MONEY = 0;

const {
  createNewPlayer,
  getPlayerByChatId,
  increaseMoneyValues,
  buyDetail: buyDetailDb,
  buyAdapter: buyAdapterDb
} = require(`../models/database/player.db`);
const { getDefaultStatusId } = require(`./status.model`);
const { getFirstVersionOfSystem } = require(`./system.model`);
const { getFirstVersionOfMotherboard } = require(`./motherboard.model`);
const { getFirstVersionOfProcessor } = require(`./processor.model`);
const { getFirstVersionOfRam } = require(`./ram.model`);
const { getFirstVersionOfDisk } = require(`./disk.model`);
const { getFirstVersionOfVideoCard } = require(`./videoCard.model`);
const { getFirstVersionOfBattery, getBatteryValueById } = require(`./battery.model`);
const { getFirstVersionOfAdapter } = require(`./adapter.model`);
const { toCamelCase, parseDatabaseUpdateResponse } = require(`../utils/helpers/common`);


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
        statusId: getDefaultStatusId(),
        cryptoMoney: START_CRYPTO_MONEY,
        virtualMoney: START_VIRTUAL_MONEY,
        voltageValue: batteryValue,
        motherboardId: getFirstVersionOfMotherboard(),
        processorId: getFirstVersionOfProcessor(),
        ramId: getFirstVersionOfRam(),
        diskId: getFirstVersionOfDisk(),
        videoCardId: getFirstVersionOfVideoCard(),
        batteryId,
        adapterId: getFirstVersionOfAdapter(),
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
      if (!_.size(response)) return null;
      const data = _.first(response)
      return toCamelCase(data);
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  updateMoneyValues: async ({ chatId, cryptoMoneyIncreaseValue, virtualMoneyIncreaseValue }) => {
    try {
      const response = await increaseMoneyValues({ chatId, cryptoMoneyIncreaseValue, virtualMoneyIncreaseValue });
      return !!response;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  buyDetail: async ({ chatId, detailType, detailId, spentVirtualMoney }) => {
    const buyFunction = detailType === `adapter` ? buyAdapterDb : buyDetailDb;
    try {
      const response = parseDatabaseUpdateResponse(await buyFunction({
        chatId, detailType, detailId, spentVirtualMoney,
      }));
      return !!response;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
}
