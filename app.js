require(`dotenv`).config();
const express = require(`express`);
const app = express();

const { startNotificationScheduler, scheduleGameNotifications } = require(`./utils/cron`);
const heapAnalyze = require(`./utils/heapAnalyzer`);
console.log(`app init`);
const bot = require(`./utils/bot`);
const { BOT_ENDPOINT } = require(`./constants`);
app.use(bot.webhookCallback(BOT_ENDPOINT));

startNotificationScheduler(bot);
scheduleGameNotifications();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/memory', (req, res) => {
  res.json(process.memoryUsage());
})

app.get('/analyze', (req, res) => {
  const memoryStatus = heapAnalyze.analyze();
  res.send(memoryStatus);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
})

