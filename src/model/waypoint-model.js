import { getRandomWaypoint, offersPlusTypes } from '../mock/waypoint.js';

export default class RandomWaypoints {
  #waypoints = Array.from({length: 10}, getRandomWaypoint);

  get waypoints() {
    this.#waypoints.forEach((waypoint) => {
      const nesessaryOffers = offersPlusTypes.find((item) => item.type === waypoint.type);
      waypoint.offers = nesessaryOffers.offers;
    });

    return this.#waypoints;
  }
}
