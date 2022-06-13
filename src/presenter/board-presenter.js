import { render } from '../framework/render.js';
import FiltersFormView from '../view/filters-view.js';
import SortingFormView from '../view/sorting-view.js';
import AddNewWaypointFormView from '../view/add-new-waypoint-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import EmptyListMessage from '../view/empty-list-view.js';
import { updateItem } from '../utils.js';
import { SortingMode } from '../const.js';
import { getWeightForTime, getWeightForPrice} from '../utils.js';

export default class BoardPresenter {
  #filtersContainer = document.querySelector('.trip-controls__filters');
  #mainContainer = document.querySelector('.trip-events');
  #filtersComponent = new FiltersFormView();
  #sortComponent = new SortingFormView();
  #addNewWayointComponent = new AddNewWaypointFormView();
  #waypointsList = new WaypointsListView();
  #emptyList = new EmptyListMessage();
  #waypoints = [];
  #sourcedWaypoints = [];
  #waypointsPresenters = new Map();

  #currentSortType = SortingMode.DAY;

  init(waypoints) {
    console.log(waypoints);
    this.#waypoints = waypoints.waypoints;
    this.#sourcedWaypoints = [...this.#waypoints];
    this.#renderFiltersComponent();
    this.#renderSortingComponent();
    this.#renderWaypointsList();

    this.#renderWaypoints();

    this.#renderAddNewWaypointComponent();
  }

  #renderFiltersComponent = () => {
    render(this.#filtersComponent, this.#filtersContainer);
  };

  #renderSortingComponent = () => {
    render(this.#sortComponent, this.#mainContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderWaypointsList = () => {
    render(this.#waypointsList, this.#mainContainer);
  };

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#handleWaypointChange, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointsPresenters.set(waypoint.id, waypointPresenter);
  };

  #renderEmptyListMessage = () => {
    render(this.#emptyList, this.#mainContainer);
  };

  #renderWaypoints = () => {
    if (this.#waypoints.length === 0) {
      this.#renderEmptyListMessage();
    } else {
      for (let i = 0; i < this.#waypoints.length; i++) {
        this.#renderWaypoint(this.#waypoints[i]);
      }
    }
  };

  #renderAddNewWaypointComponent = () => {
    render(this.#addNewWayointComponent, this.#mainContainer);
  };

  #clearWaypointsList = () => {
    this.#waypointsPresenters.forEach((presenter) => presenter.destroyComponent());
    this.#waypointsPresenters.clear();
  };

  #sortWaypoints = (sortType) => {
    switch(sortType) {
      case SortingMode.TIME:
        this.#waypoints.sort(getWeightForTime);
        break;
      case SortingMode.PRICE:
        this.#waypoints.sort(getWeightForPrice);
        break;
      default:
        this.#waypoints = [...this.#sourcedWaypoints];
    }

    this.#currentSortType = sortType;
  };

  #handleWaypointChange = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint);
    this.#waypointsPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #handleModeChange = () => {
    this.#waypointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortWaypoints(sortType);
    this.#clearWaypointsList();
    this.#renderWaypoints();
  };
}
