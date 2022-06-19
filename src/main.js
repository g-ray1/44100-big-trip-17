import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import RandomWaypoints from './model/waypoint-model.js';
import FiltersModel from './model/filters-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import NewPointButtonView from './view/new-event-button-view.js';

const waypointsModel = new RandomWaypoints();
const filtersModel = new FiltersModel();
const newWaypointButtonComponent = new NewPointButtonView();

const filtersContainer = document.querySelector('.trip-controls__filters');
const newWaypointButtonContainer = document.querySelector('.trip-main');
const filtersPresenter = new FiltersPresenter(filtersContainer, filtersModel);
const boardPresenter = new BoardPresenter(waypointsModel, filtersModel);

const handleNewWaypointFormClose = () => {
  newWaypointButtonComponent.element.disabled = false;
};

const handleNewWaypointButtonClick = () => {
  boardPresenter.createWaypoint(handleNewWaypointFormClose);
  newWaypointButtonComponent.element.disabled = true;
};

render(newWaypointButtonComponent, newWaypointButtonContainer);
newWaypointButtonComponent.setClickHandler(handleNewWaypointButtonClick);

filtersPresenter.init();
boardPresenter.init();
