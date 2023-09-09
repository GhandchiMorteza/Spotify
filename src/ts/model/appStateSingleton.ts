import {
  ArtistClass,
  TrackClass,
  AlbumClass,
  PlayerConfigurationClass,
} from "./classes";
import { ItemType } from "../helpers";
import { appState } from "./model";

class AppStateClass implements AppState {
  private static instance: AppStateClass | null = null;
  public artists: Artist[] = [];

  private constructor(
    public albums: Album[] = [],
    public likedTracks: string[] = [],
    public likedAlbums: string[] = [],
    public previouslyPlayedAlbums: string[] = [],
    public playerConfig: PlayerConfigurationClass = new PlayerConfigurationClass(),
    public generalSearchRecentSelected: [ItemType, string][] = []
  ) {}

  static getInstance(): AppStateClass {
    if (!AppStateClass.instance) {
      AppStateClass.instance = new AppStateClass();
    }
    return AppStateClass.instance;
  }

  addAlbum(
    id: string,
    name: string,
    artistIDs: string[],
    thumbnailUrl: string,
    isLiked: boolean,
    tracks: Track[],
    albumGenres: string[],
    isDownloaded: boolean
  ) {
    this.albums.push(
      new AlbumClass(
        id,
        name,
        artistIDs,
        thumbnailUrl,
        isLiked,
        tracks,
        albumGenres,
        isDownloaded
      )
    );
  }

  // Getting Object by Id //

  static getAlbumById(instance: AppStateClass, id: string): Album | undefined {
    return instance.albums.find((album) => album.id === id);
  }

  static getTrackById(instance: AppStateClass, id: string): Track | undefined {
    for (const album of instance.albums) {
      const track = album.tracks.find((track) => track.id === id);
      if (track) {
        return track;
      }
    }
    return undefined;
  }

  static getArtistById(
    instance: AppStateClass,
    id: string
  ): Artist | undefined {
    return instance.artists.find((artist) => artist.id === id);
  }

  static getAlbumsById(instance: AppStateClass, ids: string[]): Album[] {
    return instance.albums.filter((album) => ids.includes(album.id));
  }

  static getArtistsById(instance: AppStateClass, ids: string[]): Artist[] {
    return instance.artists.filter((artist) => ids.includes(artist.id));
  }

  static getTracksById(instance: AppStateClass, ids: string[]): Track[] {
    const tracks: Track[] = [];
    for (const album of instance.albums) {
      for (const track of album.tracks) {
        if (ids.includes(track.id)) {
          tracks.push(track);
        }
      }
    }
    return tracks;
  }

  static getItemById(
    instance: AppStateClass,
    itemTuple: [ItemType, string]
  ): Album | Track | Artist | undefined {
    const [itemType, id] = itemTuple;

    switch (itemType) {
      case ItemType.Album:
        return AppStateClass.getAlbumById(instance, id);
      case ItemType.Track:
        return AppStateClass.getTrackById(instance, id);
      case ItemType.Artist:
        return AppStateClass.getArtistById(instance, id);
      default:
        console.error("couldn't get this itemTuple by ID:", itemTuple);
        return undefined;
    }
  }

  static getItemsById(
    instance: AppStateClass,
    itemTuples: [ItemType, string][]
  ): (Album | Track | Artist)[] {
    const items: (Album | Track | Artist)[] = [];
    for (const [itemType, id] of itemTuples) {
      const item = AppStateClass.getItemById(instance, [itemType, id]);
      if (item) {
        items.push(item);
      }
    }
    return items;
  }
  /////////////////////////////

  // Formatting item methods //

