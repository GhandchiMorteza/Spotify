import {
  Artist,
  AlbumGenreDictionary,
  Track,
  Album,
  PlayerConfiguration,
  AppState,
} from './interfaces';
import {
  ArtistClass,
  TrackClass,
  AlbumClass,
  PlayerConfigurationClass,
} from './classes';

class AppStateClass implements AppState {
  private static instance: AppStateClass | null = null;

  private constructor(
    public albums: Album[],
    public likedTracks: Track[],
    public likedAlbums: Album[],
    public previouslyPlayedAlbums: Album[],
    public playerConfig: PlayerConfiguration,
    public generalSearchResult: (Album | Track | Artist)[],
    public generalSearchRecentSelected: (Album | Track | Artist)[],
    public artistSearchResult: Artist[],
    public albumSearchResult: Album[]
  ) {}

  static getInstance(): AppStateClass {
    if (!AppStateClass.instance) {
      // Initialize the instance here
      AppStateClass.instance = new AppStateClass(
        [], // Initialize albums
        [], // Initialize likedTracks
        [], // Initialize likedAlbums
        [], // Initialize previouslyPlayedAlbums
        new PlayerConfigurationClass([], false, false, []), // Initialize playerConfig
        [], // Initialize generalSearchResult
        [], // Initialize generalSearchRecentSelected
        [], // Initialize artistSearchResult
        [] // Initialize albumSearchResult
      );
    }
    return AppStateClass.instance;
  }

  addAlbum(
    id: string,
    name: string,
    artist: Artist,
    thumbnailUrl: string,
    isLiked: boolean,
    tracks: Track[],
    albumGenres: string[]
  ) {
    this.albums.push(
      new AlbumClass(
        id,
        name,
        artist,
        thumbnailUrl,
        isLiked,
        tracks,
        albumGenres
      )
    );
  }
}

export default AppStateClass;
