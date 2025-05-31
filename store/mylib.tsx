import { deletePlaylist } from "@/services/fileService";
import { MyPlaylist, MyTrack } from "@/types/zing.types";
import { create } from "zustand";

interface LibraryState {
  playlists: MyPlaylist[];
  history: MyTrack[];

  // Track actions
  // toggleTrackFavorite: (track: MyTrack) => void;

  setPlaylist: (playlist: MyPlaylist) => void;
  setPlaylists: (playlists: MyPlaylist[]) => void;

  // // Playlist actions
  // createPlaylist: (playlist: Omit<MyPlaylist, 'id'>) => void;
  checkTrackInPlaylist: (trackId: string, playlistId: string) => boolean;
  addTrackToPlaylist: (track: MyTrack, playlistId: string) => void;
  removeTrackFromPlaylist: (trackId: string, playlistId: string) => void;
  deletePlaylist: (playlistId: string) => void;

  // History actions
  addTrackToHistory: (track: MyTrack) => void;
  removeTrackFromHistory: (trackId: string) => void;
  clearHistory: () => void;
}

export const useLibraryStore = create<LibraryState>()((set, get) => ({
  playlists: [],
  tracks: [],
  history: [],

  setPlaylist: (playlist: MyPlaylist) => {
    set({
      playlists: [
        ...get().playlists.filter((item) => item.id !== playlist.id),
        playlist,
      ],
    });
  },

  setPlaylists: (playlists: MyPlaylist[]) => {
    set({ playlists });
  },

  checkTrackInPlaylist: (trackId: string, playlistId: string) => {
    const playlist = get().playlists.find(
      (playlist) => playlist.id === playlistId
    );
    if (playlist) {
      return playlist.tracks.some((track) => track.id === trackId);
    }
    return false;
  },

  addTrackToPlaylist: (track: MyTrack, playlistId: string) => {
    set((state) => ({
      playlists: state.playlists.map((playlist: MyPlaylist) =>
        playlist.id === playlistId
          ? { ...playlist, tracks: [...playlist.tracks, track] }
          : playlist
      ),
    }));
  },
  removeTrackFromPlaylist: (trackId: string, playlistId: string) => {
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: playlist.tracks.filter((track) => track.id !== trackId),
            }
          : playlist
      ),
    }));
  },

  deletePlaylist: (playlistId: string) =>
    set((state) => ({
      playlists: state.playlists.filter(
        (playlist) => playlist.id !== playlistId
      ),
    })),

  addTrackToHistory: (track: MyTrack) => {
    const filteredHistory = get().history.filter((t) => t.id !== track.id);
    set({
      history: [track, ...filteredHistory].slice(0, 20),
    });
  },
  
  removeTrackFromHistory: (trackId: string) =>
    set((state) => ({
      history: state.history.filter((track) => track.id !== trackId),
    })),
    
  clearHistory: () =>
    set(() => ({
      history: [],
    })),
}));
