import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

const createWaypointTemplate = (waypoint) => {
  const {destination, isFavorite, type, basePrice, offers, dateFrom, dateTo} = waypoint;
  const favorite = isFavorite ? 'event__favorite-btn--active' : '';

  //форматируем даты ивента
  const dateTimeIn = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const dateTimeOut = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');
  const day = dayjs(dateFrom).format('MMM DD');
  const timeIn = dayjs(dateFrom).format('HH:mm');
  const timeOut = dayjs(dateTo).format('HH:mm');

  //форматируем длительность ивента
  const timeGap = dayjs(dateTo).diff(dayjs(dateFrom), 'seconds');
  const timeGapInDays = Math.floor(timeGap / SECONDS_IN_DAY);
  const timeGapInHours = Math.floor((timeGap - timeGapInDays * SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const timeGapInMinutes = Math.floor((timeGap - timeGapInDays * SECONDS_IN_DAY - timeGapInHours * SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  let eventDuration = '';

  if (timeGapInDays > 0) {
    eventDuration = `0${timeGapInDays}D `;
  }
  label: if (timeGapInHours > 0) {
    if (timeGapInHours === 0) {
      eventDuration += '00H';
      break label;
    }
    if (timeGapInHours < 10) {
      eventDuration += `0${timeGapInHours}H `;
      break label;
    }
    eventDuration += `${timeGapInHours}H `;
  }
  label: if (timeGapInMinutes > 0) {
    if (timeGapInMinutes === 0) {
      eventDuration += '00M';
      break label;
    }
    if (timeGapInMinutes < 10) {
      eventDuration += `0${timeGapInMinutes}M `;
      break label;
    }
    eventDuration += `${timeGapInMinutes}M `;
  }

  //добавляем оферы в разметку
  let waypointOffers = '';
  offers.forEach((offer) => {
    waypointOffers += `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `;
  });

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateTimeIn}">${timeIn}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTimeOut}">${timeOut}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${waypointOffers}
        </ul>
        <button class="event__favorite-btn ${favorite}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class WaypointView extends AbstractView {
  #waypoint = null;

  constructor(waypoint) {
    super();
    this.#waypoint = waypoint;
  }

  get template() {
    return createWaypointTemplate(this.#waypoint);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteButtonClick();
  };
}
