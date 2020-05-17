const emoji = require(`../../../utils/emoji`);
const { getRandomNumber } = require(`../../../utils/helpers/common`);
const _ = require(`lodash`);

const chargingCompleteFirstParts = [
  `Моя батарея полностью заряжена.`,
  `Я зарядился.`,
  `Зарядка самого технологичного андроида (меня) завершена.`,
  `Я полностью заряжен.`,
];

const chargingCompleteSecondParts = [
  `Готов майнить.`,
  `Время для майнинга.`,
  `Настало время творть великие дела.`,
  `Что будем делать?`,
  `Время прокачиваться.`,
]

const dischargingFirstParts = [
  `Достигнут полный разряд.`,
  `Я полностью разрядился.`,
  `Во мне больше нет энергии.`,
  `Недостаточно энергии для работы.`,
];

const dischargingSecondParts = [
  `Выключаюсь.`,
  `Не могу ничего делать.`,
  `Бездействую.`,
  `Необходима зарядка`,
  `Пожалуйста, подключи меня к зарядке.`,
]

const fullDiskFirstParts = [
  `Жесткий диск переполнен.`,
  `Недостаточно места на жестком диске.`,
  `Переполнен жесткий диск.`,
  `Больше нет места на жестком диске.`,
];

const fullDiskSecondParts = [
  `Не могу майнить.`,
  `Некуда сохранять робокоины.`,
  `Нужна очистка диска.`,
  `Необходимо освободить место`,
]

module.exports = {
  chargingCompleteMessage: () => {
    const randomFirstPartIndex = Math.abs(getRandomNumber(0, chargingCompleteFirstParts.length - 1));
    const randomSecondPartIndex = Math.abs(getRandomNumber(0, chargingCompleteSecondParts.length - 1));
    return `${chargingCompleteFirstParts[randomFirstPartIndex]} ${chargingCompleteSecondParts[randomSecondPartIndex]}`;
  },
  dischargingMessage: () => {
    const randomFirstPartIndex = Math.abs(getRandomNumber(0, dischargingFirstParts.length - 1));
    const randomSecondPartIndex = Math.abs(getRandomNumber(0, dischargingSecondParts.length - 1));
    return `${dischargingFirstParts[randomFirstPartIndex]} ${dischargingSecondParts[randomSecondPartIndex]}`;
  },
  fullDiskMessage: () => {
    const randomFirstPartIndex = Math.abs(getRandomNumber(0, fullDiskFirstParts.length - 1));
    const randomSecondPartIndex = Math.abs(getRandomNumber(0, fullDiskSecondParts.length - 1));
    return `${fullDiskFirstParts[randomFirstPartIndex]} ${fullDiskSecondParts[randomSecondPartIndex]}`;
  },
  exchangeVirtualToCryptoMessage: () => `Какое количество роборублей перевести в робокоины?`,
  exchangeSessionExpiredMessage: () => `Время на обмен по данному курсу истекло.`,
  exchangeNotNumberMessage: () => `Введено некорректное число.`,
  exchangeBigNumberMessage: () => `Введено число больше имеющегося.`,
  exchangeLowDiskSpaceMessage: () => `На вашем жестком диске недостаточно места для обмена.`,
  exchangeErrorMessage: () => `Ошибка во время обмена валют.`,
}
