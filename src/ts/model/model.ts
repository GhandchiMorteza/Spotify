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
import { ItemType } from "../helpers";

export let appState = AppStateClass.getInstance();

// Add an event listener to save app state before the page is unloaded
window.addEventListener("beforeunload", () => {
  updateAndSaveAppState();
});

function updateAndSaveAppState() {
  // Serialize and save the updated appState
  localStorage.setItem("appState", JSON.stringify(appState));
}

export function initAppState() {
  // Try to read appState from local storage
  const savedAppStateStr = localStorage.getItem("appState");

  if (savedAppStateStr) {
    // If appState is available in local storage, parse and use it
    appState = JSON.parse(savedAppStateStr);
  } else {
    // Otherwise, read albums from JSON file
    readAlbumsFromJson();
  }
}

function readAlbumsFromJson() {
  const albumGenres: AlbumGenreDictionary[] = [];
  const artists = new Array<Artist>();

  for (const data of jsonData) {
    const album = data.album;

    // If the album has no composer or genre, skip it.
    if (album.album_composer.length == 0 || album.album_genre.length == 0) {
      continue;
    }

    let currentArtistsID: string[] = [];
    const composerNames = album.album_composer
      .split(",")
      .map((name) => name.trim());

    for (const composerName of composerNames) {
      let artist = artists.find((a) => a.name === composerName);
      if (!artist) {
        artist = new ArtistClass(composerName);
        artists.push(artist);
      }
      currentArtistsID.push(artist.id);
    }

    // Create an array of tracks for the album.
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
          music.track_time
        )
      );
    }

    let genres: string[] = album.album_genre.split(", ");
    // Add the album to the app state.
    appState.addAlbum(
      album.id,
      album.album_name,
      currentArtistsID,
      album.album_thumb,
      false,
      tracks,
      genres,
      false
    );
  }

  // Pushing all artists
  appState.artists.push(...artists);

  // Save the appState object in local storage.
  localStorage.setItem("appState", JSON.stringify(appState));
}

// Function to get data for a page.
export function getDataForPage(route: string): object | undefined {
  switch (route) {
    case PageEnum.home:
    case "/":
      let albumsPlayed: Array<any> = AppStateClass.getAlbumsById(
        appState,
        appState.previouslyPlayedAlbums
      );
      return [
        // ITEMS: Previously played albums
        AppStateClass.mapItemsToFormat(appState, albumsPlayed),
        // ITEMS: All albums
        AppStateClass.mapItemsToFormat(
          appState,
          appState.albums
        ) as AlbumItem[],
      ];
      break;
    case PageEnum.search:
      return [
        // ITEMS: Recent selected items in Search page
        AppStateClass.mapItemsToFormatByTuple(
          appState,
          appState.generalSearchRecentSelected
        ),
        [],
      ];
      break;
    case PageEnum.albums:
      return [
        // ITEMS: All albums for library/albums
        AppStateClass.mapItemsToFormat(
          appState,
          appState.albums
        ) as AlbumItem[],
        // ITEMS: All artists for library/artists
        AppStateClass.mapItemsToFormat(
          appState,
          appState.artists
        ) as ArtistItem[],
      ];
      break;
    case PageEnum.likedSongs:
      return [
        // ITEMS: Liked tracks
        AppStateClass.mapItemsToFormatByTypeAndIds(
          appState,
          ItemType.Track,
          appState.likedTracks
        ),
      ];
      break;
    case PageEnum.likedAlbums:
      return [
        // ITEMS: Liked albums
        AppStateClass.mapItemsToFormatByTypeAndIds(
          appState,
          ItemType.Album,
          appState.likedAlbums
        ),
      ];
    default:
      // Pages that include id

      if (route.startsWith(PageEnum.album)) {
        // read ID from route
        const albumId = route.split(PageEnum.album)[1];

        // find album from ID
        const album = AppStateClass.getAlbumById(appState, albumId);

        if (album) {
          // Updating current playlist for player
          PlayerConfigurationClass.updatePlaylist.call(
            appState.playerConfig,
            album.tracks
          );
          return [
            // ITEMS: album tracks
            AppStateClass.mapItemsToFormat(appState, album.tracks),
            // PAGE_INFO: album
            {
              ...AppStateClass.mapItemToFormat(appState, album),
              imageArtist: AppStateClass.getArtistById(
                appState,
                album.artistIDs[0]
              )?.imageUrl,
              nameArtist: AppStateClass.getArtistById(
                appState,
                album.artistIDs[0]
              )?.name,
            },
          ];
        }
      } else if (route.startsWith(PageEnum.player)) {
        // read ID from route
        const trackId = route.split(PageEnum.player)[1];

        // find track from ID in the Playlist
        const playList = appState.playerConfig.currentPlaylist;
        const trackIndex = playList.findIndex((trackID) => trackID === trackId);

        let track: Track | undefined = AppStateClass.getTrackById(
          appState,
          trackId
        );
        let albumOfTrack: Album | undefined = AppStateClass.getAlbumById(
          appState,
          track?.albumId as string
        );

        // Updating current playlist
        if (playList.length > 0 && trackIndex !== -1) {
          PlayerConfigurationClass.updatePlaylist.call(
            appState.playerConfig,
            albumOfTrack!.tracks
          );
        }

        // Add played album to the previous played albums
        if (
          !appState.previouslyPlayedAlbums.includes(albumOfTrack?.id as string)
        ) {
          appState.previouslyPlayedAlbums.push(albumOfTrack?.id as string);
          const eventNewAlbumPlayed = new CustomEvent("new-album-played", {
            detail: {
              data: AppStateClass.mapItemToFormat(
                appState,
                albumOfTrack as Album
              ),
            },
          });

          window.dispatchEvent(eventNewAlbumPlayed);
        }

        const modifiedTrack: any = {
          ...track,
          artistName: AppStateClass.getAlbumById(
            appState,
            track?.albumId as string
          )
            ?.artistIDs.map((id) => {
              return AppStateClass.getArtistById(appState, id)?.name;
            })
            .join(", "),
        };
        //
        return [modifiedTrack, appState.playerConfig];
      } else if (route.startsWith(PageEnum.artist)) {
        // read ID from route
        const artistId = route.split(PageEnum.artist)[1];

        const artist = AppStateClass.getArtistById(appState, artistId);

        // get artist's albums
        const albums = appState.albums.filter((album) => {
          return album.artistIDs.includes(artistId);
        });

        // get artist's all tracks
        const tracks = [];
        for (const album of albums) {
          tracks.push(...album.tracks);
        }

        // Updating current playlist for player
        PlayerConfigurationClass.updatePlaylist.call(
          appState.playerConfig,
          tracks
        );

        return [
          // ITEMS: artist tracks
          AppStateClass.mapItemsToFormat(appState, tracks),
          // PAGE_INFO: artist
          AppStateClass.mapItemToFormat(appState, artist as Artist),
        ];
      } else if (route.startsWith(PageEnum.search)) {
        const searchTerm = route.split("#")[1];

        const filteredAlbums = AppStateClass.mapItemsToFormat(
          appState,
          appState.albums.filter((album: Album) =>
            album.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

        const filteredArtists = AppStateClass.mapItemsToFormat(
          appState,
          appState.artists.filter((artist) =>
            artist.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

        const filteredTracks = [];
        for (const album of appState.albums) {
          for (const track of album.tracks) {
            if (track.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              filteredTracks.push(
                AppStateClass.mapItemToFormat(appState, track)
              );
            }
          }
        }

        // ITEMS: All items that match its name with search term
        return [...filteredAlbums, ...filteredArtists, ...filteredTracks];
      }
  }
}
