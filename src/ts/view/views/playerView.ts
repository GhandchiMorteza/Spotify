// @ts-ignore - Changing string urls for parcel sprite
import sprite from "url:../../../img/sprite.svg";
import SongStorage from "../classes/songStorageClass";
import userInteracted from "../../helpers";
import { NextStatus } from "../interfaces";
import { PlayerBox } from "./playerBox";

class PlayerView {
  private static instance: PlayerView | null = null;
  playBtn!: HTMLElement;
  prevBtn!: HTMLElement;
  nextBtn!: HTMLElement;
  shuffleBtn!: HTMLElement;
  repeatBtn!: HTMLElement;
  audio!: HTMLAudioElement;
  progress!: HTMLElement;
  progressContainer!: HTMLElement;
  currentTime!: HTMLSpanElement;
  remainingTime!: HTMLSpanElement;
  isInitilized: boolean = false;
  isListenerAttached: boolean = false;
  songStorage!: SongStorage;
  isSongLoaded: boolean = true;
  data!: any;
  playConfig!: PlayerConfiguration;
  playerBox!: PlayerBox;
  songId: any;
  histStack: string[] = [""];
  backArrow!: HTMLElement;
  likeBtn!: HTMLElement;

  private constructor() {
    this.songStorage = new SongStorage();
  }
  static getInstance() {
    if (!PlayerView.instance) {
      PlayerView.instance = new PlayerView();
    }
    return PlayerView.instance;
  }
  updateDOM(data: Array<any>) {
    this.data = data[0] as any;
    this.playConfig = data[1] as PlayerConfiguration;

    if (this.histStack.pop() === this.data.id.toString()) {
      this.histStack.push(this.data.id.toString());
      return;
    }
    this.histStack.push(this.data.id.toString());

    const parentElenent = document.getElementById("page-player")
      ?.firstElementChild as HTMLElement;

    const image = parentElenent.querySelector(
      ".song-cover"
    ) as HTMLImageElement;
    const albumName = parentElenent.querySelector(".songName") as HTMLElement;
    const artistName = parentElenent.querySelector(
      ".artist-text"
    ) as HTMLElement;
    this.backArrow = parentElenent.querySelector(
      ".icon-Arrow-down"
    ) as HTMLElement;

    image.src = this.data.thumbnailUrl;
    albumName.textContent = this.data.name;
    artistName.textContent = this.data.artistName;

    this.updatePlayerBox();

    this.handleSong();
  }

  async handleSong() {
    // this.isInitilized is only true for the first song
    this.isSongLoaded = false;
    if (this.isInitilized) {
      this.stopSong();
    } else {
      this.initPlayer();
    }
    this.resetProgress(this.data.duration);
    if (userInteracted.bool) {
      this.playBtn.style.filter = "opacity(0.5)";
      this.nextBtn.style.filter = "opacity(0.5)";
      this.prevBtn.style.filter = "opacity(0.5)";
      this.playerBox.playPauseElement.style.filter = "opacity(0.5)";
    }

    this.songId = this.data.id.toString();
    const songBlob = await this.songStorage.getMP3SongById(this.songId);

    if (!songBlob) {
      // If the song is not found in IndexedDB, download and store it
      const response = await fetch(this.data.trackUrl);
      const newSongBlob = await response.blob();
      this.audio.src = URL.createObjectURL(newSongBlob);
      this.playByStart();
      await this.songStorage.addMP3Song(
        this.songId,
        this.data.trackUrl,
        newSongBlob
      );
    } else {
      // Song was found in IndexedDB, set its Blob URL as the source
      this.audio.src = URL.createObjectURL(songBlob);
      this.playByStart();
    }
  }

  updatePlayerBox() {
    const playerBox = PlayerBox.getInstance();
    this.playerBox = playerBox;
    playerBox.trackImageElement.src = this.data.thumbnailUrl;
    playerBox.trackNameElement.textContent = this.data.name;
    playerBox.artistNameElement.textContent = this.data.artistName;
  }

  playByStart() {
    if (userInteracted.bool) {
      this.playSong();
    }
    if (!this.isInitilized) {
      this.configureListeners();
      this.isInitilized = true;
    }
  }

  configureListeners() {
    // Time/song update
    this.audio.addEventListener("timeupdate", (e: Event) => {
      this.updateProgress(e);
      this.updateCurrentAndRemainingTime(); // Update time
    });

    // Click on progress bar
    this.progressContainer.addEventListener("click", (e: MouseEvent) =>
      this.setProgress(e)
    );

    this.playBtn.addEventListener("click", this.playBtnHandler.bind(this));

    window.addEventListener("keydown", (event) => {
      if (event.key === "MediaPlayPause" || event.key === " ") {
        event.preventDefault();
        this.playBtnHandler();
      }
    });

    this.playerBox.playPauseElement.addEventListener("click", (event) => {
      this.playBtnHandler();
      event.stopPropagation();
    });

    this.audio.addEventListener("canplaythrough", () => {
      this.isSongLoaded = true;
      this.playBtn.style.filter = "opacity(1)";
      this.nextBtn.style.filter = "opacity(1)";
      this.prevBtn.style.filter = "opacity(1)";
      this.playerBox.playPauseElement.style.filter = "opacity(1)";
    });

    // Change song
    this.prevBtn.addEventListener(
      "click",
      this.nextSong.bind(this, NextStatus.Previous)
    );

    this.nextBtn.addEventListener(
      "click",
      this.nextSong.bind(this, NextStatus.Next)
    );

    this.audio.addEventListener(
      "ended",
      this.nextSong.bind(this, NextStatus.End)
    );
  }

