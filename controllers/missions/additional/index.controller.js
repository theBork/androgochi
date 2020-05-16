const _ = require(`lodash`);

const messages = require(`../../../models/layout/messages/missions`);
const keyboards = require(`../../../models/layout/keyboards/missions`);
const emoji = require(`../../../utils/emoji`);

const {
  getAdditionalMissions,
  getAdditionalMissionsArea,
  getAdditionalMissionsSection,
  getAdditionalMissionsAction,
} = require(`../../../models/database/missions.db`);
const { increaseUsedRam } = require(`../../../models/database/player.db`);
const { getMissionStatusRow, markMissionAsCompleted } = require(`../../../models/database/missionStatuses.db`);
const { addUsedRamOfPlayer } = require(`../../../models/database/ramUsed.db`);
const { updateStatus } = require(`../../status.controller`);
const { getPlayerByChatId } = require(`../../../models/player.model`);
const { getRamValueById } = require(`../../../models/ram.model`);
const {
  parseDatabaseResponse,
  parseDatabaseUpdateResponse,
  parseError,
  toCamelCase
} = require(`../../../utils/helpers/common`);

const checkAuthAndReturnPlayer = async (ctx) => {
  try {
    await updateStatus({ chatId: ctx.chat.id });
    const player = await getPlayerByChatId(ctx.chat.id);
    if (!player) {
      ctx.scene.enter('register');
      return false;
    }
    return player;
  } catch (error) {
    parseError(ctx, { error, defaultMessage: `Ошибка входа в магазин` })
    return false;
  }
}

