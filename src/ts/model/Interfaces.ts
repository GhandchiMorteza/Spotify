interface Artist {
  name: string;
  imageUrl: string;
}

interface AlbumGenreDictionary {
  [genre: string]: string;
}

interface Track {
  id: string;
  name: string;
  thumbnailUrl: string;
  isLiked: boolean;
  isDownloaded: boolean;
  trackUrl: string;
  albumId: string;
  artistName: string;
  albumName: string;
  duration: string;
}

interface Album {
  id: string;
  name: string;
  artist: Artist;
  thumbnailUrl: string;
  isLiked: boolean;
  tracks: Track[];
  albumGenres: string[];
}

interface PlayerConfiguration {
  currentPlaylist: Track[];
  shuffle: boolean;
  repeat: boolean;
  playedFromPlaylist: Track[];
}

interface AppState {
  albums: Album[];
  likedTracks: Track[];
  likedAlbums: Album[];
  previouslyPlayedAlbums: Album[];
  playerConfig: PlayerConfiguration;
  generalSearchResult: (Album | Track | Artist)[];
  generalSearchRecentSelected: (Album | Track | Artist)[];
  artistSearchResult: Artist[];
  albumSearchResult: Album[];
}
