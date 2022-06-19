import dayjs from 'dayjs';
import { FilterType } from './const.js';

export const getRandomInt = (max) => Math.floor(Math.random() * max);
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export const getWeightForDay = (firstItem, secondItem) => dayjs(firstItem.dateTo).diff(dayjs(secondItem.dateTo), 'seconds');

export const getWeightForPrice = (firstItem, secondItem) => secondItem.basePrice - firstItem.basePrice;

export const getWeightForTime = (firstItem, secondItem) => {
  const firstGap = dayjs(firstItem.dateTo).diff(dayjs(firstItem.dateFrom), 'seconds');
  const secondGap = dayjs(secondItem.dateTo).diff(dayjs(secondItem.dateFrom), 'seconds');

  return secondGap - firstGap;
};

const isPointPassed = (dateTo) => dateTo && dayjs().isAfter(dateTo, 'D'); // точки у которых дата окончания меньше, чем текущая.
const isPointFutured =(dateFrom) => dateFrom && dayjs().isBefore(dateFrom, 'D'); //дата начала события больше или равна текущей дате
const isPointInProgress = (dateFrom, dateTo) => dayjs().isAfter(dateFrom, 'D') && dayjs().isBefore(dateTo, 'D'); //отображаются во всех трёх списках

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointPassed(point.dateTo) || isPointInProgress(point.dateFrom, point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFutured(point.dateFrom) || isPointInProgress(point.dateFrom, point.dateTo))
};
