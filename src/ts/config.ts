// @ts-ignore
import artistImage from "url:../img/artist.jpg";

export enum PageEnum {
  home = "/home",
  search = "/search",
  albums = "/library/albums",
  artists = "/library/artists",
  playlists = "/library/playlists",
  likedSongs = "/library/playlists/liked-songs",
  likedAlbums = "/library/playlists/liked-albums",
  album = "/album/",
  player = "/player/",
  artist = "/artist/",
}

// Json file doesn't include aritst image, So I choose a default image
export const DEFAULT_IMAGE = artistImage;
