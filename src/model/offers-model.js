import { offersPlusTypes } from '../mock/waypoint.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = null;

  constructor() {
    super();
    this.#offers = offersPlusTypes;
  }

  get offers() {
    return this.#offers;
  }

  addOffer = (updateType, update) => {
    this.#offers = [
      ...this.#offers,
      update,
    ];

    this._notify(updateType, update);
  };

  updateOffer = (updateType, update) => {
    const index = this.#offers.findIndex((waypoint) => waypoint.id === update.id);

    this.#offers = [
      ...this.#offers.slice(0, index),
      update,
      ...this.#offers.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  deleteOffer = (updateType, update) => {
    const index = this.#offers.findIndex((waypoint) => waypoint.id === update.id);

    this.#offers = [
      ...this.#offers.slice(0, index),
      ...this.#offers.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
