const _ = require(`lodash`);

const _objectToCamelCase = (obj) => {
  const camelCasedObj = {};
  if (!_.isObject(obj)) return obj;
  for (const [key, value] of Object.entries(obj)) {
    camelCasedObj[_.camelCase(key)] = value;
  }
  return camelCasedObj;
};

module.exports = {
  objectToCamelCase: (obj) => { // TODO: Replace this function to universal "toCamelCase"
    const camelCasedObj = {};
    if (!_.isObject(obj)) return obj;
    for (const [key, value] of Object.entries(obj)) {
      camelCasedObj[_.camelCase(key)] = value;
    }
    return camelCasedObj;
  },
  toCamelCase: (data) => {
    if (_.isArray(data)) return _.map(data, (item) => _objectToCamelCase(item));
    return _objectToCamelCase(data);
  },
  getVoltageLevelInPercents: ({ batteryValue, voltageValue }) => {
    return `${_.ceil(voltageValue / (batteryValue / 100))}%`;
  },
  parseResponse: ({ response, normalize }) => {
    if (!_.get(response, `ok`)) throw new Error(`False response`);
    const data = _.get(response, `data`);
    return _.isFunction(normalize) ? normalize(data) : data;
  },
  parseError: (ctx, { error, defaultMessage = `Произошла ошибка` }) => {
    console.log(error);
    ctx.reply(defaultMessage);
    ctx.scene.enter(`information`);
  },
  parseDatabaseUpdateResponse: ({ response }) => _.get(response, `effectedRows`) === 1,
  calculateDischargingResult: ({ amperage, start, end }) => {
    const calculatingTime = end - start;
    // console.log(`Discharging result input: `, amperage, calculatingTime);
    if (calculatingTime <= 0) return 0;
    const amperagePerMs = amperage / 60 / 60 / 1000;
    const result = _.ceil(amperagePerMs * calculatingTime, 4);
    // console.log(`Discharging result output: `, result);
    return result;
  },
  getChargingTime: ({ adapterValue, batteryValue, startValue }) => {
    const chargedValue = batteryValue - startValue;
    const amperagePerMs = adapterValue / 60 / 60 / 1000;
    return chargedValue / amperagePerMs;
  },
  calculateChargingResult: ({ adapterValue, start, end }) => {
    const calculatingTime = end - start;
    // console.log(`Charging result input: `, adapterValue, calculatingTime);
    if (calculatingTime <= 0) return 0;

    const amperagePerMs = adapterValue / 60 / 60 / 1000;
    const result = _.floor(amperagePerMs * calculatingTime, 4);
    // console.log(`Charging result output: `, result);
    return result;
  },
  calculateMiningResultWhenTurnedOff: ({ performance, amperage, startVoltageValue }) => {
    const amperagePerMs = amperage / 60 / 60 / 1000;
    const miningTime = startVoltageValue / amperagePerMs;
    // console.log(`Turned off result input: `, performance, amperagePerMs, startVoltageValue, miningTime);
    if (miningTime <= 0) return 0;
    const result = _.floor(miningTime / 1000 * performance, 2);
    // console.log(`Turned off result output: `, result);
    return result;
  },
  calculateMiningResult: ({ performance, start, end }) => {
    const miningTime = end - start;
    // console.log(`Mining result input: `, performance, miningTime);
    if (miningTime <= 0) return 0;
    const result = _.floor(miningTime / 1000 * performance, 2);
    // console.log(`Mining result output: `, result);
    return result;
  },
  getBuyCommandRegexp: () => new RegExp(/^\/buy_[0-9]/),
}
