import { Album, MyPlaylist, MyTrack } from '@/types/zing.types';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Track } from 'react-native-track-player';

const HISTORY_FILE = FileSystem.documentDirectory + 'listeningHistory.json';
const PLAYLISTS_DIR = FileSystem.documentDirectory + 'Playlists/';
const FAVORITES_DIR = FileSystem.documentDirectory + 'Favorites/';
const RECENTSEARCH_FILE = FileSystem.documentDirectory + 'recentSearch.json';

export async function downloadMusic(url: string, filename: string) {
  const localUri = FileSystem.documentDirectory + filename;
  const { uri, status } = await FileSystem.downloadAsync(url, localUri);
  if (status !== 200) {
    throw new Error(`Download failed: ${status}`);
  }
  return uri;
}

export function downloadWithProgress(
  url: string,
  filename: string,
  onProgress: (progress: number) => void
) {
  const localUri = FileSystem.documentDirectory + filename;
  const callback = ({ totalBytesWritten, totalBytesExpectedToWrite }: { totalBytesWritten: number; totalBytesExpectedToWrite: number }) => {
    onProgress(totalBytesWritten / totalBytesExpectedToWrite);
  };
  const resumable = FileSystem.createDownloadResumable(
    url,
    localUri,
    {},
    callback
  );
  return resumable.downloadAsync().then((result) => {
      if (!result) {
        throw new Error('Download result is undefined');
      }
      console.log('Finished downloading to', result.uri);
      return result.uri;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });;
}

export async function saveToLibrary(uri: string, albumName = 'MyMusic') {
  const asset = await MediaLibrary.createAssetAsync(uri);
  await MediaLibrary.createAlbumAsync(albumName, asset, false);
  return asset;
}

export async function saveListeningHistory(track: Track) {
  const historyFileUri = HISTORY_FILE;
  let history = [];

  try {
    const fileContent = await FileSystem.readAsStringAsync(historyFileUri);
    history = JSON.parse(fileContent);
  } catch (error) {
    console.log('No existing history file found, creating a new one.');
  }
  history = history.filter((item: any) => item.track.id !== track.id); 
  history.unshift({ track, timestamp: new Date().toISOString() });
  history = history.slice(0, 50);
  await FileSystem.writeAsStringAsync(historyFileUri, JSON.stringify(history));
}

export async function getListeningHistory(): Promise<Array<{ track: MyTrack; timestamp: string }>> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE);
    if (!fileInfo.exists) return [];
    const raw = await FileSystem.readAsStringAsync(HISTORY_FILE, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading history:', e);
    return [];
  }
}

export async function deleteListeningHistory() {
  const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE);
  if (fileInfo.exists) {
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify([]));
  }
}

const ensurePlaylistDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PLAYLISTS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PLAYLISTS_DIR, { intermediates: true });
  }
};

const getPlaylistFilePath = (playlistId: string) => `${PLAYLISTS_DIR}${playlistId}.json`;

export const createPlaylist = async (username: string, id: string, playlistName: string, artwork: string, description: string) => {
  await ensurePlaylistDirExists();
  const filePath = getPlaylistFilePath(playlistName);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (fileInfo.exists) {
    throw new Error('Playlist already exists');
  }
  const newPlaylist = {
    id: id,
    title: playlistName,
    description: description || '',
    artwork: artwork || '',
    createdBy: username,
    tracks: [],
  }
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(
    newPlaylist
  ));
  return newPlaylist;
};

export const createPlaylistWithTracks = async (username: string, id: string, playlistName: string, artwork: string, description: string, tracks: MyTrack[]) => {
  await ensurePlaylistDirExists();
  const filePath = getPlaylistFilePath(playlistName);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (fileInfo.exists) {
    throw new Error('Playlist already exists');
  }
  const newPlaylist = {
    id: id,
    title: playlistName,
    description: description || '',
    artwork: artwork || '',
    createdBy: username,
    tracks: tracks,
  }
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(
    newPlaylist
  ));
  return newPlaylist;
};

export const updatePlaylist = async (playlistId: string, updatedPlaylist: MyPlaylist) => {
  const filePath = getPlaylistFilePath(playlistId);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    throw new Error('Playlist does not exist');
  }
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedPlaylist));
}

