import { remove, render } from '../framework/render.js';
import SortingFormView from '../view/sorting-form-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import EmptyListMessageView from '../view/empty-list-message-view.js';
import { FilterType, SortingMode, UpdateType, UserAction, BlockTimeLimit } from '../const.js';
import { getWeightForTime, getWeightForPrice, getWeightForDay, filter} from '../utils.js';
import AddNewWaypointPresenter from './add-new-waypoint-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #mainContainer = document.querySelector('.trip-events');
  #sortComponent = null;
  #waypointsListContainer = new WaypointsListView();
  #loadingComponent = new LoadingView();
  #emptyListComponent = null;

  #waypointsModel = null;
  #filtersModel = null;
  #waypointsPresenters = new Map();
  #addNewWaypointPresenter = null;

  #currentSortType = SortingMode.DAY;
  #currentFilterType = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker(BlockTimeLimit.LOWER_LIMIT, BlockTimeLimit.UPPER_LIMIT);

  constructor(waypointsModel, filtersModel) {
    this.#waypointsModel = waypointsModel;
    this.#filtersModel = filtersModel;
    this.#addNewWaypointPresenter = new AddNewWaypointPresenter(this.#waypointsListContainer.element, this.#handleViewAction);

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
    this.#addNewWaypointPresenter.init(callback, this.#waypointsModel);
  };

  #renderSortingComponent = () => {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortingFormView(this.#currentSortType);
    render(this.#sortComponent, this.#mainContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderWaypointsList = () => {
    render(this.#waypointsListContainer, this.#mainContainer);
  };

  #renderWaypoint = (waypoint, offers, destinations) => {
    const waypointPresenter = new WaypointPresenter(this.#handleViewAction, this.#handleModeChange);
    waypointPresenter.init(waypoint, offers, destinations);
    this.#waypointsPresenters.set(waypoint.id, waypointPresenter);
  };

  #renderEmptyListMessage = () => {
    this.#emptyListComponent = new EmptyListMessageView(this.#currentFilterType);
    render(this.#emptyListComponent, this.#mainContainer);
  };

  #renderWaypoints = () => {
    const waypoints = this.waypoints;
    const offers = this.#waypointsModel.offers;
    const destinations = this.#waypointsModel.destinations;

    if (waypoints.length === 0) {
      if (this.#emptyListComponent){
        remove(this.#emptyListComponent);
      }
      this.#renderEmptyListMessage();
    } else {
      if (this.#emptyListComponent){
        remove(this.#emptyListComponent);
      }
      for (const waypoint of waypoints) {
        this.#renderWaypoint(waypoint, offers, destinations);
      }
    }
  };

  #renderBoard = () => {
    this.#renderSortingComponent();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderWaypointsList();
    this.#renderWaypoints();
  };

  #clearWaypointsList = () => {
    this.#addNewWaypointPresenter.destroy();
    this.#waypointsPresenters.forEach((presenter) => presenter.destroyComponent());
    this.#waypointsPresenters.clear();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#mainContainer);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch(actionType) {
      case UserAction.UPDATE_TASK:
        this.#waypointsPresenters.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch(err) {
          this.#waypointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#addNewWaypointPresenter.setSaving();
        try {
          await this.#waypointsModel.addWaypoint(updateType, update);
        } catch(err) {
          this.#addNewWaypointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TASK:
        this.#waypointsPresenters.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.deleteWaypoint(updateType, update);
        } catch(err) {
          this.#waypointsPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    this.#renderBoard();
  };
}
