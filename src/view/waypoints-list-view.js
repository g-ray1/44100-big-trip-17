import AbstractView from '../framework/view/abstract-view.js';

const createWaypointsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class WaypointsListView extends AbstractView {
  get template() {
    return createWaypointsListTemplate();
  }
}
