import Observable from '../framework/observable';
import { FilterType } from '../const.js';

export default class FiltersModel extends Observable {
  #filterType = FilterType.EVERYTHING;

  get filter() {
    return this.#filterType;
  }

  setFilter = (updateType, filterType) => {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  };
}
