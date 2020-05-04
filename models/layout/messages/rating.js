const emoji = require(`../../../utils/emoji`);
const _ = require(`lodash`);

module.exports = {
  ratingMiningMessage: (arrayOfRows) => {
    let messageBody = `${emoji.chart} ТОП ИГРОКОВ ПО МАЙНИНГУ\n`;
    if (!_.size(arrayOfRows)) {
      messageBody += `\nНе найдено игроков.`;
    } else {
      arrayOfRows.forEach((item, index) => {
        messageBody += `\n${index + 1}. ${item.playerName} (${item.cryptoAccumulator})`
      });
    }
    return messageBody;
  },
}
