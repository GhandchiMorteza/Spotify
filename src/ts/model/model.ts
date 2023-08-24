import {
  ArtistClass,
  TrackClass,
  AlbumClass,
  PlayerConfigurationClass,
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
}

//     public id: string,
//     public name: string,
//     public artist: Artist,
//     public thumbnailUrl: string,
//     public isLiked: boolean,
//     public tracks: Track[],
//     public albumGenres: AlbumGenreDictionary[]

function readAlbumsFromJson() {
  for (const data of jsonData) {
    console.log(data);
  }
}

// export const loadAlbums = function () {
//   const data = jsonData;
// };
