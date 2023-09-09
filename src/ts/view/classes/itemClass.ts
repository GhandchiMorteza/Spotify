// @ts-ignore - Changing string urls for parcel sprite
import sprite from "url:../../../img/sprite.svg";
import { ItemType } from "../../helpers";

export class ItemClass {
  itemMarkup: string;
  element: HTMLElement;
  url!: string;
  constructor(public data: TypesItem, public containerId: string) {
    this.itemMarkup = this.generateHTMLMarkup();
    const tempElement = document.createElement("div");
    tempElement.innerHTML = this.itemMarkup;
    this.element = tempElement.firstElementChild as HTMLElement;
  }

  /**
   * This function generates HTML markup for items of containers.
   *
   * @returns A string of HTML markup.
   */
  generateHTMLMarkup(): string {
    let Markup: string | undefined;
    let item;

    switch (this.containerId) {
      case "carouselOneContainerItmes":
        item = this.data as AlbumItem;
        this.url = `/album/${item!.id}`;
        return `<div class="carousel__item--txt" data-url="${this.url}">
        <img class="carousel__image" src="${item.image}" alt="recently played album sample" />
        <span class="carousel__text">${item.name}</span>
      </div>`;

      case "carouselTwoContainerItmes":
        item = this.data as AlbumItem;
        this.url = `/album/${item!.id}`;
        return `<img class="carousel__item" src="${item.image}" alt="suggest album sample" data-url="${this.url}" />`;

      case "albumContainerItmes":
        item = this.data as TrackItem;
        this.url = `/player/${item!.id}`;
        return `<div class="vertical-tracks__item mgt-3" data-url="${this.url}">
        <div class="vertical-tracks__flex-container-left">
          <span class="vertical-tracks__song-title">${item.name}</span>
          <div class="vertical-tracks__flex-container-botton">
            <svg class="icon icon-Download-stroke vertical-tracks__download-icon">
              <use xlink:href="${sprite}#icon-Download-stroke"></use>
            </svg>
            <span class="vertical-tracks__artist">${item.artistName}</span>
          </div>
        </div>
        <svg class="icon icon-More vertical-tracks__more-icon">
          <use xlink:href="${sprite}#icon-More"></use>
        </svg>
      </div>`;

      case "albumsContainerItmes":
        item = this.data as AlbumItem;
        this.url = `/album/${item!.id}`;
        return `<div class="vertical-tracks__item mgt-1p6" data-url="${this.url}">
        <div class="vertical-tracks--left-image">
          <img src="${item.image}" alt="track image" class="vertical-tracks--image vertical-tracks--image--album" />
          <div class="vertical-tracks__flex-container-left">
            <span class="vertical-tracks__song-title">${item.name}</span>
            <div class="vertical-tracks__flex-container-botton">
              <span class="vertical-tracks__artist">${item.artistName}</span>
            </div>
          </div>
        </div>
      </div>`;

      case "artistsContainerItmes":
        item = this.data as ArtistItem;
        this.url = `/artist/${item!.id}`;
        return `<div class="center-vertically mgt-1p6" data-url="${this.url}">
        <img src="${item.image}" alt="artist image" class="artist-image" />
        <h3 class="ternaryHeading artist-name">
          ${item.name}
        </h3>
      </div>`;

      case "artistContainerItmes":
        item = this.data as TrackItem;
        this.url = `/player/${item!.id}`;
        return `<div
        class="vertical-tracks__item vertical-tracks__item--numbered mgt-1p6" data-url="${this.url}"
      >
        <div class="vertical-tracks--left-image">
          <img
            src="${item.image}"
            alt="track image"
            class="vertical-tracks--image vertical-tracks--image--numbered"
          />
          <div
            class="vertical-tracks__flex-container-left vertical-tracks__flex-container-left"
          >
            <span
              class="vertical-tracks__song-title vertical-tracks__song-title--image"
              >${item.name}</span
            >
            <div class="vertical-tracks__flex-container-botton">
              <span class="vertical-tracks__artist"
                >69,596,325</span
              >
            </div>
          </div>
        </div>
        <div class="vertical-tracks--right-image">
          <svg
            class="icon icon-More vertical-tracks__more-icon--smaller"
          >
            <use xlink:href="${sprite}#icon-More"></use>
          </svg>
        </div>
      </div>`;

      case "LikedsongsContainerItmes":
        item = this.data as TrackItem;
        this.url = `/player/${item!.id}`;
        return ` <div class="vertical-tracks__item mgt-1p6" data-url="${
          this.url
        }">
        <div class="vertical-tracks--left-image">
          <img src="${
            item.image
          }" alt="track image" class="vertical-tracks--image" />
          <div class="vertical-tracks__flex-container-left">
            <span class="vertical-tracks__song-title vertical-tracks__song-title--image">${
              item.name
            }</span>
            <div class="vertical-tracks__flex-container-botton">
              <svg class="icon iconDownload icon-${
                item.isDownloaded ? "Download-green" : "Download-stroke"
              }vertical-tracks__download-icon vertical-tracks__download-icon--image">
                <use xlink:href="${sprite}#icon-${
          item.isDownloaded ? "Download-green" : "Download-stroke"
        }"></use>
              </svg>
              <span class="vertical-tracks__artist">${item.artistName}</span>
            </div>
          </div>
        </div>
        <div class="vertical-tracks--right-image">
          <svg class="icon icon-Heart-green vertical-tracks--Heart-icon">
            <use xlink:href="${sprite}#icon-${
          item.isLiked ? "Heart-green" : "Heart-stroke"
        }"></use>
          </svg>
          <svg class="icon icon-More vertical-tracks__more-icon--smaller">
            <use xlink:href="${sprite}#icon-More"></use>
          </svg>
        </div>
      </div>`;

      case "RecentSearchContainerItmes":
      case "SearchResultsContainerItmes":
        if (isTrackItem(this.data)) {
          item = this.data as TrackItem;
          this.url = `/player/${item!.id}`;
          return `<div class="vertical-tracks__item mgt-1p5" data-url="${
            this.url
          }">
        <div class="vertical-tracks--left-image">
          <img src="${
            item.image
          }" alt="track image" class="vertical-tracks--image" />
          <div class="vertical-tracks__flex-container-left">
            <span class="vertical-tracks__song-title">${item.name}</span>
            <div class="vertical-tracks__flex-container-botton">
              <span class="vertical-tracks__artist">Track . ${
                item.artistName
              }</span>
            </div>
          </div>
        </div>
        ${
          this.containerId === "RecentSearchContainerItmes"
            ? `<div class="vertical-tracks--right-image">
          <svg class="icon icon-Close vertical-tracks__more-icon--cancel">
            <use xlink:href="${sprite}#icon-Close"></use>
          </svg>
        </div>`
            : ""
        }
      </div>`;
        } else if (isAlbumItem(this.data)) {
          item = this.data as AlbumItem;
          this.url = `/album/${item!.id}`;
          return `<div class="vertical-tracks__item mgt-1p5" data-url="${
            this.url
          }">
        <div class="vertical-tracks--left-image">
          <img src="${
            item.image
          }" alt="track image" class="vertical-tracks--image" />
          <div class="vertical-tracks__flex-container-left">
            <span class="vertical-tracks__song-title">${item.name}</span>
            <div class="vertical-tracks__flex-container-botton">
              <span class="vertical-tracks__artist">Album . ${
                item.artistName
              }</span>
            </div>
          </div>
        </div>
        ${
          this.containerId === "RecentSearchContainerItmes"
            ? `<div class="vertical-tracks--right-image">
          <svg class="icon icon-Close vertical-tracks__more-icon--cancel">
            <use xlink:href="${sprite}#icon-Close"></use>
          </svg>
        </div>`
            : ""
        }
      </div>`;
        } else if (isArtistItem(this.data)) {
          item = this.data as ArtistItem;
          this.url = `/artist/${item!.id}`;
          return `<div class="vertical-tracks__item mgt-1p5" data-url="${
            this.url
          }">
          <div class="vertical-tracks--left-image">
            <img src="${
              item.image
            }" alt="track image" class="vertical-tracks--image circle-radious" />
            <div class="vertical-tracks__flex-container-left">
              <span class="vertical-tracks__song-title">${item.name}</span>
              <div class="vertical-tracks__flex-container-botton">
                <span class="vertical-tracks__artist">Artist</span>
              </div>
            </div>
          </div>
          ${
            this.containerId === "RecentSearchContainerItmes"
              ? `<div class="vertical-tracks--right-image">
          <svg class="icon icon-Close vertical-tracks__more-icon--cancel">
            <use xlink:href="${sprite}#icon-Close"></use>
          </svg>
        </div>`
              : ""
          }
        </div>`;
        }

      default:
        break;
    }

    return Markup as string;
  }
}

function isAlbumItem(item: any): item is AlbumItem {
  return (
    "id" in item &&
    "name" in item &&
    "image" in item &&
    "artistName" in item &&
    "isDownloaded" in item &&
    "isLiked" in item
  );
}

function isTrackItem(item: any): item is TrackItem {
  return (
    "id" in item &&
    "name" in item &&
    "image" in item &&
    "artistName" in item &&
    "albumName" in item &&
    "isDownloaded" in item &&
    "isLiked" in item
  );
}

function isArtistItem(item: any): item is ArtistItem {
  return "id" in item && "name" in item && "image" in item;
}
