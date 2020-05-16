const _ = require(`lodash`);
const Scene = require('telegraf/scenes/base');

const buttons = require(`../../../models/layout/buttons`);
const controller = require(`../../../controllers/missions/additional/index.controller`);

const missionsAdditional = new Scene(`missionsAdditional`);

missionsAdditional.enter(controller.enter);
missionsAdditional.hears(/^(Место\:)/, controller.area);
missionsAdditional.hears(/^(Локация\:)/, controller.section);
missionsAdditional.hears(/^(Действие\:)/, controller.action);
missionsAdditional.hears(buttons.exit, controller.enterScene(`information`));
missionsAdditional.hears(buttons.home, controller.enterScene(`information`));
missionsAdditional.hears(buttons.back, (ctx) => {
  const state = _.get(ctx, `scene.state`);
  console.log(state);
  if (!_.size(state)) {
    return ctx.scene.enter(`missions`);
  }
  if (state.action) {
    delete state.action;
    return controller.section(ctx);
  }
  if (state.section) {
    delete state.section;
    return controller.area(ctx);
  }
  if (state.area) {
    delete state.area;
    return controller.enter(ctx);
  }
});
missionsAdditional.on('message', controller.message);

module.exports = missionsAdditional;
