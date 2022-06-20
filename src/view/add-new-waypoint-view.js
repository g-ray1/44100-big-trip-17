import AbstrAbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { citysNames, offersPlusTypes, getRandomDescription, getRandomPic } from '../mock/waypoint.js';
import he from 'he';

const DEFAULT_STATE = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  isFavorite: false,
  destination: null,
  offers: [],
  type: 'taxi',
};

const getDestinations = () => {
  let destinations = '';
  citysNames.forEach((city) => {
    destinations += `
      <option value="${city}"></option>
    `;
  });
  return destinations;
};

const getWaypointOffers = (offers) => {
  let waypointOffers = '';
  offers.forEach((offer) => {
    waypointOffers += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" checked>
        <label class="event__offer-label" for="event-offer-${offer.title}-1">
          <span class="event__offer-title">Add ${offer.title}</span>
            &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  });
  return waypointOffers;
};

const createAddNewWaypointFormTemplate = (state) => {
  const {destination, type, basePrice, offers, dateFrom, dateTo} = state;
  const timeIn = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const timeOut = dayjs(dateTo).format('DD/MM/YY HH:mm');

  return  `
            <li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        <div class="event__type-item">
                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
                      value="${destination ? he.encode(destination.name) : ''}" list="destination-list-1"
                    >
                    <datalist id="destination-list-1">
                      ${getDestinations()}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeIn}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeOut}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${getWaypointOffers(offers)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">
                      ${destination ? destination.description : ''}
                    </p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        <img class="event__photo"
                          src="${destination ? destination.pictures[0].src : ''}"
                          alt="${destination ? destination.pictures[0].description : ''}"
                        >
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
};

export default class AddNewWaypointView extends AbstrAbstractStatefulView {
  #datepicker = null;

  constructor(offers, listDestinations) {
    super();
    this._state = {...DEFAULT_STATE};
    this.offers = offers;
    this.listDestinations = listDestinations;

    this.#setInnerHandlers();
  }

  get template() {
    return createAddNewWaypointFormTemplate(this._state);
  }

  static parseStateToWaypoint = (state) => ({...state});

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#handleSubmitClick);
  };

  #handleSubmitClick = (evt) => {
    evt.preventDefault();
    this._callback.submit(AddNewWaypointView.parseStateToWaypoint(this._state));
  };

  setCancelClickHandler = (callback) => {
    this._callback.cancel = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#handleCancelClick);
  };

  #handleCancelClick = () => {
    this._callback.cancel();
  };

  #changeWaypointTypeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    const newType = evt.target.innerText.toLowerCase();
    const offersByType = offersPlusTypes.find((item) => item.type === newType).offers;

    this.updateElement({
      type: newType,
      offers: offersByType,
    });
  };

  #changeDestinationHandler = (evt) => {
    const newDestination = evt.target.value;
    this.updateElement({
      destination: {
        name: newDestination,
        description: getRandomDescription(5),
        pictures: getRandomPic(),
      }
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #setDateFromPicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        allowInput: true,
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      }
    );
  };

  #setDateToPicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        allowInput: true,
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      }
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#changeWaypointTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
    this.#setDateFromPicker();
    this.#setDateToPicker();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setCancelClickHandler(this._callback.cancel);
  };
}
