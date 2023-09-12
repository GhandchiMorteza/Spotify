import { PageClass } from "./classes/pageClass";
import { PageEnum } from "../config";
import AlbumView from "./views/albumView";
import LibraryView from "./views/libraryView";
import PlayerView from "./views/playerView";
import ArtistView from "./views/artistView";
import SearchView from "./views/searchView";
import { ContainerClass } from "./classes/containerClass";

class ViewSingleton {
  private static instance: ViewSingleton;

  private pages: { [key: string]: PageClass<HTMLElement, HTMLElement> } = {};
  private currentPageData: Array<any> | undefined;
  visible!: boolean;

  private constructor(private pagesContainer: HTMLElement) {}

  static getInstance(): ViewSingleton {
    if (!ViewSingleton.instance) {
      ViewSingleton.instance = new ViewSingleton(
        document.getElementById("pages-container") as HTMLElement
      );
    }
    return ViewSingleton.instance;
  }

  renderPageElement(route: string, visible: boolean = true): void {
    this.visible = visible;

    // Deactivate the previously active page element.
    if (visible) {
      this.deactivePrePage();
    }
    let pageRoute = route;

    const nav = document.querySelector("nav.main-nav");
    nav?.classList.remove("display-none");

    const boxPlayerElement = document.getElementById(
      "box-player"
    ) as HTMLElement;

    if (boxPlayerElement) {
      boxPlayerElement.classList.remove("display-none");
    }

    const isLibraryRoute =
      route === PageEnum.artists || route === PageEnum.playlists;
    if (isLibraryRoute) {
      pageRoute = PageEnum.albums;
    } else if (route.startsWith(PageEnum.player)) {
      pageRoute = PageEnum.player;
    }

    // Get the page element from the DOM, if it exists.
    let pageElement = document.body.querySelector(
      `[data-page="${
        route.startsWith(PageEnum.player) || isLibraryRoute ? pageRoute : route
      }"]`
    ) as HTMLElement | null;

    if (pageElement) {
      if (!pageElement.classList.contains("is-active") && visible) {
        pageElement.classList.add("is-active");
        pageElement.scrollTop = 0;
      }
      this.requestPageData(
        route.startsWith(PageEnum.player) ? route : pageRoute
      );

      this.updatePageContent(route);
      return;
    }

    // The page element doesn't exist yet, so we need to create it.
    this.requestPageData(route.startsWith(PageEnum.player) ? route : pageRoute);
    const newPage = new PageClass(
      pageRoute.replace(/\//g, "").replace(/\d/g, ""), // templateId
      this.pagesContainer.id, // hostId
      pageRoute, // dataPage
      this.currentPageData as any, // modelData
      visible
    );
    this.pages[pageRoute] = newPage;
    this.createPageContent(route);
  }

  /**
   * Access a page by its route (pageRoute).
   * @param pageRoute The route (pageRoute) of the page want to access.
   * @returns The PageClass instance associated with the specified pageRoute.
   */
  accessPage(
    pageRoute: string
  ): PageClass<HTMLElement, HTMLElement> | undefined {
    return this.pages[pageRoute];
  }

  createPageContent(route: string) {
    const isLibraryPage =
      route === PageEnum.albums ||
      route === PageEnum.artists ||
      route === PageEnum.playlists;
    if (isLibraryPage) {
      const libView = LibraryView.getInstance();
      const albumsContainer = this.getContainerById(
        "albumsContainerItmes"
      ) as ContainerClass<any, any>;
      const artistContainer = this.getContainerById(
        "artistsContainerItmes"
      ) as ContainerClass<any, any>;

      libView.filterAlbum.addEventListener("input", (event) =>
        albumsContainer.filterItems(
          "vertical-tracks__song-title",
          (event.target as HTMLInputElement).value.toLowerCase()
        )
      );
      libView.filterArtist.addEventListener("input", (event) =>
        artistContainer.filterItems(
          "artist-name",
          (event.target as HTMLInputElement).value.toLowerCase()
        )
      );
    } else if (route === PageEnum.search) {
      const searchView = SearchView.getInstance();
      searchView.initDOM();
    }
    this.updatePageContent(route);
  }

  /**
   * Loop through all pages and containers to find the specified container by ID.
   * @param containerId The ID of the container you want to access.
   * @returns The ContainerClass instance associated with the specified container ID across all pages.
   */
  getContainerById(
    containerId: string
  ): ContainerClass<HTMLElement, HTMLElement> | undefined {
    for (const pageRoute in this.pages) {
      const page = this.pages[pageRoute];
      if (page && page.pageContainers[containerId]) {
        return page.pageContainers[containerId];
      }
    }
    return undefined;
  }

  /**
   * Add an item to a specific container by its ID.
   * @param containerId The ID of the container where you want to add the item.
   * @param itemData The data for the item you want to add.
   */
  addItemToContainer(containerId: string, itemData: any) {
    // Get the container by ID using getContainerById
    const container = this.getContainerById(containerId);

    if (container) {
      // Use the container's method to add the item
      container.addItem(itemData);
    }
  }

  removeItemFromContainerByDataUrl(containerId: string, url: any) {
    // Get the container by ID using getContainerById
    const container = this.getContainerById(containerId);

    if (container) {
      // Use the container's method to add the item
      container.removeItemByDataUrl(url);
    }
  }

  updatePageContent(route: string) {
    switch (route) {
      case PageEnum.home:
      case "/":
        break;
      case PageEnum.search:
        const searchView = SearchView.getInstance();
        searchView.activateRecentSection();
        break;
      case PageEnum.albums:
        const libraryview = LibraryView.getInstance();

        libraryview.updateDOM(route);
        break;
      case PageEnum.artists:
        const libraryView = LibraryView.getInstance();
        libraryView.updateDOM(route);
        break;
      case PageEnum.playlists:
        const libraryView2 = LibraryView.getInstance();
        libraryView2.updateDOM(route);
        break;
      case PageEnum.likedSongs:
        break;
      case PageEnum.likedAlbums:
        break;
      case PageEnum.artist:
        break;
      default:
        // ArtistView
        if (route.startsWith(PageEnum.album)) {
          const albumview = AlbumView.getInstance();
          albumview.updateDOM(this.currentPageData![1] as any);
        } else if (route.startsWith(PageEnum.player)) {
          const playerview = PlayerView.getInstance();
          playerview.updateDOM(this.currentPageData as any);

          const nav = document.querySelector("nav.main-nav");
          if (this.visible) {
            nav?.classList.add("display-none");
          }
          const boxPlayerElement = document.getElementById(
            "box-player"
          ) as HTMLElement;
          if (this.visible) {
            boxPlayerElement.classList.add("display-none");
          }
        } else if (route.startsWith(PageEnum.artist)) {
          const artistview = ArtistView.getInstance();
          artistview.updateDOM(this.currentPageData![1]);
        }
    }
  }

  /**
   * Deactivates the previously active page element.
   */
  deactivePrePage() {
    const prevActivePages = this.pagesContainer.querySelectorAll(".is-active");
    for (const prevActivePage of prevActivePages) {
      prevActivePage.classList.remove("is-active");
    }

    // Select element with data-page attribute starting with "/album/"
    const albumPageToRemove = document.querySelector('[data-page^="/album/"]');
    if (albumPageToRemove) {
      albumPageToRemove.remove();
    }

    // Select element with data-page attribute starting with "/aritist/"
    const artistPageToRemove = document.querySelector(
      '[data-page^="/artist/"]'
    );
    if (artistPageToRemove) {
      artistPageToRemove.remove();
    }

    // const playerPageToRemove = document.querySelector(
    //   '[data-page^="/player/"]'
    // );
    // if (playerPageToRemove) {
    //   playerPageToRemove.remove();
    // }
  }

  /**
   * Request new page data by despatching new page event to recieve page data
   */
  requestPageData(route: string) {
    const eventNewPage = new CustomEvent("new-page-create", {
      detail: {
        page: route,
      },
    });

    window.dispatchEvent(eventNewPage);
  }

  /**
   * Getting the data for the page after request
   */
  getPageData(data: any) {
    if (typeof data === "undefined") {
      return;
    }
    this.currentPageData = data;
  }
}

export const View = ViewSingleton.getInstance();
