import { getRandomWaypoint, offersPlusTypes } from '../mock/waypoint.js';

export default class RandomWaypoints {
  waypoints = Array.from({length: 10}, getRandomWaypoint);

  getWaypoints = () => {
    this.waypoints.forEach((waypoint) => {
      for (const item of offersPlusTypes) {
        if (waypoint.type === item.type) {
          waypoint.offers = item.offers;
          break;
        }
      }
    });

    return this.waypoints;
  };
}
