import BoardPresenter from './presenter/board-presenter.js';
import RandomWaypoints from './model/waypoint-model.js';

const waypoints = new RandomWaypoints();
const boardPresenter = new BoardPresenter();

boardPresenter.init(waypoints);
