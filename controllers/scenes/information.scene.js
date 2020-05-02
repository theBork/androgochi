const emoji = require(`../../utils/emoji`);

const Scene = require('telegraf/scenes/base')

const _ = require(`lodash`);

const { getPlayerByChatId, setChargeStatus, setMiningStatus, sendInformationMessage } = require(`../player.controller`);
const { updateStatus } = require(`../status.controller`);
const { getStatusIdByType } = require(`../../models/status.model`);
const { parseResponse, objectToCamelCase } = require(`../../utils/helper`);

const information = new Scene(`information`);

information.enter(async (ctx) => {
  await updateStatus({ chatId: ctx.chat.id });
  const player = parseResponse({ response: await getPlayerByChatId(ctx.chat.id), normalize: objectToCamelCase });
  if (!player) {
    return ctx.scene.enter('register');
  }

  await sendInformationMessage({ ctx, player });
});

information.hears(`${emoji.check} Поставить на зарядку`, async (ctx) => {
  try {
    const statusId = getStatusIdByType(`charge`);
    await updateStatus({ chatId: ctx.chat.id, newStatusId: statusId });
    return ctx.scene.reenter();
  } catch (e) {
    console.log(e);
    ctx.reply(`Ошибка в постановке на зарядку`);
    return ctx.scene.reenter();
  }
});

information.hears(`${emoji.cancel} Убрать с зарядки`, async (ctx) => {
  try {
    const response = await setMiningStatus(ctx.chat.id);
    if (!response.ok) throw new Error(`False response`);
    return ctx.scene.reenter();
  } catch (e) {
    console.log(e);
    ctx.reply(`Ошибка в постановке на зарядку`);
    return ctx.scene.reenter();
  }
});

information.hears(`${emoji.refresh} Обновить`, (ctx) => ctx.scene.reenter());
information.hears(`${emoji.statistic} Статистика`, (ctx) => ctx.scene.enter(`rating`));
information.hears(`${emoji.shop} Магазин`, (ctx) => {
  ctx.reply(`Магазин пока не работает`);
  ctx.scene.reenter();
});
information.hears(`${emoji.bank} Обмен валют`, (ctx) => {
  ctx.reply(`Обмен валют пока не работает`);
  ctx.scene.reenter();
});

information.on('message', (ctx) => ctx.scene.reenter());

module.exports = [information];
