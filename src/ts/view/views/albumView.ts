class AlbumView {
  private static instance: AlbumView | null = null;
  configured: Boolean = false;
  playAlbumBtn!: HTMLElement;
  shuffleAlbumBtn!: HTMLElement;
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

    image.src = data.image;
    artistImage.src = data.imageArtist;
    albumName.textContent = data.name;
    ternaryHeading.textContent = data.nameArtist;

    if (!this.configured) {
      this.configure();
      this.configured = true;
    }
  }
  configure() {
    this.playAlbumBtn.addEventListener("click", () => {
      const newEvent = new CustomEvent("play-album");
      window.dispatchEvent(newEvent);
    });
  }
}

export default AlbumView;