  static mapItemToFormatByTuple(
    instance: AppStateClass,
    itemTuple: [ItemType, string]
  ): TypesItem | null {
    const [itemType, id] = itemTuple;
    const item = AppStateClass.getItemById(instance, [itemType, id]);

    if (!item) {
      return null;
    }

    switch (true) {
      case isInctanceOfAlbum(item):
        const album = item as AlbumClass;

        return {
          id: album.id,
          name: album.name,
          image: album.thumbnailUrl,
          artistName: album.artistIDs
            .map((artistID) => {
              return AppStateClass.getArtistById(appState, artistID)?.name;
            })
            .join(", "),
          isDownloaded: album.isDownloaded,
          isLiked: album.isLiked,
        } as AlbumItem;

      case isInctanceOfArtist(item):
        const artist = item as ArtistClass;
        return {
          id: artist.id,
          name: artist.name,
          image: artist.imageUrl,
        } as ArtistItem;

      case isInctanceOfTrack(item):
        const track = item as TrackClass;
        return {
          id: track.id,
          name: track.name,
          image: track.thumbnailUrl,
          artistName: AppStateClass.getAlbumById(instance, track.albumId)
            ?.artistIDs.map((artistID) => {
              return AppStateClass.getArtistById(appState, artistID)?.name;
            })
            .join(", "),
          albumName: AppStateClass.getAlbumById(instance, track.albumId)?.name,
          isDownloaded: track.isDownloaded,
          isLiked: track.isLiked,
        } as TrackItem;

      default:
        console.error("couldn't foramt this type of item:", itemType);
        return null;
    }
  }
  static mapItemsToFormatByTuple(
    instance: AppStateClass,
    itemTuples: [ItemType, string][]
  ): (TypesItem | null)[] {
    return itemTuples.map((itemTuple) => {
      return this.mapItemToFormatByTuple(instance, itemTuple);
    });
  }
  static mapItemToFormat(
    instance: AppStateClass,
    item: Album | Track | Artist
  ): TypesItem | null {
    switch (true) {
      case isInctanceOfAlbum(item):
        const album = item as AlbumClass;

        return {
          id: album.id,
          name: album.name,
          image: album.thumbnailUrl,
          artistName: album.artistIDs
            .map((artistID) => {
              const artist = AppStateClass.getArtistById(instance, artistID);
              return artist ? artist.name : "";
            })
            .join(", "),
          isDownloaded: album.isDownloaded,
          isLiked: album.isLiked,
        } as AlbumItem;

      case isInctanceOfArtist(item):
        const artist = item as ArtistClass;
        return {
          id: artist.id,
          name: artist.name,
          image: artist.imageUrl,
        } as ArtistItem;

      case isInctanceOfTrack(item):
        const track = item as TrackClass;
        const albumInfo = AppStateClass.getAlbumById(instance, track.albumId);
        return {
          id: track.id,
          name: track.name,
          image: track.thumbnailUrl,
          artistName: albumInfo?.artistIDs
            .map((artistID) => {
              const artist = AppStateClass.getArtistById(instance, artistID);
              return artist ? artist.name : "";
            })
            .join(", "),
          albumName: albumInfo?.name,
          isDownloaded: track.isDownloaded,
          isLiked: track.isLiked,
        } as TrackItem;

      default:
        console.error("couldn't format this type of item:", item);
        return null;
    }
  }
  static mapItemsToFormat(
    instance: AppStateClass,
    items: (Album | Track | Artist)[]
  ): (TypesItem | null)[] {
    return items.map((item) => {
      return this.mapItemToFormat(instance, item);
    });
  }

  static mapItemsToFormatByTypeAndIds(
    instance: AppStateClass,
    itemType: ItemType,
    ids: string[]
  ): (TypesItem | null)[] {
    const itemTuples = ids.map((id) => [itemType, id] as [ItemType, string]);
    return itemTuples.map((itemTuple) => {
      return this.mapItemToFormatByTuple(instance, itemTuple);
    });
  }

  ////////////////////////////

  static removeItemFromRecentSelected(
    instance: AppStateClass,
    itemType: ItemType,
    itemId: string
  ): void {
    instance.generalSearchRecentSelected =
      instance.generalSearchRecentSelected.filter(
        (item) => item[0] !== itemType || item[1] !== itemId
      );
  }
}

export default AppStateClass;

function isInctanceOfAlbum(myObject: object) {
  return "tracks" in myObject;
}

function isInctanceOfTrack(myObject: object) {
  return "duration" in myObject;
}

function isInctanceOfArtist(myObject: object) {
  return "imageUrl" in myObject;
}
