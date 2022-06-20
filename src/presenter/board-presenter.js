import { remove, render } from '../framework/render.js';
import SortingFormView from '../view/sorting-view.js';
import AddNewWaypointFormView from '../view/add-new-waypoint-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import EmptyListMessageView from '../view/empty-list-view.js';
import { FilterType, SortingMode, UpdateType, UserAction } from '../const.js';
import { getWeightForTime, getWeightForPrice, getWeightForDay, filter} from '../utils.js';
import AddNewWaypointPresenter from './add-new-waypoint-presenter.js';

export default class BoardPresenter {
  #mainContainer = document.querySelector('.trip-events');
  #sortComponent = new SortingFormView();
  #addNewWayointComponent = new AddNewWaypointFormView();
  #waypointsList = new WaypointsListView();
  #emptyListComponent = null;
  #waypointsModel = null;
  #filtersModel = null;
  #waypointsPresenters = new Map();
  #addNewWaypointPresenter = null;
  #currentSortType = SortingMode.DAY;
  #currentFilterType = null;

  constructor(waypointsModel, filtersModel) {
    this.#waypointsModel = waypointsModel;
    this.#filtersModel = filtersModel;

    this.#addNewWaypointPresenter = new AddNewWaypointPresenter(this.#waypointsList.element, this.#handleViewAction);

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get waypoints() {
    this.#currentFilterType = this.#filtersModel.filter;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[this.#currentFilterType](waypoints);

    switch(this.#currentSortType) {
      case SortingMode.TIME:
        return filteredWaypoints.sort(getWeightForTime);
      case SortingMode.PRICE:
        return filteredWaypoints.sort(getWeightForPrice);
      default:
        return filteredWaypoints.sort(getWeightForDay);
    }
  }

  createWaypoint = (callback) => {
    this.#currentSortType = SortingMode.DAY;
    this.#filtersModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#addNewWaypointPresenter.init(callback);
  };

  #renderSortingComponent = () => {
    render(this.#sortComponent, this.#mainContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderWaypointsList = () => {
    render(this.#waypointsList, this.#mainContainer);
  };

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#handleViewAction, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointsPresenters.set(waypoint.id, waypointPresenter);
  };

  #renderEmptyListMessage = () => {
    this.#emptyListComponent = new EmptyListMessageView(this.#currentFilterType);
    render(this.#emptyListComponent, this.#mainContainer);
  };

  #renderWaypoints = () => {
    const waypoints = this.waypoints;
    if (waypoints.length === 0) {
      if (this.#emptyListComponent){
        remove(this.#emptyListComponent);
      }
      this.#renderEmptyListMessage();
    } else {
      if (this.#emptyListComponent){
        remove(this.#emptyListComponent);
      }
      for (let i = 0; i < waypoints.length; i++) {
        this.#renderWaypoint(waypoints[i]);
      }
    }
  };

  #renderBoard = () => {
    this.#renderSortingComponent();
    this.#renderWaypointsList();
    this.#renderWaypoints();
  };

  #clearWaypointsList = () => {
    this.#addNewWaypointPresenter.destroy();
    this.#waypointsPresenters.forEach((presenter) => presenter.destroyComponent());
    this.#waypointsPresenters.clear();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_TASK:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#waypointsModel.deleteWaypoint(updateType, update);
    }
  };

  #handleModelEvent = (updateType, waypoint) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#waypointsPresenters.get(waypoint.id).init(waypoint);
        break;
      case UpdateType.MINOR:
        this.#clearWaypointsList();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearWaypointsList();
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#addNewWaypointPresenter.destroy();
    this.#waypointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearWaypointsList();
    this.#renderWaypoints();
  };
}
