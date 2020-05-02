const db = require(`../../config/db`);
const _ = require('lodash');

module.exports = {
  createNewPlayer: async ({
    chatId,
    playerName,
    systemId,
    systemVersionId,
    statusId,
    cryptoMoney,
    virtualMoney,
    voltageValue,
    batteryId,
    adapterId,
    processorId,
    creationDate,
  }) => {
    const [row] = await db.query(
      'INSERT INTO players' +
      '(chat_id, ' +
      'player_name, ' +
      'system_id, ' +
      'system_version_id, ' +
      'creation_date, ' +
      'crypto_money, ' +
      'virtual_money, ' +
      'status_id, ' +
      'status_last_update, ' +
      'voltage_value, ' +
      'voltage_last_update, ' +
      'battery_id, ' +
      'adapter_id, ' +
      'processor_id)' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        chatId,
        playerName,
        systemId,
        systemVersionId,
        creationDate,
        cryptoMoney,
        virtualMoney,
        statusId,
        creationDate,
        voltageValue,
        creationDate,
        batteryId,
        adapterId,
        processorId,
      ],
    );
    return row;
  },
  getTopPlayersByCryptoMoney: async (limit) => {
    const [rows] = await db.query(`SELECT * FROM players ORDER BY crypto_money DESC LIMIT ?`, [limit]);
    return rows;
  },
  getPlayerByChatId: async (chatId) => {
    const [rows] = await db.query(`SELECT * FROM players WHERE chat_id=?`, [chatId]);
    return rows;
  },
  setPlayerStatus: async ({chatId, statusId, timestamp}) => {
    const [rows] = await db.query(
      `UPDATE players SET status_id=?, status_last_update=? WHERE chat_id=?`, [statusId, timestamp, chatId]
    );
    return rows;
  },
  updatePlayerScores: async ({ chatId, voltageValue, cryptoMoneyValue, timestamp, statusId }) => {
    const [rows] = await db.query(
      `UPDATE players SET status_id=?, voltage_value=?, crypto_money=?, status_last_update=? WHERE chat_id=?`,
      [statusId, voltageValue, cryptoMoneyValue, timestamp, chatId],
    );
    return rows;
  },
  updatePlayerCrypto: async ({chatId, voltageValue, timestamp}) => {
    const [rows] = await db.query(
      `UPDATE players SET voltage_value=?, status_last_update=? WHERE chat_id=?`, [voltageValue, timestamp, chatId]
    );
    return rows;
  },
};