  repeatBtnHandler() {
    const repeatBtnPressed = new Event("repeat-btn-pressed");
    window.dispatchEvent(repeatBtnPressed);
    this.repeatBtnUpdate();
  }
  repeatBtnUpdate() {
    if (this.playConfig.repeat) {
      this.toggleIcon(this.repeatBtn, "icon-Repeat", "icon-Repeat-green");
    } else {
      this.toggleIcon(this.repeatBtn, "icon-Repeat-green", "icon-Repeat");
    }
  }
  shuffleBtnHandler() {
    const shuffleBtnPressed = new Event("shuffle-btn-pressed");
    window.dispatchEvent(shuffleBtnPressed);
    this.shuffleBtnUpdate();
  }
  shuffleBtnUpdate() {
    if (this.playConfig.shuffle) {
      this.toggleIcon(
        this.shuffleBtn,
        "icon-shuffle-dot",
        "icon-shuffle-dot-green"
      );
    } else {
      this.toggleIcon(
        this.shuffleBtn,
        "icon-shuffle-dot-green",
        "icon-shuffle-dot"
      );
    }
  }

  toggleIcon(element: Element, current: string, after: string) {
    element
      .querySelector("use")!
      .setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        `${sprite}#${after}`
      );
    element.classList.remove(current);
    element.classList.add(after);
  }

  nextSong(nextStatus: NextStatus) {
    if (!this.isSongLoaded) {
      return;
    }
    const eventNextSong = new CustomEvent("next-song", {
      detail: {
        currentSong: this.data,
        status: nextStatus,
      },
    });
    window.dispatchEvent(eventNextSong);
  }

  resetProgress(duration: string) {
    this.currentTime.textContent = this.formatTime(0);
    this.remainingTime.textContent = `-0${duration}`;
    this.progress.style.width = "0";
  }

  initPlayer() {
    const parentElenent = document.getElementById("page-player")
      ?.firstElementChild as HTMLElement;
    this.playBtn = document.getElementById("play") as HTMLElement;
    this.prevBtn = document.getElementById("prev") as HTMLElement;
    this.nextBtn = document.getElementById("next") as HTMLElement;

    this.shuffleBtn = document.getElementById("shuffle") as HTMLElement;
    this.repeatBtn = document.getElementById("repeat") as HTMLElement;

    this.audio = document.getElementById("audio") as HTMLAudioElement;
    this.progress = document.getElementById("progress") as HTMLElement;

    this.likeBtn = document.getElementById("like-song") as HTMLElement;
    this.progressContainer = document.getElementById(
      "progress-container"
    ) as HTMLElement;

    this.currentTime = document.getElementById(
      "currentTime"
    ) as HTMLSpanElement;

    this.remainingTime = document.getElementById(
      "remainingTime"
    ) as HTMLSpanElement;

    this.repeatBtnUpdate();
    this.shuffleBtnUpdate();

    this.configureSomeListeners();
  }
  configureSomeListeners() {
    this.shuffleBtn.addEventListener(
      "click",
      this.shuffleBtnHandler.bind(this)
    );

    this.repeatBtn.addEventListener("click", this.repeatBtnHandler.bind(this));

    this.playerBox.element.addEventListener("click", () => {
      const event = new CustomEvent("go", {
        detail: {
          page: `/player/${this.data.id}`,
        },
      });
      window.dispatchEvent(event);
    });
  }

  // Add a function to format time in "mm:ss" format
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // Add a function to update the current time and remaining time
  private updateCurrentAndRemainingTime(): void {
    const { currentTime, duration } = this.audio;
    if (!isNaN(currentTime) && !isNaN(duration)) {
      this.currentTime.textContent = this.formatTime(currentTime);
      const remaining = duration - currentTime;
      this.remainingTime.textContent = `-${this.formatTime(remaining)}`;
    }
  }

  playBtnHandler() {
    if (!this.isSongLoaded) {
      return;
    }
    const isPlaying = this.playBtn.classList.contains("play");

    if (isPlaying) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  stopSong() {
    this.audio.currentTime = 0;
    this.audio.src = "";
  }

  updateProgress(e: Event) {
    const audioElement = e.target as HTMLAudioElement;
    if (!audioElement || isNaN(audioElement.duration)) {
      return; // Handle cases where audioElement or duration is not available
    }

    const { duration, currentTime } = audioElement;
    const progressPercent: number = (currentTime / duration) * 100;
    this.progress.style.width = `${progressPercent}%`;
  }

  setProgress(e: MouseEvent): void {
    const width = this.progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audio.duration;

    this.audio.currentTime = (clickX / width) * duration;
  }

  playSong() {
    this.playBtn!.classList.add("play");
    this.toggleIcon(
      this.playBtn,
      "icon-Play-circle-white",
      "icon-Pause-circle"
    );
    this.toggleIcon(
      this.playerBox.playPauseElement,
      "icon-Play-circle-white",
      "icon-Pause-circle"
    );
    this.audio.play();
    this.updateCurrentAndRemainingTime();
  }

  pauseSong() {
    this.playBtn.classList.remove("play");
    this.toggleIcon(
      this.playBtn,
      "icon-Pause-circle",
      "icon-Play-circle-white"
    );
    this.toggleIcon(
      this.playerBox.playPauseElement,
      "icon-Pause-circle",
      "icon-Play-circle-white"
    );

    this.audio.pause();
    this.updateCurrentAndRemainingTime();
  }
}

export default PlayerView;
