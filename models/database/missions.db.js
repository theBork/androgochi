const db = require(`../../config/db`);
const _ = require('lodash');

module.exports = {
  getAdditionalMissions: async () => {
    const [rows] = await db.query(`SELECT * FROM missions`);
    return rows;
  },
  getAdditionalMissionsArea: async ({ area }) => {
    const [rows] = await db.query(`SELECT * FROM missions WHERE area=?`, [area]);
    return rows;
  },
  getAdditionalMissionsSection: async ({ area, section }) => {
    const [rows] = await db.query(`SELECT * FROM missions WHERE area=? AND section=?`, [area, section]);
    return rows;
  },
  getAdditionalMissionsAction: async ({ area, section, action }) => {
    const [rows] = await db.query(
      `SELECT * FROM missions WHERE area=? AND section=? AND (action_default=? OR action_completed=?)`,
      [area, section, action, action],
    );
    return rows;
  },
};
