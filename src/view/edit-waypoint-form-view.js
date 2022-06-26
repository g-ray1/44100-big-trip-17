import AbstrAbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const getDestinations = (destinations) => {
  let destinationsList = '';

  destinations.forEach((destination) => {
    destinationsList += `
      <option value="${destination.name}"></option>
    `;
  });

  return destinationsList;
};

const getPictures = (destination) => (
  `
    ${destination ? destination.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('') : ''}
  `
);

const createEditWaypointFormTemplate = (state, offersList, destinationsList) => {
  const {destination, type, basePrice, dateFrom, dateTo, isDisabled, isSaving, isDeleting} = state;
  const timeIn = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const timeOut = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const getOffers = function () {

    const currentOffers = offersList.find((offersGroup) => offersGroup.type === type);

    return currentOffers.offers.map((offer) => {

      const checked = state.offers.includes(offer.id) ? 'checked' : '';
      const offersTitleList = offer.title.split(' ');
      const nameOfferForId = offersTitleList[offersTitleList.length-1];

      return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" data-id="${offer.id}" ${isDisabled ? 'disabled' : ''} id="event-offer-${nameOfferForId}-1" type="checkbox" name="event-offer-luggage" ${checked}></input>
    <label class="event__offer-label" for="event-offer-${nameOfferForId}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;}).join('');};

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1"}>
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi"
                    ${type === 'taxi' ? 'checked' : ''}
                    >
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus"
                    ${type === 'bus' ? 'checked' : ''}
                  >
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train"
                    ${type === 'train' ? 'checked' : ''}
                  >
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship"
                    ${type === 'ship' ? 'checked' : ''}
                  >
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive"
                    ${type === 'drive' ? 'checked' : ''}
                  >
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight"
                    ${type === 'flight' ? 'checked' : ''}
                  >
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in"
                    ${type === 'check-in' ? 'checked' : ''}
                  >
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing"
                    ${type === 'sightseeing' ? 'checked' : ''}
                  >
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant"
                    ${type === 'restaurant' ? 'checked' : ''}
                  >
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
              value="${he.encode(destination.name)}" list="destination-list-1"
            >
            <datalist id="destination-list-1">
              ${getDestinations(destinationsList)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" ${isDisabled ? 'disabled' : ''} value="${timeIn}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" ${isDisabled ? 'disabled' : ''} value="${timeOut}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" ${isDisabled ? 'disabled' : ''} value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${getOffers()}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container">
	            <div class="event__photos-tape">
                ${getPictures(destination)}
	            </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class EditWaypointFormView extends AbstrAbstractStatefulView {
  #datepicker = null;
  #sourcedWaypoint = null;
  #offersList = [];
  #destinationsList = [];

  constructor(waypoint, offers, destinations) {
    super();
    this.#sourcedWaypoint = {...waypoint};
    this._state = EditWaypointFormView.parseWaypointToState(waypoint);
    this.#offersList = offers;
    this.#destinationsList = destinations;
    this.#setInnerHandlers();
  }

  get template() {
    return createEditWaypointFormTemplate(this._state, this.#offersList, this.#destinationsList);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteWaypoint = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  };

  reset = () => {
    this.updateElement(
      this.#sourcedWaypoint,
    );

  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.deleteWaypoint);
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
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#handleToggleOffer);
    this.element.querySelector('.event__field-group.event__field-group--price').addEventListener('change', this.#handlePriceChange);
    this.#setDateFromPicker();
    this.#setDateToPicker();
  };

  #handleToggleOffer = (evt) => {
    const id = Number(evt.target.dataset.id);

    if(!isNaN(id)) {
      const offers = this._state.offers;

      if(offers.includes(id)) {
        this.updateElement({
          offers: offers.filter((elem) => elem !== id)
        });
      } else {
        this.updateElement({
          offers: [...offers, id]
        });
      }
    }
  };

  #handlePriceChange = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: parseInt(evt.target.value, 10),
    });
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._state.offers = [];
    this._callback.click();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(EditWaypointFormView.parseStateToWaypoint(this._state));
  };

  #deleteClickHandler = () => {
    this._callback.deleteWaypoint(EditWaypointFormView.parseStateToWaypoint(this._state));
  };

  #changeWaypointTypeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    const newType = evt.target.innerText.toLowerCase();

    if (newType === this._state.type) {
      return;
    }

    this.updateElement({
      type: newType,
      offers: [],
    });
  };

  #changeDestinationHandler = (evt) => {
    const newDestination = evt.target.value;
    const destinationData = this.#destinationsList.find((destination) => destination.name === newDestination);

    this.updateElement({
      destination: {
        name: newDestination,
        description: destinationData.description,
        pictures: destinationData.pictures,
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

  static parseWaypointToState = (waypoint) => ({...waypoint,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToWaypoint = (state) => {
    const waypoint = {...state};

    delete waypoint.isDisabled;
    delete waypoint.isSaving;
    delete waypoint.isDeleting;

    return waypoint;
  };
}
