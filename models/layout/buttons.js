const emoji = require(`../../utils/emoji`);

//Common scenes
module.exports.back = `${emoji.back} Назад`;

//Information scene
module.exports.idle = `${emoji.sun} Отдыхать`;
module.exports.refresh = `${emoji.refresh} Обновить`;
module.exports.statistic = `${emoji.statistic} Статистика`;
module.exports.missions = `${emoji.rainbow} Миссии`;
module.exports.mining = `${emoji.work} Майнить`;
module.exports.startCharging = `${emoji.check} Поставить на зарядку`;
module.exports.cancelCharging = `${emoji.cancel} Убрать с зарядки`;
module.exports.shop = `${emoji.shop} Магазин`;
module.exports.exchange = `${emoji.bank} Обмен валют`;

//Exchange scene
module.exports.cryptoToVirtual = `${emoji.bank}${emoji.money} Робокоины в роборубли`;
module.exports.virtualToCrypto = `${emoji.money}${emoji.bank} Роборубли в робокоины`;
module.exports.decline = `${emoji.x} Отменить`;
