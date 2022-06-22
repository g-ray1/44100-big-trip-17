import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class WaypointsModel extends Observable {
  #waypointsApiService = null;
  #waypoints = [];
  #offers = [];
  #destinations = [];

  constructor(waypointsApiService) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;
      const offers = await this.#waypointsApiService.offers;
      const destinations = await this.#waypointsApiService.destinations;

      this.#waypoints = waypoints.map(this.#adaptToClient);
      this.#offers = offers.map(this.#adaptToClient);
      this.#destinations = destinations.map(this.#adaptToClient);

      this.#waypoints.forEach((waypoint) => {
        const destinationDataByCityName = destinations.find((item) => item.name === waypoint.destination.name);
        waypoint.destination.description = destinationDataByCityName.description;
        waypoint.destination.pictures = destinationDataByCityName.pictures;

      });
    } catch(err) {
      this.#waypoints = [];
    }

    this._notify(UpdateType.INIT);
  };

  #adaptToClient = (waypoint) => {

    const adaptedWaypoint = {...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'],
      dateTo: waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['is_favorite'];


    return adaptedWaypoint;
  };

  addWaypoint = async (updateType, update) => {
    try {
      const response = await this.#waypointsApiService.addPoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        newWaypoint,
        ...this.#waypoints,
      ];

      this._notify(updateType, newWaypoint);
    } catch(err) {
      throw new  Error('Can\'t add waypoint');
    }
  };

  updateWaypoint = async (updateType, update) => {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    try {
      const response = await this.#waypointsApiService.updatePoint(update);
      const updatedWaypoint = this.#adaptToClient(response);

      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  };

  deleteWaypoint = async (updateType, update) => {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      await this.#waypointsApiService.deletePoint(update);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }

  };
}
