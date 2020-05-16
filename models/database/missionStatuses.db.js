const db = require(`../../config/db`);
const _ = require('lodash');

module.exports = {
  getMissionStatusRow: async ({ chatId, missionId }) => {
    const [rows] = await db.query(`SELECT * FROM mission_statuses WHERE chat_id=? AND mission_id=?`, [chatId, missionId]);
    return rows;
  },
  markMissionAsCompleted: async ({ chatId, missionId }) => {
    const [rows] = await db.query(`INSERT INTO mission_statuses(chat_id, mission_id, is_completed) VALUES(?, ?, 1)`, [chatId, missionId]);
    return rows;
  },
  getHomeActionsBySection: async ({ sectionName }) => {
    const [rows] = await db.query(`SELECT * FROM missions WHERE area='Дом' AND section=?`, [sectionName]);
    return rows;
  },
};
