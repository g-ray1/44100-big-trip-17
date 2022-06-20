import { getRandomWaypoint, offersPlusTypes } from '../mock/waypoint.js';
import Observable from '../framework/observable.js';

export default class RandomWaypoints extends Observable {
  #waypoints = Array.from({length: 10}, getRandomWaypoint);

  get waypoints() {
    this.#waypoints.forEach((waypoint) => {
      const nesessaryOffers = offersPlusTypes.find((item) => item.type === waypoint.type);
      waypoint.offers = nesessaryOffers.offers;
    });

    return this.#waypoints;
  }

  addWaypoint = (updateType, update) => {
    this.#waypoints = [
      ...this.#waypoints,
      update,
    ];

    this._notify(updateType, update);
  };

  updateWaypoint = (updateType, update) => {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  deleteWaypoint = (updateType, update) => {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
