require(`dotenv`).config();
const express = require(`express`);
const app = express();

const Telegraf = require(`telegraf`);
const bot = new Telegraf(process.env.TOKEN);

const botPath = `/secret-path`;
app.use(bot.webhookCallback(botPath))
bot.telegram.setWebhook(process.env.WEBHOOK_DOMAIN + botPath).then((result) => {
  if (result) return console.log(`Webhook on URL ${process.env.WEBHOOK_DOMAIN + botPath} successfully added.`)
  console.log(`Error while setting webhook.`);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
})

const information = require('./scenes/information.scene');
const shop = require('./scenes/shop.scene');
const rating = require('./scenes/rating.scene');
const exchange = require('./scenes/exchange.scene');
const registerScenes = require('./scenes/register.scene');

const session = require('telegraf/session')
const Stage = require('telegraf/stage')

const stage = new Stage([information, shop, registerScenes, rating, exchange]);

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
