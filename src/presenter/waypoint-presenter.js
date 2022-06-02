import {render, replace, remove} from '../framework/render.js';
import WaypointView from '../view/waypoint-view.js';
import EditWaypointFormView from '../view/edit-waypoint-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypoint = null;
  #waypointsList = document.querySelector('.trip-events__list');
  #waypointComponent = null;
  #waypointEditComponent = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(changeData, changeMode) {
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (waypoint) => {
    this.#waypoint = waypoint;
    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView(this.#waypoint);
    this.#waypointEditComponent =  new  EditWaypointFormView(this.#waypoint);

    this.#waypointComponent.setClickHandler(this.#rollDownClickHandler);
    this.#waypointComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#waypointEditComponent.setClickHandler(this.#rollUpClickHandler);
    this.#waypointEditComponent.setSubmitHandler(this.#formSubmitHandler);

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointsList);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  };

  #destroyComponent = () => {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  };

  #replaceWaypointToEditForm = () => {
    this.#waypointsList.replaceChild(this.#waypointEditComponent.element, this.#waypointComponent.element);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditFormToWaypoint = () => {
    this.#waypointsList.replaceChild(this.#waypointComponent.element, this.#waypointEditComponent.element);
    this.#mode = Mode.DEFAULT;
  };

  #rollDownClickHandler = () => {
    this.#replaceWaypointToEditForm();
    document.addEventListener('keydown', this.#setDownHandler);
  };

  #rollUpClickHandler = () => {
    this.#replaceEditFormToWaypoint();
    document.removeEventListener('keydown', this.#setDownHandler);
  };

  #formSubmitHandler = () => {
    this.#changeData(this.#waypoint);
    this.#replaceEditFormToWaypoint();
    document.removeEventListener('keydown', this.#setDownHandler);
  };

  #setDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditFormToWaypoint();
      document.removeEventListener('keydown', this.#setDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    this.#changeData({ ...this.#waypoint, isFavorite: !this.#waypoint.isFavorite });
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToWaypoint();
    }
  };
}
