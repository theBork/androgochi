const cron = require(`node-cron`);
const _ = require(`lodash`);
const { getOldestMessage, markNotificationAsSent } = require(`../models/database/notifications.db`);
const { getAllPlayers } = require(`../models/database/player.db`);
const { parseDatabaseUpdateResponse } = require(`./helpers/common`);

module.exports = {
  startNotificationScheduler: (bot) => {
    cron.schedule('0,15,30,45 * * * *', async () => {
      try {
        const response = await getOldestMessage();
        if (!response || !_.size(response)) return console.log(`Nothing to send`);
        const messageRow = _.first(response);
        const messageToSend = _.get(messageRow, `message`);
        const idOfSendingMessage = _.get(messageRow, `id`);
        const players = await getAllPlayers();
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
  }
}
