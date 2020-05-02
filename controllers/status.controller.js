const _ = require(`lodash`);

const { getPlayerByChatId } = require(`./player.controller`);
const { getProcessorAmperageById, getProcessorPerformanceById } = require(`../models/processor.model`);
const { getSystemVersionAmperageById } = require(`../models/system.model`);
const { getChargerValueById } = require(`../models/charger.model`);
const { getBatteryValueById } = require(`../models/battery.model`);
const { getStatusTypeById, getStatusIdByType } = require(`../models/status.model`);
const { updatePlayerScores } = require(`../models/database/player.model`);

const {
  parseResponse,
  objectToCamelCase,
  calculateMiningResult,
  calculateMiningResultWhenTurnedOff,
  calculateDischargingResult,
  calculateChargingResult,
} = require(`../utils/helper`);

module.exports = {
  updateStatus: async ({ chatId, newStatusId }) => {
    try {
      const player = parseResponse({
        response: await getPlayerByChatId(chatId),
        normalize: objectToCamelCase,
      });
      if (!player) return;
      let _newStatusId = newStatusId || player.statusCode;
      const statusType = getStatusTypeById(player.statusCode);
      const start = player.statusLastUpdate;
      const end = +new Date();
      if (statusType === `mining`) {
        let amperage = getProcessorAmperageById(player.processorId);
        amperage += getSystemVersionAmperageById(player.systemId, player.systemVersionId);
        const dischargeValue = calculateDischargingResult({ amperage, start, end });
        let newVoltageValue = _.toFinite(player.voltageValue) - dischargeValue;
        if (newVoltageValue < 0) {
          newVoltageValue = 0;
          _newStatusId = getStatusIdByType(`charge`); // TODO Create inactive status
        }
        const performance = getProcessorPerformanceById(player.processorId);
        const miningValue = newVoltageValue > 0
          ? calculateMiningResult({ performance, start, end })
          : calculateMiningResultWhenTurnedOff({ performance, amperage, startVoltageValue: player.voltageValue })
        const cryptoMoneyValue = _.toFinite(player.cryptoMoney) + miningValue;
        await updatePlayerScores({
          chatId, voltageValue: newVoltageValue, cryptoMoneyValue, timestamp: end, statusId: _newStatusId,
        });
      } else if (statusType === `charge`) {
        const chargerValue = getChargerValueById(player.chargerId);
        const batteryValue = getBatteryValueById(player.batteryId);
        const chargeValue = calculateChargingResult({ chargerValue, start, end });
        let newVoltageValue = _.toFinite(player.voltageValue) + chargeValue;
        if (newVoltageValue >= batteryValue) {
          newVoltageValue = batteryValue;
          _newStatusId = getStatusIdByType(`mining`); // TODO: Add inactive status
        }
        await updatePlayerScores({
          chatId,
          voltageValue: newVoltageValue,
          cryptoMoneyValue: player.cryptoMoney,
          timestamp: end,
          statusId: _newStatusId,
        });
      }
    } catch (e) {
      console.log(e);
      throw new Error(`Ошибка обновления статуса`);
    }
  },
}