const isActionCompletable = async ({ chatId, completableWhenArray }) => {
  try {
    const completableWhen = JSON.parse(completableWhenArray);
    if (!_.size(completableWhen)) {
      return true;
    }
    for (const item of completableWhen) {
      const missionStatusRowResponse = parseDatabaseResponse({
        response: await getMissionStatusRow({chatId, missionId: item}),
        normalize: toCamelCase,
      });
      const missionStatusRow = _.first(missionStatusRowResponse);

      if (!_.size(missionStatusRow)) {
        return false;
      } else {
        if (_.get(missionStatusRow, `isCompleted`) !== 1) return false;
      }
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = {
  enter: async (ctx) => {
    console.log(`Mission additional`)
    await checkAuthAndReturnPlayer(ctx);
    const missions = parseDatabaseResponse({
      response: await getAdditionalMissions(),
      normalize: toCamelCase,
    });
    const areas = [];
    missions.forEach((item) => {
      if (_.indexOf(areas, item.area) === -1) {
        areas.push(item.area);
      }
    });
    await ctx.replyWithMarkdown(
      messages.areaSelectMessage(),
      keyboards.areaSelectKeyboard(areas),
    );
  },
  area: async (ctx) => {
    try {
      await checkAuthAndReturnPlayer(ctx);
      const message = _.get(ctx, `message.text`);
      const areaFromState = _.get(ctx, `scene.state.area`);
      const area = message.indexOf(`: `) !== -1 ? _.last(_.split(message, `: `)) : areaFromState;
      console.log(`area`, area);
      if (!area) return ctx.reply(`Произошла ошибка во входе в место`, keyboards.homeKeyboard());
      ctx.scene.state.area = area;
      const missions = parseDatabaseResponse({
        response: await getAdditionalMissionsArea({ area }),
        normalize: toCamelCase,
      });
      const sections = [];
      missions.forEach((item) => {
        if (_.indexOf(sections, item.section) === -1) {
          sections.push(item.section);
        }
      });

      if (!_.size(missions)) return ctx.reply(`Произошла ошибка`, keyboards.homeKeyboard());
      await ctx.replyWithMarkdown(
        messages.sectionSelectMessage(),
        keyboards.sectionSelectKeyboard(sections),
      );
    } catch (e) {
      console.log(e);
      ctx.reply(`Произошла ошибка во входе в миссии в доме`);
    }
  },
  section: async (ctx) => {
    try {
      const chatId = _.get(ctx, `chat.id`);
      await checkAuthAndReturnPlayer(ctx);
      const area = _.get(ctx, `scene.state.area`);
      const sectionFromState = _.get(ctx, `scene.state.section`);
      const message = _.get(ctx, `message.text`);
      const section = message.indexOf(`: `) !== -1 ? _.last(_.split(message, `: `)) : sectionFromState;
      console.log(`section`, section);
      if (!area || !section) return ctx.reply(`Ошибка входа в секцию`, keyboards.homeKeyboard());
      ctx.scene.state.section = section;
      const actions = parseDatabaseResponse({
        response: await getAdditionalMissionsSection({ area, section }),
        normalize: toCamelCase,
      });
      if (!_.size(actions)) return ctx.reply(`Нет доступных действий`, keyboards.homeKeyboard());

      const actionNames = [];

      for (const item of actions) {
        const currentMissionStatusRowResponse = parseDatabaseResponse({
          response: await getMissionStatusRow({ chatId, missionId: item.id }),
          normalize: toCamelCase,
        });
        const currentMissionStatusRow = _.first(currentMissionStatusRowResponse);
        console.log(`currentMissionStatusRow`, currentMissionStatusRow);
        const isCompleted = _.get(currentMissionStatusRow, `isCompleted`) === 1;
        console.log(`isCompleted`, isCompleted);
        let isCompletable = false;
        console.log(`completable when`, item.completableWhen);
        console.log(`completable when length`, item.completableWhen.length);
        if (item.completableWhen && item.completableWhen.length > 2) { // TODO: Make it good
          isCompletable = await isActionCompletable({ chatId, completableWhenArray: item.completableWhen });
        }

        const actionNameField = isCompletable ? `actionCompleted` : `actionDefault`;

        actionNames.push(`${item[actionNameField]} (${isCompleted ? emoji.check : `${item.resource}${emoji.ram}`})`);
      }

      await ctx.replyWithMarkdown(
        messages.actionSelectMessage(),
        keyboards.actionSelectKeyboard(actionNames),
      );
    } catch (e) {
      console.log(e);
      ctx.reply(`Ошибка внутри секции`);
    }
  },
  action: async (ctx) => {
    console.log(`Enter action`);
    const chatId = ctx.chat.id;
    const player = await checkAuthAndReturnPlayer(ctx);
    const message = _.get(ctx, `message.text`);
    const actionFromState = _.get(ctx, `scene.state.action`);
    const action = message.indexOf(`: `) !== -1
      ? _.last(_.split(message, `: `)).replace(/(\s\(.*\))$/gi, ``)
      : actionFromState;
    const area = _.get(ctx, `scene.state.area`);
    const section = _.get(ctx, `scene.state.section`);
    if (!area || !section || !action) return ctx.reply(`Ошибка входа в действие`, keyboards.homeKeyboard());
    ctx.scene.state.action = action;
    console.log(`action`, action);
    const actionResponse = parseDatabaseResponse({
      response: await getAdditionalMissionsAction({ area, section, action }),
      normalize: toCamelCase,
    });
    const actionObject = _.first(actionResponse);
    const currentMissionStatusRowResponse = parseDatabaseResponse({
      response: await getMissionStatusRow({ chatId, missionId: actionObject.id }),
      normalize: toCamelCase,
    });
    const currentMissionStatusRow = _.first(currentMissionStatusRowResponse);

    const isMissionCompleted = _.get(currentMissionStatusRow, `isCompleted`) === 1;
    if (!isMissionCompleted) {
      const availableRam = getRamValueById(player.ramId);
      const usedRam = player.ramUsed;
      if ((availableRam - usedRam) < actionObject.resource) {
        return ctx.reply(`Недостаточно оперативной памяти для выполнения действия`, keyboards.homeKeyboard());
      }
      await addUsedRamOfPlayer({ chatId, ramAmount: actionObject.resource, timestamp: +new Date() });
      const isSuccessUsedRamUpdate = parseDatabaseUpdateResponse({
        response: await increaseUsedRam({ chatId, ramAmount: actionObject.resource }),
      });
      if (!isSuccessUsedRamUpdate) {
        return ctx.reply(`Ошибка при обновлении оперативной памяти`, keyboards.homeKeyboard());
      }
    }

    if (isMissionCompleted) {
      return ctx.reply(actionObject.storyCompleted || actionObject.storyDefault, keyboards.backKeyboard());
    }

    if (actionObject.accessCode) {
      ctx.scene.state.passwordAttempts = 3;
      return ctx.reply(actionObject.storyProtected, keyboards.backKeyboard());
    }
    const isCompletable = await isActionCompletable({ chatId, completableWhenArray: actionObject.completableWhen });

    if (isCompletable) {
      await markMissionAsCompleted({ chatId, missionId: actionObject.id });
      ctx.reply(actionObject.storyCompleted || actionObject.storyDefault, keyboards.backKeyboard());
    } else {
      ctx.reply(actionObject.storyDefault, keyboards.backKeyboard());
    }


  },
  message: async (ctx) => {
    console.log(`Handling message`);
    const chatId = ctx.chat.id;
    const player = await checkAuthAndReturnPlayer(ctx);
    const message = _.get(ctx, `message.text`);

    const area = _.get(ctx, `scene.state.area`);
    const section = _.get(ctx, `scene.state.section`);
    const action = _.get(ctx, `scene.state.action`);
    if (!area || !section || !action || !message) return ctx.scene.reenter();

    const actionResponse = parseDatabaseResponse({
      response: await getAdditionalMissionsAction({ area, section, action }),
      normalize: toCamelCase,
    });
    const actionObject = _.first(actionResponse);

    if (!actionObject.accessCode) return ctx.scene.reenter();

    if (!ctx.scene.state.passwordAttempts || ctx.scene.state.passwordAttempts <= 1) {
      return ctx.reply(messages.maxCodeAttemptsMessage(), keyboards.backKeyboard());
    }

    if (message.toLowerCase() !== actionObject.accessCode.toLowerCase()) {
      ctx.reply(messages.wrongCodeMessage({
        story: actionObject.storyWrongCode,
        attempts: ctx.scene.state.passwordAttempts
      }), keyboards.backKeyboard());
      ctx.scene.state.passwordAttempts -= 1;
      return;
    }
    await markMissionAsCompleted({ chatId, missionId: actionObject.id });
    ctx.reply(actionObject.storyDefault, keyboards.backKeyboard());
  },
  reEnter: (ctx) => ctx.scene.reenter(),
  enterScene: (sceneName) => (ctx) => ctx.scene.enter(sceneName),
}
