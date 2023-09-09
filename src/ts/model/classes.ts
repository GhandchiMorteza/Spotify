import { DEFAULT_IMAGE } from "../config";
import { shuffleArray } from "../helpers";
import { NextStatus } from "../view/interfaces";

export class ArtistClass implements Artist {
  static allArtists: Artist[] = [];
  static counter: number = 0;
  public id: string;
  constructor(public name: string, public imageUrl: string = DEFAULT_IMAGE) {
    ArtistClass.allArtists.push(this);
    this.id = (++ArtistClass.counter + 4000).toString();
  }
}

export class TrackClass implements Track {
  constructor(
    public id: string,
    public name: string,
    public thumbnailUrl: string,
    public isLiked: boolean,
    public isDownloaded: boolean,
    public trackUrl: string,
    public albumId: string,
    public duration: string
  ) {}
}

export class AlbumClass implements Album {
  constructor(
    public id: string,
    public name: string,
    public artistIDs: string[],
    public thumbnailUrl: string,
    public isLiked: boolean,
    public tracks: Track[],
    public albumGenres: string[],
    public isDownloaded: boolean
  ) {}
}

export class PlayerConfigurationClass {
  constructor(
    public currentPlaylist: string[] = [],
    public shuffledPlaylist: string[] = [],
    public shuffle: boolean = false,
    public repeat: boolean = false,
    public currentIndex: number = 0,
    public currentPagePlaylist: string[] = []
  ) {}
  static updatePlaylist(
    this: PlayerConfigurationClass,
    index: number = 0
  ): void {
    this.currentPlaylist.splice(0, this.currentPlaylist.length);
    this.shuffledPlaylist.splice(0, this.shuffledPlaylist.length);
    this.currentPagePlaylist.forEach((trackId) => {
      this.currentPlaylist.push(trackId);
    });
    this.shuffledPlaylist = shuffleArray(this.currentPlaylist);
    this.currentIndex = index;
  }
  static updatePagePlaylist(this: PlayerConfigurationClass, tracks: Track[]) {
    this.currentPagePlaylist.splice(0, this.currentPagePlaylist.length);
    tracks.forEach((track) => {
      this.currentPagePlaylist.push(track.id);
    });
  }
  static getNextTrackId(
    this: PlayerConfigurationClass,
    currentTrackId: string,
    status: Number
  ): string {
    if (status == NextStatus.End && this.repeat) {
      return currentTrackId;
    }
    this.currentIndex = this.shuffle
      ? this.shuffledPlaylist.findIndex((trackId) => trackId === currentTrackId)
      : this.currentPlaylist.findIndex((trackId) => trackId === currentTrackId);
    if (status === NextStatus.Next || status === NextStatus.End) {
      if (this.currentIndex > this.currentPlaylist.length - 2) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    } else {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.currentPlaylist.length - 1;
      }
    }
    return this.shuffle
      ? this.shuffledPlaylist[this.currentIndex]
      : this.currentPlaylist[this.currentIndex];
  }
}

export const albumGenresDic: AlbumGenreDictionary = {
  ["Classical Crossover"]: "Classical Crossover",
  ["Modern Classical"]: "Modern Classical",
  ["Classical"]: "Classical",
  ["Instrumental"]: "Instrumental",
  ["New Age"]: "New Age",
  ["Epic"]: "Epic",
  ["Modern Era"]: "Modern Era",
  ["Meditation"]: "Meditation",
};
