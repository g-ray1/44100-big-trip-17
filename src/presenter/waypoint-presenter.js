import {render, replace, remove} from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';
import WaypointView from '../view/waypoint-view.js';
import EditWaypointFormView from '../view/edit-waypoint-view.js';

export default class WaypointPresenter {
  #waypoint = null;
  #offers = null;
  #destinations = null;
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

  init = (waypoint, offers, destinations) => {
    this.#waypoint = waypoint;
    this.#offers = offers;
    this.#destinations = destinations;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView(this.#waypoint, this.#offers);
    this.#waypointEditComponent =  new  EditWaypointFormView(this.#waypoint, this.#offers, this.#destinations);

    this.#waypointComponent.setClickHandler(this.#rollDownClickHandler);
    this.#waypointComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#waypointEditComponent.setClickHandler(this.#rollUpClickHandler);
    this.#waypointEditComponent.setSubmitHandler(this.#formSubmitHandler);
    this.#waypointEditComponent.setDeleteClickHandler(this.#formDeleteHandler);

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

  destroyComponent = () => {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  };

  #replaceWaypointToEditForm = () => {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditFormToWaypoint = () => {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    this.#mode = Mode.DEFAULT;
  };

  #rollDownClickHandler = () => {
    this.#replaceWaypointToEditForm();
    document.addEventListener('keydown', this.#setDownHandler);
  };

  #rollUpClickHandler = () => {
    this.#waypointEditComponent.reset();
    this.#replaceEditFormToWaypoint();
    document.removeEventListener('keydown', this.#setDownHandler);
  };

  #formSubmitHandler = (waypoint) => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      waypoint,
    );

    document.removeEventListener('keydown', this.#setDownHandler);
  };

  #formDeleteHandler = (waypoint) => {
    this.#changeData(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      waypoint,
    );
    this.#replaceEditFormToWaypoint();
    document.removeEventListener('keydown', this.#setDownHandler);
  };

  #setDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#waypointEditComponent.reset();
      this.#replaceEditFormToWaypoint();
      document.removeEventListener('keydown', this.#setDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      { ...this.#waypoint, isFavorite: !this.#waypoint.isFavorite },
    );
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#waypointEditComponent.reset();
      this.#replaceEditFormToWaypoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#waypointEditComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
  };
}
