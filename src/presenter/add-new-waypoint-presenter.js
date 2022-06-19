import { remove, render, RenderPosition } from '../framework/render.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../const.js';
import AddNewWaypointView from '../view/add-new-waypoint-view.js';

export default class AddNewWaypointPresenter {
  #waypointsContainer = null;
  #changeData = null;
  #destroyCallback = null;
  #addNewWaypointComponent = null;

  constructor(waypointsContainer, changeData) {
    this.#waypointsContainer = waypointsContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    this.#addNewWaypointComponent = new AddNewWaypointView();

    this.#addNewWaypointComponent.setSubmitHandler(this.#formSubmitHandler);
    this.#addNewWaypointComponent.setCancelClickHandler(this.#formCancelHandler);

    render(this.#addNewWaypointComponent, this.#waypointsContainer, RenderPosition.BEFOREBEGIN);
    document.addEventListener('keydown', this.#setEscDownHandler);
  };

  destroy = () => {
    if (this.#addNewWaypointComponent === null) {
      return;
    }

    this.#destroyCallback();
    remove(this.#addNewWaypointComponent);
    this.#addNewWaypointComponent = null;
    document.removeEventListener('keydown', this.#setEscDownHandler);
  };

  #formSubmitHandler = (waypoint) => {
    this.#changeData(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      {id: nanoid(), ...waypoint},
    );
    this.destroy();

  };

  #formCancelHandler = () => {
    this.destroy();
  };

  #setEscDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this.#setEscDownHandler);
    }
  };
}
