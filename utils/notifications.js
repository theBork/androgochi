const timersMap = new Map();
const bot = require(`./bot`);
const messages = require(`../models/layout/messages/notifications`);
const { removeStatusTimeTriggerOfUser } = require(`../models/database/player.db`);
const { parseDatabaseUpdateResponse } = require(`./helpers/common`);
module.exports = {
  scheduleStatusReachMessage: async ({ chatId, timestamp, action }) => {
    // TODO: Need to watch how size of heap is changes with increase of players, and define bot instance in this module
    let delay = timestamp - +new Date();
    if (delay < 0) delay = 0;
    const isSuccessUpdate = parseDatabaseUpdateResponse({ response: await removeStatusTimeTriggerOfUser({ chatId })});
    if (!isSuccessUpdate) return;

    const previousTimer = timersMap.get(chatId);
    clearTimeout(previousTimer);
    let message;
    switch(action) {
      case 1:
        message = messages.chargingCompleteMessage();
        break;
      case 2:
        message = messages.dischargingMessage();
        break;
      case 3:
        message = messages.fullDiskMessage();
        break;
    }
    const timer = setTimeout(() => {
      bot.telegram.sendMessage(chatId, message);
      timersMap.delete(chatId);
    }, delay);

    timersMap.set(chatId, timer);
  }
}
