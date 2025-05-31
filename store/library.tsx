import library from "@/assets/data/library.json";
import { unknownTrackImageSource } from "@/constants/image";
import { Artist, Playlist, TrackWithPlaylist } from "../helpers/types";
import { Track } from "react-native-track-player";
import { create } from "zustand";
import { useMemo } from "react";

interface LibraryState {
  tracks: TrackWithPlaylist[];
  toggleTrackFavorite: (track: Track) => void;
  addToPlaylist: (track: Track, playlistName: string) => void;
  createPlaylist: (playlistName: string) => void;
}

export const useLibraryStore = create<LibraryState>()((set) => ({
  tracks: library,
  toggleTrackFavorite: (track) =>
    set((state) => ({
      tracks: state.tracks.map((currentTrack) => {
        if (currentTrack.url === track.url) {
          return {
            ...currentTrack,
            rating: currentTrack.rating === 1 ? 0 : 1,
          };
        }

        return currentTrack;
      }),
    })),
  addToPlaylist: (track, playlistName) =>
    set((state) => {
      if (!track?.url) {
        console.warn("Track không có url hoặc không hợp lệ:", track);
        return state;
      }

      return {
        tracks: state.tracks.map((currentTrack) => {
          if (currentTrack.url === track.url) {
            return {
              ...currentTrack,
              playlist: [...(currentTrack.playlist ?? []), playlistName],
            };
          }

          return currentTrack;
        }),
      };
    }),
  createPlaylist: (playlistName: string) =>
    set((state) => {
      // Nếu playlist đã tồn tại, không làm gì cả
      const existing = state.tracks.some((track) =>
        track.playlist?.includes(playlistName)
      );
      if (existing) return state;

      // Tạo playlist rỗng bằng cách gán cho một bài hát dummy
      return {
        tracks: [
          ...state.tracks,
          {
            title: "Dummy",
            artist: "Unknown",
            url: `dummy-${playlistName}-${Date.now()}`,
            artwork: unknownTrackImageSource,
            playlist: [playlistName],
          },
        ],
      };
    }),
}));

export const useTracks = () => useLibraryStore((state) => state.tracks);

export const useFavorites = () => {
  const tracks = useLibraryStore((state) => state.tracks);
  const toggleTrackFavorite = useLibraryStore(
    (state) => state.toggleTrackFavorite
  );

  const favorites = useMemo(
    () => tracks.filter((track) => track.rating === 1),
    [tracks]
  );

  return { favorites, toggleTrackFavorite };
};

export const useArtists = () => {
  const tracks = useLibraryStore((state) => state.tracks);

  return useMemo(() => {
    return tracks.reduce((acc, track) => {
      const existingArtist = acc.find((artist) => artist.name === track.artist);
      if (existingArtist) {
        existingArtist.tracks.push(track);
      } else {
        acc.push({
          name: track.artist ?? "Unknown",
          tracks: [track],
        });
      }
      return acc;
    }, [] as Artist[]);
  }, [tracks]);
};

export const usePlaylists = () => {
  const tracks = useLibraryStore((state) => state.tracks);
  const playlists = useMemo(() => {
    return tracks.reduce((acc, track) => {
      track.playlist?.forEach((playlistName) => {
        const existingPlaylist = acc.find(
          (playlist) => playlist.name === playlistName
        );

        if (existingPlaylist) {
          existingPlaylist.tracks.push(track);
        } else {
          acc.push({
            name: playlistName,
            tracks: [track],
            artworkPreview:
              track.artwork ??
              "https://photo.znews.vn/w1200/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
            createdBy: "Lê Tiến Thực",
          });
        }
      });

      return acc;
    }, [] as Playlist[]);
  }, [tracks]);

  const addToPlaylist = useLibraryStore((state) => state.addToPlaylist);
  const createPlaylist = useLibraryStore((state) => state.createPlaylist);

  return { playlists, addToPlaylist, createPlaylist };
};
