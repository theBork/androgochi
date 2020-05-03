const _ = require(`lodash`);

const { getPlayerByChatId } = require(`../models/player.model`);
const { getAdapterValueById } = require(`../models/adapter.model`);
const { getBatteryValueById } = require(`../models/battery.model`);
const { getStatusTypeById, getStatusIdByType } = require(`../models/status.model`);
const { updatePlayerScores } = require(`../models/database/player.db`);

const {
  calculateMiningResult,
  calculateMiningResultWhenTurnedOff,
  calculateDischargingResult,
  calculateChargingResult,
} = require(`../utils/helpers/common`);

const { getChargingTime } = require(`../utils/helpers/common`);
const { getAmperage } = require(`../utils/helpers/amperage`);
const { getPerformance } = require(`../utils/helpers/performance`);

module.exports = {
  updateStatus: async ({ chatId, newStatusId }) => {
    try {
      const player = await getPlayerByChatId(chatId);
      if (!player) return;
      let _newStatusId = newStatusId || player.statusId;
      const statusType = getStatusTypeById(player.statusId);
      const start = player.statusLastUpdate;
      const end = +new Date();

      let amperage = getAmperage(player);
      let newVoltageValue = _.toFinite(player.voltageValue);
      let cryptoMoneyValue = _.toFinite(player.cryptoMoney);
      if (statusType === `mining` || statusType === `idle`) {
        let dischargeValue = calculateDischargingResult({ amperage, start, end });
        newVoltageValue = _.toFinite(player.voltageValue) - dischargeValue;
        if (newVoltageValue < 0) {
          newVoltageValue = 0;
          _newStatusId = getStatusIdByType(`off`);
        }
      }

      if (statusType === `mining`) {
        const performance = getPerformance(player);
        const miningValue = newVoltageValue > 0
          ? calculateMiningResult({ performance, start, end })
          : calculateMiningResultWhenTurnedOff({ performance, amperage, startVoltageValue: player.voltageValue })
        cryptoMoneyValue += miningValue;
      } else if (statusType === `charge`) {
        const adapterValue = getAdapterValueById(player.adapterId);
        const batteryValue = getBatteryValueById(player.batteryId);
        const chargeValue = calculateChargingResult({ adapterValue, start, end });
        newVoltageValue = _.toFinite(player.voltageValue) + chargeValue;
        if (newVoltageValue > batteryValue) {
          const chargingTime = getChargingTime({ adapterValue, batteryValue, startValue: player.voltageValue });
          const calculatingPeriodTime = +new Date() - player.statusLastUpdate;
          const idleTime = calculatingPeriodTime - chargingTime;
          let dischargeValue = calculateDischargingResult({ amperage, start: 0, end: idleTime });
          newVoltageValue = batteryValue - dischargeValue;
          console.log(
            `Overcharging. Period: ${end - start}, chargingTime: ${chargingTime}, idleTime: ${idleTime}.`,
            `DischargeValue: ${dischargeValue}, new voltage: ${newVoltageValue}.`,
          );
          if (newVoltageValue < 0) {
            newVoltageValue = 0;
            _newStatusId = getStatusIdByType(`off`);
          } else {
            _newStatusId = getStatusIdByType(`idle`);
          }
        }
      }
      await updatePlayerScores({
        chatId,
        voltageValue: newVoltageValue,
        cryptoMoneyValue,
        timestamp: end,
        statusId: _newStatusId,
      });
    } catch (e) {
      console.log(e);
      throw new Error(`Ошибка обновления статуса`);
    }
  },
}
