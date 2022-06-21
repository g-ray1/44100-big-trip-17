import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import FiltersModel from './model/filters-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import NewPointButtonView from './view/new-event-button-view.js';
import WaypointsApiService from './waypoints-api-service.js';

const AUTHORIZATION = 'Basic asofio234iy';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const waypointsModel = new WaypointsModel(new WaypointsApiService(END_POINT, AUTHORIZATION));
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

filtersPresenter.init();
boardPresenter.init();
waypointsModel.init()
  .finally(() => {
    render(newWaypointButtonComponent, newWaypointButtonContainer);
    newWaypointButtonComponent.setClickHandler(handleNewWaypointButtonClick);
  });
