import {
  ArtistClass,
  TrackClass,
  AlbumClass,
  PlayerConfigurationClass,
  albumGenresDic,
} from './classes';
import {
  AppState,
  Artist,
  AlbumGenreDictionary,
  Track,
  Album,
  PlayerConfiguration,
} from './Interfaces';
import AppStateClass from './appStateSingleton';
import * as jsonData from '../../json/data.json';
// import {API_URL} from './config';

const appState = AppStateClass.getInstance();

export function initAppState() {
  readAlbumsFromJson();
  console.log(appState.albums);
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
    let genres: string[] = album.album_genre.split(', ');
    appState.addAlbum(
      album.id,
      album.album_name,
      new ArtistClass(album.album_composer),
      album.album_thumb,
      false,
      tracks,
      album.album_genre.split(', ')
    );
  }
}
