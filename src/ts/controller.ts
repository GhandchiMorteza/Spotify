import * as Model from "./model/model";
import Router from "./router";
import { View } from "./view/view";
import userInteracted, { ConvertStrToEnumType, isTupleUnique } from "./helpers";
import { PlayerConfigurationClass } from "./model/classes";
import { ContainerClass } from "./view/classes/containerClass";
import { NextStatus } from "./view/interfaces";
import AppStateClass from "./model/appStateSingleton";
import PlayerView from "./view/views/playerView";
import { PageEnum } from "./config";

class Controller {
  private static instance: Controller | null = null;

  private constructor() {
    this.init();
  }
  static getInstance(): Controller {
    if (Controller.instance === null) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  private async init() {
    // Initialize the application state in the Model.
    Model.initAppState();

    // Set up event listeners
    this.setupEventListeners();

    // Initialize the Router.
    Router.init();
  }

  /**
   * Get the data for the new page from the Model.
   *
   * @param route The route of the new page.
   * @returns The data for the new page.
   */
  transferNewPageData(route: string): object {
    const data = Model.getDataForPage(route) as object;

    return data;
  }

  /**
   * Set up event listeners for new page creation and navigation.
   */
  private setupEventListeners() {
    // Listen for a new page creation event.
    window.addEventListener("new-page-create", (event) => {
      const customEvent = event as CustomEvent;
      View.getPageData(this.transferNewPageData(customEvent.detail.page));
    });

    // Listen for a navigation event.
    window.addEventListener("go", (event) => {
      const customEvent = event as CustomEvent;
      Router.go(customEvent.detail.page);
    });

    window.addEventListener("repeat-btn-pressed", () => {
      if (Model.appState.playerConfig.repeat) {
        Model.appState.playerConfig.repeat = false;
      } else {
        Model.appState.playerConfig.repeat = true;
      }
    });

    window.addEventListener("shuffle-btn-pressed", () => {
      if (Model.appState.playerConfig.shuffle) {
        Model.appState.playerConfig.shuffle = false;
      } else {
        Model.appState.playerConfig.shuffle = true;
      }
    });

    window.addEventListener("next-song", (event) => {
      const customEvent = event as CustomEvent;
      const currentSong = customEvent.detail.currentSong as Track;
      const status = customEvent.detail.status as NextStatus;
      const nextSongId = PlayerConfigurationClass.getNextTrackId.call(
        Model.appState.playerConfig,
        currentSong.id,
        status
      );
      //Model.appState.playerConfig
      Router.go(`/player/${nextSongId}`);
    });

    window.addEventListener("new-album-played", (event) => {
      const customEvent = event as CustomEvent;
      View.addItemToContainer(
        "carouselOneContainerItmes",
        customEvent.detail.data
      );
    });

    window.addEventListener("search", (event) => {
      const customEvent = event as CustomEvent;
      const searchTerm = customEvent.detail;
      const containerResult = View.getContainerById(
        "SearchResultsContainerItmes"
      ) as ContainerClass<any, any>;
      const newData = this.transferNewPageData(
        `/search#${searchTerm}`
      ) as Array<any>;

      containerResult.updateItems(newData);
    });

    window.addEventListener("searchCliked", (event) => {
      const customEvent = event as CustomEvent;
      const [_, page, id] = (customEvent.detail as string).split("/");
      const type: ItemType = ConvertStrToEnumType(page);
      if (
        isTupleUnique(Model.appState.generalSearchRecentSelected, [type, id])
      ) {
        Model.appState.generalSearchRecentSelected.push([type as ItemType, id]);
      }
      // string artistName is empty
      View.addItemToContainer(
        "RecentSearchContainerItmes",
        AppStateClass.mapItemToFormatByTuple(Model.appState, [
          type as ItemType,
          id as string,
        ])
      );
    });

    window.addEventListener("removeSearch", (event) => {
      const customEvent = event as CustomEvent;
      const [_, page, id] = (customEvent.detail as string).split("/");
      const type: ItemType = ConvertStrToEnumType(page);
      AppStateClass.removeItemFromRecentSelected(Model.appState, type, id);
    });

    window.addEventListener("play-album", (event) => {});

    window.addEventListener("play-inplace", (event) => {
      const customEvent = event as CustomEvent;
      let itemUrl = customEvent.detail as string;
      let [_, page, id] = itemUrl.split("/");

      if (page === PageEnum.likedSongs) {
        PlayerConfigurationClass.updatePlaylist.call(
          Model.appState.playerConfig,
          undefined,
          true
        );
      } else {
        PlayerConfigurationClass.updatePlaylist.call(
          Model.appState.playerConfig
        );
      }

      if (id === "all") {
        id = PlayerConfigurationClass.getFirstOfPlayList.call(
          Model.appState.playerConfig
        );
        itemUrl = `/player/${id}`;
      }
      View.renderPageElement(itemUrl, false);
    });

    window.addEventListener("goNonPlayer", (event) => {
      Router.GoPreviousNonPlayerPage();
    });

    window.addEventListener("like", (event) => {
      const customEvent = event as CustomEvent;
      let itemUrl = customEvent.detail.url as string;
      let [_, page, id] = itemUrl.split("/");
      const track = AppStateClass.getTrackById(Model.appState, id) as Track;
      track.isLiked = track.isLiked ? false : true;
      const playerView = PlayerView.getInstance();
      if (playerView.data && playerView.data.id === id) {
        playerView.toggleLikeBtn();
      }
      if (track.isLiked === true) {
        Model.appState.likedTracks.push(id);
        View.addItemToContainer(
          "LikedsongsContainerItmes",
          AppStateClass.mapItemToFormat(Model.appState, track)
        );
      } else {
        Model.appState.likedTracks = Model.appState.likedTracks.filter(
          (itemId) => {
            itemId === id;
          }
        );
        View.removeItemFromContainerByDataUrl(
          "LikedsongsContainerItmes",
          itemUrl
        );
      }
    });
  }
}

const controller = Controller.getInstance();
