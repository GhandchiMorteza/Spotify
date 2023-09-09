class LibraryView {
  private static instance: LibraryView | null = null;
  parentElenent: HTMLElement;
  libraryNav: HTMLDivElement;
  likedSongsItem: HTMLDivElement;
  filterAlbum: HTMLInputElement;
  filterArtist: HTMLInputElement;
  private constructor() {
    this.parentElenent = document.getElementById("page-library")
      ?.firstElementChild as HTMLElement;
    this.libraryNav = this.parentElenent.querySelector(
      "#libraryNav"
    ) as HTMLDivElement;
    this.likedSongsItem = this.parentElenent.querySelector(
      "#itemLikedSong"
    ) as HTMLDivElement;
    this.filterAlbum = this.parentElenent.querySelector(
      "#filter-album"
    ) as HTMLInputElement;
    this.filterArtist = this.parentElenent.querySelector(
      "#filter-artist"
    ) as HTMLInputElement;

    this.libraryNav.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.hasAttribute("data-route")) {
        const event = new CustomEvent("go", {
          detail: {
            page: target.getAttribute("data-route"),
          },
        });
        window.dispatchEvent(event);
      }
    });

    this.likedSongsItem.addEventListener("click", (e) => {
      const event = new CustomEvent("go", {
        detail: {
          page: this.likedSongsItem.getAttribute("data-route"),
        },
      });
      window.dispatchEvent(event);
    });
  }
  static getInstance() {
    if (!LibraryView.instance) {
      LibraryView.instance = new LibraryView();
    }
    return LibraryView.instance;
  }
  updateDOM(data: string) {
    this.deactivePreSubPage();

    const activeSubPage = document.getElementById(data.replace(/\//g, ""));
    if (activeSubPage) {
      activeSubPage.classList.add("active-library");
    }
  }
  deactivePreSubPage() {
    const prevActiveSubPage =
      this.parentElenent.querySelector(".active-library");
    if (prevActiveSubPage) {
      prevActiveSubPage.classList.remove("active-library");
    }
  }
}

export default LibraryView;
