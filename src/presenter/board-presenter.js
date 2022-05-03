import { render } from '../render.js';
import FiltersFormView from '../view/filters-view.js';
import SortingFormView from '../view/sorting-view.js';
import AddNewWaypointFormView from '../view/add-new-waypoint-view.js';
import EditWaypointFormView from '../view/edit-waypoint-view.js';
import WaypointView from '../view/waypoint-view.js';

export default class BoardPresenter {
  filtersContainer = document.querySelector('.trip-controls__filters');
  contentList = document.querySelector('.trip-events');

  init(waypoints) {
    this.waypoints = waypoints.getWaypoints();

    render(new FiltersFormView, this.filtersContainer);
    render(new SortingFormView, this.contentList);
    render(new EditWaypointFormView(this.waypoints[0]), this.contentList);
    for (let i = 1; i < this.waypoints.length; i++) {
      render(new WaypointView(this.waypoints[i]), this.contentList);
    }
    render(new AddNewWaypointFormView, this.contentList);
  }
}
