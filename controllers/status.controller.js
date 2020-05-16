const _ = require(`lodash`);

const { getPlayerByChatId } = require(`../models/player.model`);
const { getDiskValueById } = require(`../models/disk.model`);
const { getAdapterValueById, getFirstVersionOfAdapter, getAdapterResourceById } = require(`../models/adapter.model`);
const { getBatteryValueById } = require(`../models/battery.model`);
const { getStatusTypeById, getStatusIdByType } = require(`../models/status.model`);
const { updatePlayerScores } = require(`../models/database/player.db`);
const { getUsedRamOfPlayer, deleteUsedRamOfPlayerBeforeTimestamp } = require(`../models/database/ramUsed.db`);

const {
  calculateMiningResult,
  calculateMiningResultWhenTurnedOff,
  calculateDischargingResult,
  calculateChargingResult,
  parseDatabaseResponse,
  toCamelCase,
} = require(`../utils/helpers/common`);

const { getChargingTime } = require(`../utils/helpers/common`);
const { getAmperage } = require(`../utils/helpers/amperage`);
const { getPerformance } = require(`../utils/helpers/performance`);

const RAM_REGENERATION_TIME = 1000 * 60 * 60 * 4;

module.exports = {
  updateStatus: async ({ chatId, newStatusId }) => {
    try {
      const player = await getPlayerByChatId(chatId);
      if (!player) return;
      let _newStatusId = newStatusId || player.statusId;
      const statusType = getStatusTypeById(player.statusId);
      const newStatusType = getStatusTypeById(newStatusId);
      const start = player.statusLastUpdate;
      const end = +new Date();

      const dateToDeleteRamUsedBefore = end - RAM_REGENERATION_TIME;
      await deleteUsedRamOfPlayerBeforeTimestamp({chatId, timestamp: dateToDeleteRamUsedBefore});
      const ramUsed = parseDatabaseResponse({ response: await getUsedRamOfPlayer({ chatId }), normalize: toCamelCase });
      let newRamUsedValue = 0;
      if (_.size(ramUsed)) {
        ramUsed.forEach((item) => {
          newRamUsedValue += item.ramAmount;
        });
      }
      let amperage = getAmperage(player);
      let newVoltageValue = _.toFinite(player.voltageValue);
      let cryptoMoneyValue = _.toFinite(player.cryptoMoney);
      let miningValue = 0;
      let newAdapterUsesValue = _.toFinite(player.adapterUses);
      let newAdapterId = player.adapterId;
      if (statusType === `mining` || statusType === `idle`) {
        let dischargeValue = calculateDischargingResult({ amperage, start, end });
        newVoltageValue = _.toFinite(player.voltageValue) - dischargeValue;
        if (newVoltageValue < 0) {
          newVoltageValue = 0;
          _newStatusId = getStatusIdByType(`off`);
        }
      }

      if (newStatusType === `charge` && statusType !== `charge`) newAdapterUsesValue++;
      if (statusType === `charge` && !!newStatusType) {
        const adapterResource = getAdapterResourceById(player.adapterId);
        const adapterUses = _.toFinite(player.adapterUses);
        if (adapterUses >= adapterResource) {
          newAdapterId = getFirstVersionOfAdapter();
          newAdapterUsesValue = 0;
        }
      }

      if (statusType === `mining`) {
        const performance = getPerformance(player);
        miningValue = newVoltageValue > 0
          ? calculateMiningResult({ performance, start, end })
          : calculateMiningResultWhenTurnedOff({ performance, amperage, startVoltageValue: player.voltageValue })
        const diskSpace = getDiskValueById(player.diskId);
        if (diskSpace <= cryptoMoneyValue) {
          _newStatusId = getStatusIdByType(`idle`);
          cryptoMoneyValue = diskSpace;
          miningValue = 0;
        } else if (diskSpace < (cryptoMoneyValue + miningValue)) {
          _newStatusId = getStatusIdByType(`idle`);
          miningValue = diskSpace - cryptoMoneyValue;
          cryptoMoneyValue += miningValue;

        } else {
          cryptoMoneyValue += miningValue;
        }
      } else if (statusType === `charge`) {
        const adapterValue = getAdapterValueById(player.adapterId);
        const batteryValue = getBatteryValueById(player.batteryId);
        const chargeValue = calculateChargingResult({ adapterValue, start, end });
        newVoltageValue = _.toFinite(player.voltageValue) + chargeValue;
        if (newVoltageValue > batteryValue) newVoltageValue = batteryValue;
      }
      await updatePlayerScores({
        chatId,
        voltageValue: newVoltageValue,
        cryptoMoneyValue,
        timestamp: end,
        newAdapterUsesValue,
        miningValue,
        newAdapterId,
        statusId: _newStatusId,
        ramUsedValue: newRamUsedValue,
      });
    } catch (e) {
      console.log(e);
      throw new Error(`Ошибка обновления статуса`);
    }
  },
}
