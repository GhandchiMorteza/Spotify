class ArtistView {
  private static instance: ArtistView | null = null;
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

    artistImage.src = data.image;
    artistName.textContent = data.name;
  }
}

export default ArtistView;
