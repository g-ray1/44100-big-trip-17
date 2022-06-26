import { remove, render, replace } from '../framework/render.js';
import { UpdateType } from '../const.js';
import FiltersFormView from '../view/filters-form-view';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtesModel = null;
  #fitersComponent = null;

  constructor(filtersContainer, filtersModel) {
    this.#filtersContainer = filtersContainer;
    this.#filtesModel = filtersModel;

    this.#filtesModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFiltersComponent = this.#fitersComponent;

    this.#fitersComponent = new FiltersFormView(this.#filtesModel.filter);
    this.#fitersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      this.#renderFiltersComponent();
      return;
    }
    replace(this.#fitersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  };

  #renderFiltersComponent = () => {
    render(this.#fitersComponent, this.#filtersContainer);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtesModel.filterType === filterType) {
      return;
    }

    this.#filtesModel.setFilter(UpdateType.MINOR, filterType);
  };
}
