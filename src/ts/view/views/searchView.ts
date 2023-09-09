import { ContainerClass } from "../classes/containerClass";

class SearchView {
  private static instance: SearchView | null = null;
  parentElenent: HTMLElement;
  recentSection: HTMLElement;
  searchResultSection: HTMLElement;
  Searchbar: HTMLInputElement;
  SearchCancelBtn: HTMLButtonElement;
  private constructor() {
    this.parentElenent = document.getElementById("page-search") as HTMLElement;

    this.recentSection = this.parentElenent.querySelector(
      "#recent-section"
    ) as HTMLElement;

    this.searchResultSection = this.parentElenent.querySelector(
      "#search-results"
    ) as HTMLElement;

    this.Searchbar = this.parentElenent.querySelector(
      "#searchGeneral"
    ) as HTMLInputElement;
    this.SearchCancelBtn = this.parentElenent.querySelector(
      ".search-bar__btn--cancel"
    ) as HTMLButtonElement;
  }
  static getInstance() {
    if (!SearchView.instance) {
      SearchView.instance = new SearchView();
    }
    return SearchView.instance;
  }

  initDOM() {
    this.activateRecentSection();

    this.SearchCancelBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.Searchbar.value = "";

      this.activateRecentSection();
    });

    this.Searchbar.addEventListener("input", (event) => {
      const inputElement = event.target as HTMLInputElement;

      const searchTerm = inputElement.value;

      if (searchTerm === "") {
        this.activateRecentSection();
      } else {
        this.activateResultSection();
      }

      const searchEvent = new CustomEvent("search", { detail: searchTerm });
      window.dispatchEvent(searchEvent);
    });
  }

  activateRecentSection() {
    if (this.searchResultSection.classList.contains("is-active")) {
      this.searchResultSection.classList.remove("is-active");
    }
    if (!this.recentSection.classList.contains("is-active")) {
      this.recentSection.classList.add("is-active");
    }
  }
  activateResultSection() {
    if (this.recentSection.classList.contains("is-active")) {
      this.Searchbar.value = this.Searchbar.value + " ";
      this.Searchbar.value = this.Searchbar.value.slice(0, -1);
      this.recentSection.classList.remove("is-active");
    }
    if (!this.searchResultSection.classList.contains("is-active")) {
      this.searchResultSection.classList.add("is-active");
    }
  }
}

export default SearchView;
