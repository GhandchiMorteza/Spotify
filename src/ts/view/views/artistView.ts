// @ts-ignore - Changing string urls for parcel sprite
import sprite from "url:../../../img/sprite.svg";

class ArtistView {
  private static instance: ArtistView | null = null;
  shuffleAlbumBtn!: Element;
  private constructor() {}
  static getInstance() {
    if (!ArtistView.instance) {
      ArtistView.instance = new ArtistView();
    }
    return ArtistView.instance;
  }
  updateDOM(data: any) {
    const parentElenent = document.getElementById("page-artist")
      ?.firstElementChild as HTMLElement;

    const artistName = parentElenent.querySelector(
      ".primaryHeading"
    ) as HTMLElement;
    const artistImage = parentElenent.querySelector(
      ".image-artist"
    ) as HTMLImageElement;
    const shuffleAlbumBtn = parentElenent.querySelector(".shuffle-artist");

    artistImage.src = data.image;
    artistName.textContent = data.name;
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

export default ArtistView;
