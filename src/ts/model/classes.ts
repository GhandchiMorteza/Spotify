import {
  Artist,
  AlbumGenreDictionary,
  Track,
  Album,
  PlayerConfiguration,
  AppState,
} from './Interfaces';

export class ArtistClass implements Artist {
  constructor(public name: string, public imageUrl: string) {}
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
    public artistName: string,
    public albumName: string
  ) {}
}

export class AlbumClass implements Album {
  constructor(
    public id: string,
    public name: string,
    public artist: Artist,
    public thumbnailUrl: string,
    public isLiked: boolean,
    public tracks: Track[],
    public albumGenres: AlbumGenreDictionary[]
  ) {}
}

export class PlayerConfigurationClass implements PlayerConfiguration {
  constructor(
    public currentPlaylist: Track[],
    public shuffle: boolean,
    public repeat: boolean,
    public playedFromPlaylist: Track[]
  ) {}
}
