const _ = require(`lodash`);

const START_CRYPTO_MONEY = 0;
const START_VIRTUAL_MONEY = 100;

const {
  createNewPlayer,
  getPlayerByChatId,
  increaseMoneyValues,
  buyDetail: buyDetailDb,
  buyMotherboard: buyMotherboardDb,
  buyDisk: buyDiskDb,
  buyBattery: buyBatteryDb,
  buyAdapter: buyAdapterDb,
} = require(`../models/database/player.db`);
const { getDefaultStatusId } = require(`./status.model`);
const { getFirstVersionOfSystem } = require(`./system.model`);
const { getFirstVersionOfMotherboard } = require(`./motherboard.model`);
const { getFirstVersionOfProcessor } = require(`./processor.model`);
const { getFirstVersionOfRam } = require(`./ram.model`);
const { getFirstVersionOfDisk, getDiskValueById } = require(`./disk.model`);
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
      return true;
    } catch (e) {
      console.log(e);
      return false;
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
  buyDetail: async ({ chatId, player, detailType, detailId, spentVirtualMoney }) => {
    try {
      if (detailType === `adapter`) {
        const response = parseDatabaseUpdateResponse(await buyAdapterDb({
          chatId, detailId, spentVirtualMoney,
        }));
        return !!response;
      } else if (detailType === `disk`) {
        const diskValue = getDiskValueById(detailId);
        const playerCryptoMoney = _.toFinite(player.cryptoMoney);
        const newCryptoMoneyValue = diskValue < playerCryptoMoney ? diskValue : playerCryptoMoney;
        const response = parseDatabaseUpdateResponse(await buyDiskDb({
          chatId, detailId, newCryptoMoneyValue, spentVirtualMoney,
        }));
        return !!response;
      } else if (detailType === `battery`) {
        const batteryValue = getBatteryValueById(detailId);
        const newVoltageValue = player.voltageValue > batteryValue ? batteryValue : player.voltageValue;
        const response = parseDatabaseUpdateResponse(await buyBatteryDb({
          chatId, voltageValue: newVoltageValue, detailId, spentVirtualMoney,
        }));
        return !!response;
      } else if (detailType === `motherboard`) {
        const newRamId = getFirstVersionOfRam();
        const response = parseDatabaseUpdateResponse(await buyMotherboardDb({
          chatId, detailId, newRamId, spentVirtualMoney,
        }));
        return !!response;
      } else {
        const response = parseDatabaseUpdateResponse(await buyDetailDb({
          chatId, detailType, detailId, spentVirtualMoney,
        }));
        return !!response;
      }

    } catch (e) {
      console.log(e);
      return false;
    }
  },
}
