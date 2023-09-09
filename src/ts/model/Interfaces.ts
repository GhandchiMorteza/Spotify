interface Artist {
  name: string;
  imageUrl: string;
  id: string;
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
  duration: string;
}

interface Album {
  id: string;
  name: string;
  artistIDs: string[];
  thumbnailUrl: string;
  isLiked: boolean;
  tracks: Track[];
  albumGenres: string[];
  isDownloaded: boolean;
}

interface PlayerConfiguration {
  // Array of track IDs
  currentPlaylist: string[];
  shuffledPlaylist: string[];
  shuffle: boolean;
  repeat: boolean;
  currentIndex: number;
}

interface AppState {
  albums: Album[];
  likedTracks: string[];
  likedAlbums: string[];
  previouslyPlayedAlbums: string[];
  playerConfig: PlayerConfiguration;
  generalSearchRecentSelected: [ItemType, string][];
}

interface AlbumItem {
  id: string;
  name: string;
  image: string;
  artistName: string;
  isDownloaded: boolean;
  isLiked: boolean;
}

interface TrackItem {
  id: string;
  name: string;
  image: string;
  artistName: string;
  albumName: string;
  isDownloaded: boolean;
  isLiked: boolean;
}

interface ArtistItem {
  id: string;
  name: string;
  image: string;
}

enum ItemType {
  Album,
  Track,
  Artist,
}

type TypesItem = AlbumItem | TrackItem | ArtistItem;
