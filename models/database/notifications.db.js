const db = require(`../../config/db`);
const _ = require('lodash');

module.exports = {
  getOldestMessage: async () => {
    const [rows] = await db.query(
      `SELECT * FROM notifications WHERE is_sent=0 ORDER BY creation_date DESC LIMIT 1`
    );
    return rows;
  },
  markNotificationAsSent: async (id) => {
    const [rows] = await db.query(
      `UPDATE notifications SET is_sent=1 WHERE id=?`,
      [id],
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
