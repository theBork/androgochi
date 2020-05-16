const _ = require(`lodash`);

const messages = require(`../models/layout/messages/information`);
const keyboards = require(`../models/layout/keyboards/information`);

const { updateStatus } = require(`./status.controller`);
const { getPlayerByChatId } = require(`../models/player.model`);
const { getStatusIdByType, getStatusNameById, getStatusTypeById } = require(`../models/status.model`);
const { getSystemNameById, getSystemVersionNameById } = require(`../models/system.model`);
const { getBatteryValueById, getBatteryNameById } = require(`../models/battery.model`);
const { getFirstVersionOfAdapter, getAdapterNameById, getAdapterResourceById } = require(`../models/adapter.model`);
const { getMotherboardNameById } = require(`../models/motherboard.model`);
const { getProcessorNameById } = require(`../models/processor.model`);
const { getRamNameById } = require(`../models/ram.model`);
const { getDiskNameById } = require(`../models/disk.model`);
const { getVideoCardNameById } = require(`../models/videoCard.model`);
const { getVoltageLevelInPercents } = require(`../utils/helpers/common`);

module.exports = {
  enter: async (ctx) => {
    await updateStatus({ chatId: ctx.chat.id });
    const player = await getPlayerByChatId(ctx.chat.id);
    if (!player) {
      return ctx.scene.enter('register');
    }

    const statusType = getStatusTypeById(player.statusId);
    const firstVersionOfAdapter = getFirstVersionOfAdapter();
    const isAdapterFirst = player.adapterId === firstVersionOfAdapter;
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
        motherboardName: getMotherboardNameById(player.motherboardId),
        processorName: getProcessorNameById(player.processorId),
        ramName: getRamNameById(player.ramId),
        ramUsed: player.ramUsed,
        diskName: getDiskNameById(player.diskId),
        videoCardName: getVideoCardNameById(player.videocardId),
        batteryName: getBatteryNameById(player.batteryId),
        isAdapterFirst,
        adapterName: getAdapterNameById(player.adapterId),
        adapterUses: player.adapterUses,
        adapterResource: getAdapterResourceById(player.adapterId),
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
