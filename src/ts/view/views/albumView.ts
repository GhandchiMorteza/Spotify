// @ts-ignore - Changing string urls for parcel sprite
import sprite from "url:../../../img/sprite.svg";

class AlbumView {
  private static instance: AlbumView | null = null;
  configured: Boolean = false;
  playAlbumBtn!: HTMLElement;
  shuffleAlbumBtn!: HTMLElement;
  backArrow: any;
  private constructor() {}
  static getInstance() {
    if (!AlbumView.instance) {
      AlbumView.instance = new AlbumView();
    }
    return AlbumView.instance;
  }
  updateDOM(data: any) {
    const parentElenent = document.getElementById("page-album")
      ?.firstElementChild as HTMLElement;

    const image = parentElenent.querySelector(
      ".album-image"
    ) as HTMLImageElement;
    const albumName = parentElenent.querySelector(
      ".primaryHeading"
    ) as HTMLElement;
    const artistImage = parentElenent.querySelector(
      ".artist-image"
    ) as HTMLImageElement;
    const ternaryHeading = parentElenent.querySelector(
      ".ternaryHeading"
    ) as HTMLElement;
    this.playAlbumBtn = parentElenent.querySelector(
      "#play-album"
    ) as HTMLElement;
    this.shuffleAlbumBtn = parentElenent.querySelector(
      "#shuffle-album"
    ) as HTMLElement;
    // shuffleAlbumBtn.style.display = "none";
    this.backArrow = parentElenent.querySelector(".icon-Back-arrow");

    image.src = data.image;
    artistImage.src = data.imageArtist;
    albumName.textContent = data.name;
    ternaryHeading.textContent = data.nameArtist;

    this.configure();
  }
  configure() {
    this.playAlbumBtn.addEventListener("click", () => {
      const newEvent = new CustomEvent("play-album");

      window.dispatchEvent(newEvent);
    });
    // this.backArrow.addEventListener("click", () => {
    //   const event = new Event("goNonPlayer");
    //   window.dispatchEvent(event);
    // });
  }
  toggleShuffleBtn() {
    if (this.shuffleAlbumBtn) {
      this.toggleIconIf(
        this.shuffleAlbumBtn,
        "icon-shuffle-circle-green",
        "icon-shuffle-circle"
      );
    }
  }
  toggleIconIf(element: Element, case1: string, case2: string) {
    if (element.classList.contains(case1)) {
      element
        .querySelector("use")!
        .setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          `${sprite}#${case2}`
        );
      element.classList.remove(case1);
      element.classList.add(case2);
    } else {
      element
        .querySelector("use")!
        .setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          `${sprite}#${case1}`
        );
      element.classList.remove(case2);
      element.classList.add(case1);
    }
  }
}

export default AlbumView;
