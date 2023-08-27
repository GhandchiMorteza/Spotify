import {
  ArtistClass,
  TrackClass,
  AlbumClass,
  PlayerConfigurationClass,
  albumGenresDic,
} from "./classes";

import AppStateClass from "./appStateSingleton";
import * as jsonData from "../../json/data.json";
import { PageEnum } from "../config";

const appState = AppStateClass.getInstance();

export function initAppState() {
  // (async () => {
  //   if (navigator.storage && !(await navigator.storage.persisted())) {
  //     const result = await navigator.storage.persist();
  //     console.log(`Persisted storage granted: ${result}`);
  //   }
  // })();

  // (async () => {
  //   if (navigator.storage) {
  //     const q = await navigator.storage.estimate();
  //     if (q.quota && q.usage !== undefined) {
  //       console.log(`Quota available: ${q.quota / 1024 / 1024} MiB`);
  //       console.log(`Quota used: ${q.usage / 1024} KiB`);
  //     }
  //   }
  // })();

  readAlbumsFromJson();
  // console.log(appState.albums);
  // console.log(ArtistClass.allArtists);
}

function readAlbumsFromJson() {
  let albumGenres: AlbumGenreDictionary[];
  let artist: Artist;
  for (const data of jsonData) {
    const album = data.album;
    if (album.album_composer.length == 0 || album.album_genre.length == 0) {
      continue;
    }
    const tracks: Track[] = [];
    for (const music of data.musics) {
      tracks.push(
        new TrackClass(
          music.id.toString(),
          music.track_name,
          music.track_thumb,
          false,
          false,
          music.track_url,
          album.id,
          album.album_composer,
          album.album_name,
          music.track_time
        )
      );
    }

    let genres: string[] = album.album_genre.split(", ");
    appState.addAlbum(
      album.id,
      album.album_name,
      new ArtistClass(album.album_composer),
      album.album_thumb,
      false,
      tracks,
      album.album_genre.split(", ")
    );
  }
}

export function getDataForPage(route: string): object | undefined {
  switch (route) {
    case PageEnum.home:
    case "/":
      return new Object(appState.albums);
      break;
    case PageEnum.search:
      break;
    case PageEnum.albums:
      return new Object(appState.albums);
      break;
    case PageEnum.artists:
      break;
    case PageEnum.playlists:
      break;
    case PageEnum.likedSongs:
      break;
    case PageEnum.likedAlbums:
      break;
    case PageEnum.album:
      break;
    case PageEnum.player:
      break;
    case PageEnum.artist:
      break;

    default:
      break;
  }
}
