import { createElement } from '../render.js';

const createWaypointsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class WaypointsListView {
  #element = null;

  get template() {
    return createWaypointsListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }
}
