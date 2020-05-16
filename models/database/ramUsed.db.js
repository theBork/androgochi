const db = require(`../../config/db`);
const _ = require('lodash');

module.exports = {
  addUsedRamOfPlayer: async ({ chatId, ramAmount, timestamp }) => {
    const [rows] = await db.query(
      `INSERT INTO ram_used(chat_id, ram_amount, timestamp) VALUES(?, ?, ?)`, [chatId, ramAmount, timestamp],
    );
    return rows;
  },
  getUsedRamOfPlayer: async ({ chatId }) => {
    const [rows] = await db.query(`SELECT * FROM ram_used WHERE chat_id=?`, [chatId]);
    return rows;
  },
  getUsedRamOfPlayerBeforeTimestamp: async ({ chatId, timestamp }) => {
    const [rows] = await db.query(`SELECT * FROM ram_used WHERE chat_id=? AND timestamp<?`, [chatId, timestamp]);
    return rows;
  },
  deleteUsedRamOfPlayerBeforeTimestamp: async ({ chatId, timestamp }) => {
    const [rows] = await db.query(`DELETE FROM ram_used WHERE chat_id=? AND timestamp<?`, [chatId, timestamp]);
    return rows;
  },
};
