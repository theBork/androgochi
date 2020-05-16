const emoji = require(`../../../utils/emoji`);
const _ = require(`lodash`);

module.exports = {
  missionsSelectMessage: () => {
    return `Сюжетные миссии активны в течении определенного периода. Как правило - месяц.` +
      `\nНаучные миссии позволяют изучать новые типы деталей для вашего андроида.`
  },
  areaSelectMessage: () => `Сюжетные миссии активны в течении определенного периода. Как правило - месяц.`,
  sectionSelectMessage: () => `Выберите место, в которое хотите отправиться`,
  actionSelectMessage: () => `Выберите действие, которое хоите выполнить`,
  maxCodeAttemptsMessage: () => `Превышено количество попыток ввода кода`,
  wrongCodeMessage: ({ story, attempts }) => `${story}\n\nОсталось попыток ввода: ${attempts}`,
}