export const deletePlaylist = async (playlistName: string) => {
  const filePath = getPlaylistFilePath(playlistName);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    console.log('Playlist does not exist:', filePath);
    throw new Error('Playlist does not exist');
  }
  await FileSystem.deleteAsync(filePath);
};

export const addSongToPlaylist = async (playlistName: string, song: MyTrack) => {
  const filePath = getPlaylistFilePath(playlistName);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    throw new Error('Playlist does not exist');
  }
  const content = await FileSystem.readAsStringAsync(filePath);
  const playlist = JSON.parse(content);
  const existingTrack = playlist.tracks.find((track: MyTrack) => track.id === song.id);
  if (existingTrack) {
    throw new Error('Track already exists in the playlist');
  }
  playlist.tracks.push(song);
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(playlist));
};

export const removeSongFromPlaylist = async (playlistName: string, song: MyTrack) => {
  const filePath = getPlaylistFilePath(playlistName);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    throw new Error('Playlist does not exist');
  }
  const content = await FileSystem.readAsStringAsync(filePath);
  const playlist = JSON.parse(content);
  playlist.tracks = playlist.tracks.filter((track: MyTrack) => track.id !== song.id);
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(playlist));
};

export const checkPlaylistExists = async (id: string): Promise<boolean> => {
  const filePath = getPlaylistFilePath(id);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  return fileInfo.exists;
}

export const getPlaylist = async (playlistName: string) => {
  const filePath = getPlaylistFilePath(playlistName);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    throw new Error('Playlist does not exist');
  }
  const content = await FileSystem.readAsStringAsync(filePath);
  return JSON.parse(content);
};

export const listPlaylists = async () => {
  await ensurePlaylistDirExists();
  const files = await FileSystem.readDirectoryAsync(PLAYLISTS_DIR);

  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  const playlists = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await FileSystem.readAsStringAsync(PLAYLISTS_DIR + file);
      return JSON.parse(content);
    })
  );

  return playlists;
};




const ensureFavoritesDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(FAVORITES_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(FAVORITES_DIR, { intermediates: true });
  }
}

const getFavoriteFilePath = () => `${FAVORITES_DIR}$songs.json`;


export const addSongToFavorite = async (song: MyTrack) => {
  await ensureFavoritesDirExists();
  const filePath = getFavoriteFilePath();
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  let favorites: MyTrack[] = [];

  if (fileInfo.exists) {
    const content = await FileSystem.readAsStringAsync(filePath);
    favorites = JSON.parse(content);
  }

  favorites.push(song);
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(favorites));
}

export const removeSongFromFavorite = async (song: MyTrack) => {
  const filePath = getFavoriteFilePath();
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    throw new Error('Favorites do not exist');
  }
  const content = await FileSystem.readAsStringAsync(filePath);
  const favorites = JSON.parse(content);
  const updatedFavorites = favorites.filter((track: MyTrack) => track.id !== song.id);
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedFavorites));
}

export const getFavorites = async () => {
  const filePath = getFavoriteFilePath();
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    throw new Error('Favorites do not exist');
  }
  const content = await FileSystem.readAsStringAsync(filePath);
  return JSON.parse(content);
}

export const checkIfSongInFavorites = async (song: MyTrack): Promise<boolean> => {
  const filePath = getFavoriteFilePath();
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (!fileInfo.exists) {
    return false;
  }
  const content = await FileSystem.readAsStringAsync(filePath);
  const favorites = JSON.parse(content);
  return favorites.some((track: MyTrack) => track.id === song.id);
}

export const saveRecentSearch = async (items: any) => {
  const recentSearchFileUri = RECENTSEARCH_FILE;
  let recentSearch = [];
  try {
    const fileContent = await FileSystem.readAsStringAsync(recentSearchFileUri);
    recentSearch = JSON.parse(fileContent);
  } catch (error) {
    console.log('No existing recent search file found, creating a new one.');
  } 
  recentSearch = recentSearch.filter((item: any) => item.id !== items.id);
  recentSearch.unshift(items);
  recentSearch = recentSearch.slice(0, 10);
  await FileSystem.writeAsStringAsync(recentSearchFileUri, JSON.stringify(recentSearch));
}

export const getRecentSearch = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(RECENTSEARCH_FILE);
    if (!fileInfo.exists) return [];
    const raw = await FileSystem.readAsStringAsync(RECENTSEARCH_FILE, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading recent search:', e);
    return [];
  }
}