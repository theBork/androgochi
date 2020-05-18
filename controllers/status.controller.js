const _ = require(`lodash`);

const { getPlayerByChatId } = require(`../models/player.model`);
const { getDiskValueById } = require(`../models/disk.model`);
const { getAdapterValueById, getFirstVersionOfAdapter, getAdapterResourceById } = require(`../models/adapter.model`);
const { getBatteryValueById } = require(`../models/battery.model`);
const { getStatusTypeById, getStatusIdByType } = require(`../models/status.model`);
const { updatePlayerScores } = require(`../models/database/player.db`);

const {
  calculateMiningResult,
  calculateMiningResultWhenTurnedOff,
  calculateDischargingResult,
  calculateChargingResult,
} = require(`../utils/helpers/common`);
const { getChargingTime, getDischargingTime, getMiningTime } = require(`../utils/helpers/common`);
const { getAmperage } = require(`../utils/helpers/amperage`);
const { getPerformance } = require(`../utils/helpers/performance`);

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

      // TODO: Think about another type of this field in DB
      let newStatusTimeTriggerValue = '';
      let newTriggerActionValue = 0;

      const adapterValue = getAdapterValueById(player.adapterId);
      const batteryValue = getBatteryValueById(player.batteryId);

      let amperage = getAmperage(player);
      let newVoltageValue = +player.voltageValue;
      let cryptoMoneyValue = +player.cryptoMoney;
      let miningValue = 0;
      let newAdapterUsesValue = +player.adapterUses;
      let newAdapterId = player.adapterId;
      if (statusType === `mining` || statusType === `idle`) {

        let dischargeValue = calculateDischargingResult({ amperage, start, end });
        newVoltageValue = +player.voltageValue - dischargeValue;
        if (newVoltageValue < 0) {
          newVoltageValue = 0;
          if (newStatusType !== `charge`) _newStatusId = getStatusIdByType(`off`);
        } else {
          const timeToNotification = getDischargingTime({ amperage, startValue: newVoltageValue });
          const statusTimeTriggerValue = +new Date() + timeToNotification;
          if (!newStatusTimeTriggerValue || newStatusTimeTriggerValue > statusTimeTriggerValue) {
            newStatusTimeTriggerValue = statusTimeTriggerValue;
            newTriggerActionValue = 2; // Discharge
          }
        }
      }

      if (newStatusType === `charge` && statusType !== `charge`) newAdapterUsesValue++;
      if (statusType === `charge` && !!newStatusType) {
        const adapterResource = getAdapterResourceById(player.adapterId);
        const adapterUses = +player.adapterUses;
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
          const timeToNotification = getMiningTime({ performance, diskSpace, cryptoMoneyValue });
          const statusTimeTriggerValue = +new Date() + timeToNotification;
          if (!newStatusTimeTriggerValue || newStatusTimeTriggerValue > statusTimeTriggerValue) {
            newStatusTimeTriggerValue = statusTimeTriggerValue;
            newTriggerActionValue = 3; // Full disk
          }
        }
      } else if (statusType === `charge`) {
        const chargeValue = calculateChargingResult({ adapterValue, start, end });
        newVoltageValue = +player.voltageValue + chargeValue;
        if (newVoltageValue > batteryValue) newVoltageValue = batteryValue;
      }

      if (statusType === `charge`) {
        if (newVoltageValue < batteryValue) {
          const timeToNotification = getChargingTime({ adapterValue, batteryValue, startValue: newVoltageValue });
          const statusTimeTriggerValue = +new Date() + timeToNotification;
          if (!newStatusTimeTriggerValue || newStatusTimeTriggerValue > statusTimeTriggerValue) {
            newStatusTimeTriggerValue = statusTimeTriggerValue;
            newTriggerActionValue = 1; // Charge complete
          }
        }
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
        statusTimeTriggerValue: newStatusTimeTriggerValue,
        triggerActionValue: newTriggerActionValue,
      });
    } catch (e) {
      console.log(e);
      throw new Error(`Ошибка обновления статуса`);
    }
  },
}
