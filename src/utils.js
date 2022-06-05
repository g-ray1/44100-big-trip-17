import dayjs from 'dayjs';

export const getRandomInt = (max) => Math.floor(Math.random() * max);
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const getWeightForPrice = (firstItem, secondItem) => {
  if (firstItem.basePrice > secondItem.basePrice) {
    return -1;
  } else if (firstItem.basePrice < secondItem.basePrice) {
    return 1;
  } else {
    return 0;
  }
};

export const getWeightForTime = (firstItem, secondItem) => {
  const firstGap = dayjs(firstItem.dateTo).diff(dayjs(firstItem.dateFrom), 'seconds');
  const secondGap = dayjs(secondItem.dateTo).diff(dayjs(secondItem.dateFrom), 'seconds');

  if (firstGap > secondGap) {
    return -1;
  } else if (firstGap < secondGap) {
    return 1;
  } else {
    return 0;
  }
};
