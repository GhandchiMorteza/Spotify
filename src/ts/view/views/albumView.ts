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
}

export default AlbumView;
