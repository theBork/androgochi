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

const _ = require(`lodash`);

const information = require('./controllers/scenes/information.scene');
const rating = require('./controllers/scenes/rating.scene');
const registerScenes = require('./controllers/scenes/register.scene');

const { getPlayerByChatId } = require(`./controllers/player.controller`);

const session = require('telegraf/session')
const Stage = require('telegraf/stage')

const stage = new Stage([].concat(information, registerScenes, rating));

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
