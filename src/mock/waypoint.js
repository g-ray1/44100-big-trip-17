import { getRandomElement, getRandomInt } from '../utils.js';
import dayjs from 'dayjs';

const waypointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const citysNames = ['Moskow', 'Tokio', 'Paris', 'Rome', 'New York'];
const lorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus.'
];

//функция генерации офферов
const generateOffers = (count) => {
  const offers = [];
  for (let i = 0; i < count; i++) {
    offers.push(
      {
        id: getRandomInt(100),
        title: `Offer №${getRandomInt(100)}`,
        price: getRandomInt(100),
      }
    );
  }
  return offers;
};

//генерируем офферы для каждого типа точки маршрута
export const offersPlusTypes = [];
for (const type of waypointTypes) {
  offersPlusTypes.push(
    {
      type,
      offers: generateOffers(1 + getRandomInt(3)),
    }
  );
}

//функции генерации  дат
const maxDaysGap = 7;
const maxMinutesGap = 2880;
const getDateFrom = () => {
  const daysGap = getRandomInt(maxDaysGap) + getRandomInt(-maxDaysGap);
  return dayjs().add(daysGap, 'day').toDate();
};

const getDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomInt(maxMinutesGap), 'minutes').toDate();

//функция генерации случайной точки маршрута
export const getRandomWaypoint = () => {
  const dateFrom = getDateFrom();
  const dateTo = getDateTo(dateFrom);

  return {
    basePrice: getRandomInt(1000),
    dateFrom,
    dateTo,
    destination: {
      description: [...Array(5)].map(() => getRandomElement(lorem)).join(''),
      name: getRandomElement(citysNames),
      pictures: [
        {
          src: `http://picsum.photos/248/152?r=${Math.random()}`,
          description: getRandomElement(lorem),
        }
      ]
    },
    id: getRandomInt(100),
    isFavorite: Boolean(Math.round(Math.random() * 1)),
    type: getRandomElement(waypointTypes),
    offers: null,
  };
};
