const Scene = require('telegraf/scenes/base');

const buttons = require(`../../models/layout/buttons`);
const controller = require(`../../controllers/missions/index.controller`);

const missions = new Scene(`missions`);

missions.enter(controller.enter);
missions.hears(buttons.missionAdditional, controller.enterScene(`missionsAdditional`));
missions.hears(buttons.missionScientific, controller.enterScene(`missionsScientific`));
missions.hears(buttons.exit, controller.enterScene(`information`));
missions.on('message', controller.reEnter);

module.exports = missions;
