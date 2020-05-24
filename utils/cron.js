const cron = require(`node-cron`);
const _ = require(`lodash`);

const {
  UPDATE_NOTIFICATIONS_CRON_SCHEDULE,
  GAME_NOTIFICATIONS_CRON_SCHEDULE,
  TIME_TO_SCHEDULE_GAME_NOTIFICATIONS,
} = require(`../constants`);
const { getOldestMessage, markNotificationAsSent } = require(`../models/database/notifications.db`);
const { getAllPlayers, getPlayersActiveFromDate, getPlayersByStatusTimeTriggerFilter } = require(`../models/database/player.db`);
const { parseDatabaseResponse, parseDatabaseUpdateResponse, toCamelCase } = require(`./helpers/common`);
const { scheduleStatusReachMessage } = require(`./notifications`);

module.exports = {
  startNotificationScheduler: (bot) => {
    cron.schedule(UPDATE_NOTIFICATIONS_CRON_SCHEDULE, async () => {
      try {
        const response = parseDatabaseResponse({ response: await getOldestMessage(), normalize: toCamelCase });
        if (!response || !_.size(response)) return;
        const messageRow = _.first(response);
        const messageToSend = _.get(messageRow, `message`);
        const group = _.get(messageRow, `groupTo`);
        const idOfSendingMessage = _.get(messageRow, `id`);
        const dateActiveFrom = +new Date() - (1000 * 60 * 60 * 24);
        const players = group === `all` ? await getAllPlayers() : await getPlayersActiveFromDate(dateActiveFrom);
        if (!players || !_.size(players)) return console.log(`No recepients send to`);
        const arrayOfPromises = [];
        players.forEach((item) => {
          arrayOfPromises.push(new Promise((resolve) => { //TODO: Do error handling
            bot.telegram.sendMessage(item.chat_id, messageToSend).then(() => {
              resolve();
            });
          }));
        });

        Promise.all(arrayOfPromises).then(async () => {
          const isMarked = parseDatabaseUpdateResponse({ response: await markNotificationAsSent(idOfSendingMessage)});
          if (!isMarked) {
            console.log(`Error in marking message as sent`);
          }
          console.log(`All messages are sent`);
        })
          .catch((error) => {
            console.log(`Error in send notification promise`, error);
        })

      } catch (error) {
        console.log(`Error in send notification`, error);
      }
    });
  },
  scheduleGameNotifications: () => {
    cron.schedule(GAME_NOTIFICATIONS_CRON_SCHEDULE, async () => {
      try {
        const now = +new Date();
        const to = now + TIME_TO_SCHEDULE_GAME_NOTIFICATIONS;
        const playersToSendNotifications = parseDatabaseResponse({
          response: await getPlayersByStatusTimeTriggerFilter({ to }),
          normalize: toCamelCase,
        });
        if (!playersToSendNotifications || !_.size(playersToSendNotifications)) return;
        playersToSendNotifications.forEach((player) => {
          scheduleStatusReachMessage({
            chatId: player.chatId, timestamp: player.statusTimeTrigger, action: player.triggerAction
          });
        });
      } catch (error) {
        console.log(`Error in send notification`, error);
      }
    });
  }
}
