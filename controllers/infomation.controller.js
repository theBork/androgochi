const _ = require(`lodash`);

const messages = require(`../models/layout/messages/information`);
const keyboards = require(`../models/layout/keyboards/information`);

const { updateStatus } = require("./status.controller");
const { getPlayerByChatId } = require("../models/player.model");
const { getStatusIdByType, getStatusNameById, getStatusTypeById } = require(`../models/status.model`);
const { getSystemNameById, getSystemVersionNameById } = require(`../models/system.model`);
const { getBatteryValueById, getBatteryNameById } = require(`../models/battery.model`);
const { getAdapterNameById } = require(`../models/adapter.model`);
const { getProcessorNameById } = require(`../models/processor.model`);
const { getVoltageLevelInPercents } = require(`../utils/helpers/common`);

module.exports = {
  enter: async (ctx) => {
    await updateStatus({ chatId: ctx.chat.id });
    const player = await getPlayerByChatId(ctx.chat.id);
    if (!player) {
      return ctx.scene.enter('register');
    }

    const statusType = getStatusTypeById(player.statusId);
    await ctx.replyWithMarkdown(
      messages.informationMainMessage({
        playerName: player.playerName,
        statusName: getStatusNameById(player.statusId),
        systemName: getSystemNameById(player.systemId),
        versionName: getSystemVersionNameById(player.systemId, player.systemVersionId),
        voltagePercents: getVoltageLevelInPercents({
          batteryValue: getBatteryValueById(player.batteryId),
          voltageValue: player.voltageValue,
        }),
        batteryName: getBatteryNameById(player.batteryId),
        adapterName: getAdapterNameById(player.adapterId),
        processorName: getProcessorNameById(player.processorId),
        cryptoMoney: player.cryptoMoney,
        virtualMoney: player.virtualMoney,
      }),
      keyboards.informationMain(statusType),
    );
  },
  reEnter: (ctx) => ctx.scene.reenter(),
  enterScene: (sceneName) => (ctx) => ctx.scene.enter(sceneName),
  setStatus: (status) => async (ctx) => {
    try {
      const statusId = getStatusIdByType(status);
      await updateStatus({ chatId: ctx.chat.id, newStatusId: statusId });
      return ctx.scene.reenter();
    } catch (e) {
      console.log(e);
      ctx.reply(`Ошибка в смене статуса`);
      return ctx.scene.reenter();
    }
  }
}
