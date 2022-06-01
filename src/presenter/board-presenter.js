import { render } from '../framework/render.js';
import FiltersFormView from '../view/filters-view.js';
import SortingFormView from '../view/sorting-view.js';
import AddNewWaypointFormView from '../view/add-new-waypoint-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import EmptyListMessage from '../view/empty-list-view.js';
import { updateItem } from '../utils.js';

export default class BoardPresenter {
  #filtersContainer = document.querySelector('.trip-controls__filters');
  #mainContainer = document.querySelector('.trip-events');
  #filtersComponent = new FiltersFormView();
  #sortComponent = new SortingFormView();
  #addNewWayointComponent = new AddNewWaypointFormView();
  #waypointsList = new WaypointsListView();
  #emptyList = new EmptyListMessage();
  #waypoints = null;
  #waypointsPresenters = new Map();

  init(waypoints) {
    this.#waypoints = waypoints.waypoints;
    this.#renderFiltersComponent();
    this.#renderSortingComponent();
    this.#renderWaypointsList();

    if (this.#waypoints.length === 0) {
      this.#renderEmptyListMessage();
    } else {
      for (let i = 0; i < this.#waypoints.length; i++) {
        const waypointPresenter = new WaypointPresenter(this.#handleWaypointChange, this.#handleModeChange);
        waypointPresenter.init(this.#waypoints[i]);
        this.#waypointsPresenters.set(this.#waypoints[i].id, waypointPresenter);
      }
    }

    this.#renderAddNewWaypointComponent();
  }

  #renderFiltersComponent = () => {
    render(this.#filtersComponent, this.#filtersContainer);
  };

  #renderSortingComponent = () => {
    render(this.#sortComponent, this.#mainContainer);
  };

  #renderWaypointsList = () => {
    render(this.#waypointsList, this.#mainContainer);
  };

  #renderEmptyListMessage = () => {
    render(this.#emptyList, this.#mainContainer);
  };

  #renderAddNewWaypointComponent = () => {
    render(this.#addNewWayointComponent, this.#mainContainer);
  };

  #handleWaypointChange = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint);
    this.#waypointsPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #handleModeChange = () => {
    this.#waypointsPresenters.forEach((presenter) => presenter.resetView());
  };
}
