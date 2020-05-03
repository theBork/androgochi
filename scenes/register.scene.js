const _ = require('lodash');

const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const { createNewPlayer } = require(`../models/player.model`);
const { getSystemNames, getSystemId } = require(`../models/system.model`);
const { welcomeMessage, nameSelectionMessage } = require(`../models/layout/messages/register`);
// TODO: Create register controller-scene implementation
const beforeNameSelectionStep = async (ctx) => {
  const message = `${welcomeMessage()}\n\n${nameSelectionMessage()}`;
  await ctx.replyWithMarkdown(message);
  return ctx.wizard.next();
}

const nameSelectionStep = ctx => {
  const name = _.get(ctx, `message.text`);
  if (!name) return ctx.reply(`Не введено имя. Введите еще раз`);
  if (_.size(name) > 16) return ctx.reply(`Имя слишком длинное. Попробуйте другое`);
  ctx.scene.state.playerName = name;
  ctx.replyWithMarkdown(
    `Отлично. Твоего Андроида будут звать *${name}*.\nКакой тип операционной системы установить на андроида?
    `,
    Markup.keyboard(getSystemNames()).oneTime().resize().extra(),
  );
  return ctx.wizard.next();
}

const typeSelectionStep = async (ctx) => {
  const system = _.get(ctx, `message.text`);
  if (!system) return ctx.reply(`Не выбран тип ОС.`);
  const chatId = _.get(ctx, `message.chat.id`);
  const playerName = _.get(ctx, `scene.state.playerName`);
  const systemId = getSystemId(system);
  try {
    await createNewPlayer({ chatId, playerName, systemId });
  } catch (e) {
    console.log(e);
    ctx.reply(`Ошибка при создании персонажа.`);
    return ctx.scene.reenter();
  }
  await ctx.replyWithMarkdown(`Устанавливаем ОС *${system}*. Подождите...`);
  await setTimeout(() => {
    ctx.reply(`Система установлена. Ваш андроид готов к работе.`)
    return ctx.scene.enter(`information`);
  }, 3000);
}


const registerScene = new WizardScene(
  `register`,
  beforeNameSelectionStep,
  nameSelectionStep,
  typeSelectionStep
);

module.exports = registerScene;
