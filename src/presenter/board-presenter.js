import { render } from '../framework/render.js';
import FiltersFormView from '../view/filters-view.js';
import SortingFormView from '../view/sorting-view.js';
import AddNewWaypointFormView from '../view/add-new-waypoint-view.js';
import EditWaypointFormView from '../view/edit-waypoint-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import WaypointView from '../view/waypoint-view.js';
import EmptyListMessage from '../view/empty-list-view.js';

export default class BoardPresenter {
  #filtersContainer = document.querySelector('.trip-controls__filters');
  #mainContainer = document.querySelector('.trip-events');
  #waypoints = null;

  init(waypoints) {
    this.#waypoints = waypoints.waypoints;
    render(new FiltersFormView, this.#filtersContainer);
    render(new SortingFormView, this.#mainContainer);
    render(new WaypointsListView, this.#mainContainer);
    for (let i = 0; i <= this.#waypoints.length - 1; i++) {
      if (this.#waypoints.length === 0) {
        render(new EmptyListMessage, this.#mainContainer);
        break;
      }
      this.#renderWaypoint(this.#waypoints[i]);
    }
    render(new AddNewWaypointFormView, this.#mainContainer);
  }

  #renderWaypoint = (waypoint) => {
    const waypointsList = document.querySelector('.trip-events__list');
    const waypointComponent = new WaypointView(waypoint);
    const waypointEditComponent =  new  EditWaypointFormView(waypoint);

    const replaceWaypointToEditForm = () => {
      waypointsList.replaceChild(waypointEditComponent.element, waypointComponent.element);
    };
    const replaceEditFormToWaypoint = () => {
      waypointsList.replaceChild(waypointComponent.element, waypointEditComponent.element);
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToWaypoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    waypointComponent.setClickHandler(() => {
      replaceWaypointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });
    waypointEditComponent.setClickHandler(() => {
      replaceEditFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });
    waypointEditComponent.setSubmitHandler(() => {
      replaceEditFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(waypointComponent, waypointsList);
  };
}


