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
    motherboardId,
    processorId,
    ramId,
    diskId,
    videoCardId,
    batteryId,
    adapterId,
    creationDate,
  }) => {
    const [row] = await db.query(
      `INSERT INTO players(` +
      `chat_id, ` +
      `player_name, ` +
      `system_id, ` +
      `system_version_id, ` +
      `creation_date, ` +
      `crypto_money, ` +
      `crypto_accumulator, ` +
      `virtual_money, ` +
      `status_id, ` +
      `status_last_update, ` +
      `status_time_trigger, ` +
      `voltage_value, ` +
      `voltage_last_update, ` +
      `battery_id, ` +
      `adapter_id, ` +
      `adapter_uses, ` +
      `motherboard_id, ` +
      `processor_id, ` +
      `ram_id, ` +
      `disk_id, ` +
      `videocard_id) ` +
      `VALUES (` +
      `'${chatId}', ` +
      `'${playerName}', ` +
      `'${systemId}', ` +
      `'${systemVersionId}', ` +
      `'${creationDate}', ` +
      `'${cryptoMoney}', ` +
      `'${cryptoMoney}', ` +
      `'${virtualMoney}', ` +
      `'${statusId}', ` +
      `'${creationDate}', ` +
      `'${creationDate}', ` +
      `'${voltageValue}', ` +
      `'${creationDate}', ` +
      `'${batteryId}', ` +
      `'${adapterId}', ` +
      `'0', ` +
      `'${motherboardId}', ` +
      `'${processorId}', ` +
      `'${ramId}', ` +
      `'${diskId}', ` +
      `'${videoCardId}')`,
    );
    return row;
  },
  getAllPlayers: async () => {
    const [rows] = await db.query(`SELECT * FROM players`);
    return rows;
  },
  getTopPlayersByCryptoMoney: async (limit) => {
    const [rows] = await db.query(`SELECT * FROM players ORDER BY crypto_accumulator DESC LIMIT ?`, [limit]);
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
  updatePlayerScores: async ({
    chatId,
    voltageValue,
    cryptoMoneyValue,
    miningValue,
    newAdapterId,
    newAdapterUsesValue,
    timestamp,
    statusId
  }) => {
    const [rows] = await db.query(
      `UPDATE players ` +
      `SET status_id=?, voltage_value=?, crypto_money=?, crypto_accumulator=crypto_accumulator+?, ` +
      `adapter_id=?, adapter_uses=?, status_last_update=? ` +
      `WHERE chat_id=?`,
      [statusId, voltageValue, cryptoMoneyValue, miningValue, newAdapterId, newAdapterUsesValue, timestamp, chatId],
    );
    return rows;
  },
  updatePlayerCrypto: async ({chatId, voltageValue, timestamp}) => {
    const [rows] = await db.query(
      `UPDATE players SET voltage_value=?, status_last_update=? WHERE chat_id=?`, [voltageValue, timestamp, chatId]
    );
    return rows;
  },
  increaseMoneyValues: async ({ chatId, cryptoMoneyIncreaseValue, virtualMoneyIncreaseValue }) => {
    const [rows] = await db.query(
      `UPDATE players SET crypto_money=crypto_money+?, virtual_money=virtual_money+? WHERE chat_id=?`,
      [cryptoMoneyIncreaseValue, virtualMoneyIncreaseValue, chatId],
    );
    return rows;
  },
  buyDetail: async ({ chatId, detailType, detailId, spentVirtualMoney }) => {
    const [rows] = await db.query(
      `UPDATE players SET ${detailType}_id=?, virtual_money=virtual_money-? WHERE chat_id=?`,
      [detailId, spentVirtualMoney, chatId],
    );
    return rows;
  },
  buyMotherboard: async ({ chatId, detailId, newRamId, spentVirtualMoney }) => {
    const [rows] = await db.query(
      `UPDATE players SET motherboard_id=?, ram_id=?, virtual_money=virtual_money-? WHERE chat_id=?`,
      [detailId, newRamId, spentVirtualMoney, chatId],
    );
    return rows;
  },
  buyDisk: async ({ chatId, detailId, newCryptoMoneyValue, spentVirtualMoney }) => {
    const [rows] = await db.query(
      `UPDATE players SET disk_id=?, crypto_money=?, virtual_money=virtual_money-? WHERE chat_id=?`,
      [detailId, newCryptoMoneyValue, spentVirtualMoney, chatId],
    );
    return rows;
  },
  buyBattery: async ({ chatId, detailId, voltageValue, spentVirtualMoney }) => {
    const [rows] = await db.query(
      `UPDATE players SET battery_id=?, voltage_value=?, virtual_money=virtual_money-? WHERE chat_id=?`,
      [detailId, voltageValue, spentVirtualMoney, chatId],
    );
    return rows;
  },
  buyAdapter: async ({ chatId, detailId, spentVirtualMoney }) => {
    const [rows] = await db.query(
      `UPDATE players SET adapter_id=?, adapter_uses=0, virtual_money=virtual_money-? WHERE chat_id=?`,
      [detailId, spentVirtualMoney, chatId],
    );
    return rows;
  },
};
