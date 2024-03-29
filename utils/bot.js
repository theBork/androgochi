const { BOT_ENDPOINT } = require(`../constants`);
console.log(`Bot init start`);
const Telegraf = require(`telegraf`);
const bot = new Telegraf(process.env.TOKEN);

bot.telegram.setWebhook(process.env.WEBHOOK_DOMAIN + BOT_ENDPOINT).then((result) => {
  if (result) {
    return console.log(`Webhook on URL ${process.env.WEBHOOK_DOMAIN + BOT_ENDPOINT} successfully added.`)
  }
  console.log(`Error while setting webhook.`);
});
module.exports = bot; // TODO: Learn more about exports in place code

const Telegram = require(`telegraf/telegram`);
const telegram = new Telegram(process.env.TOKEN)

const information = require('../scenes/information.scene');
const shop = require('../scenes/shop/index.scene');
const motherboard = require('../scenes/shop/motherboard.scene');
const processor = require('../scenes/shop/processor.scene');
const ram = require('../scenes/shop/ram.scene');
const disk = require('../scenes/shop/disk.scene');
const videoCard = require('../scenes/shop/videoCard.scene');
const battery = require('../scenes/shop/battery.scene');
const adapter = require('../scenes/shop/adapter.scene');
const rating = require('../scenes/rating.scene');
const exchange = require('../scenes/exchange.scene');
const registerScenes = require('../scenes/register.scene');
const session = require('telegraf/session')
const Stage = require('telegraf/stage')

const stage = new Stage([
  information,
  shop,
  motherboard,
  processor,
  ram,
  disk,
  videoCard,
  battery,
  adapter,
  registerScenes,
  rating,
  exchange
]);

bot.use(session());
bot.use(stage.middleware());

bot.start(Stage.enter(`information`));

bot.command('/register', Stage.enter(`register`));

bot.on('message', (ctx) => {
  return ctx.scene.enter('information');
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

