import { ComponentClass } from "../classes/componentClass";

// Define the PlayerBox class that inherits from ComponentClass
export class PlayerBox extends ComponentClass<HTMLDivElement, HTMLDivElement> {
  // Define properties for the player box elements
  public trackNameElement: HTMLSpanElement;
  public artistNameElement: HTMLSpanElement;
  public playPauseElement: SVGElement;
  public likeElement: SVGElement;
  public trackImageElement: HTMLImageElement;
  public static instance: PlayerBox | null = null;

  private constructor() {
    super("play-box-template", "view-container", true, "box-player");

    // Initialize player box elements
    this.trackNameElement = this.element.querySelector(
      ".box-player__track-name"
    ) as HTMLSpanElement;
    this.artistNameElement = this.element.querySelector(
      ".box-player__artist-name"
    ) as HTMLSpanElement;
    this.playPauseElement = this.element.querySelector(
      ".box-player__play-pause"
    ) as SVGElement;
    this.likeElement = this.element.querySelector(
      ".box-player__Heart"
    ) as SVGElement;
    this.trackImageElement = this.element.querySelector(
      ".box-player__image"
    ) as HTMLImageElement;
  }

  public static getInstance(): PlayerBox {
    if (PlayerBox.instance === null) {
      PlayerBox.instance = new PlayerBox();
    }
    return PlayerBox.instance;
  }
}
