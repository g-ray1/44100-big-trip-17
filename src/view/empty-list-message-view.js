import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const emptyListMessages = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createEmptyListMessageTemplate = (filterType) => {
  const emptyListMessage = emptyListMessages[filterType];

  return `<p class="trip-events__msg">${emptyListMessage}</p>`;
};

export default class EmptyListMessageView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListMessageTemplate(this.#filterType);
  }
}
