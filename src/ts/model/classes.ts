import {
  Artist,
  AlbumGenreDictionary,
  Track,
  Album,
  PlayerConfiguration,
} from './Interfaces';

export class ArtistClass implements Artist {
  static allArtists: Artist[] = [];
  constructor(
    public name: string,
    public imageUrl: string = '../../img/artist.jpg'
  ) {
    ArtistClass.allArtists.push(this);
  }
}

export class TrackClass implements Track {
  static allTracks: Track[] = [];
  constructor(
    public id: string,
    public name: string,
    public thumbnailUrl: string,
    public isLiked: boolean,
    public isDownloaded: boolean,
    public trackUrl: string,
    public albumId: string,
    public artistName: string,
    public albumName: string,
    public duration: string
  ) {
    TrackClass.allTracks.push(this);
  }
}

export class AlbumClass implements Album {
  constructor(
    public id: string,
    public name: string,
    public artist: Artist,
    public thumbnailUrl: string,
    public isLiked: boolean,
    public tracks: Track[],
    public albumGenres: string[]
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

export const albumGenresDic: AlbumGenreDictionary = {
  ['Classical Crossover']: 'Classical Crossover',
  ['Modern Classical']: 'Modern Classical',
  ['Classical']: 'Classical',
  ['Instrumental']: 'Instrumental',
  ['New Age']: 'New Age',
  ['Epic']: 'Epic',
  ['Modern Era']: 'Modern Era',
  ['Meditation']: 'Meditation',
};
