import { fetchSong } from "@/lib/spotify";
import { ExtendedTrack, MyTrack } from "@/types/zing.types";
import { useEffect } from "react";
import { Track } from "react-native-track-player";

export async function convertZingToTrack(
  track: ExtendedTrack
): Promise<MyTrack> {
  if (track.link.includes("/album")) {
    track.datatype = "album";
  } else if (track.link.includes("/playlist")) {
    track.datatype = "playlist";
  } else {
    try {
      const song = await fetchSong(track.encodeId);
      track.link = song;

      console.log("link", song);
    } catch (error) {
      console.error("Error fetching song:", error);
    }
    track.datatype = "track";
  }

  return {
    id: track.encodeId,
    title: track.title,
    artist: track.artists[0].name,
    alias: track.alias || track.artists[0].alias,
    artwork: track.thumbnailM,
    url: track.link,
    duration: track.duration,
    score: track.score,
    rakingStatus: track.rakingStatus,
    weeklyRanking: track.weeklyRanking,
    datatype: track.datatype,
    releaseDate: track.releaseDate,
    artists: track.artists,
  };
}

export function convertToTrack(track: ExtendedTrack) {
  if (track.link.includes("/album")) {
    track.datatype = "album";
  } else if (track.link.includes("/playlist")) {
    track.datatype = "playlist";
  } else {
    // try {
    //   const song = await fetchSong(track.encodeId);
    //   track.link = song;
    // } catch (error) {
    //   console.error("Error fetching song:", error);
    // }
    track.datatype = "track";
  }

  return {
    id: track.encodeId,
    title: track.title,
    artist: track.artists[0].name,
    alias: track.alias || track.artists[0].alias,
    artwork: track.thumbnailM,
    url: track.link,
    duration: track.duration,
    score: track.score,
    rakingStatus: track.rakingStatus,
    weeklyRanking: track.weeklyRanking,
    datatype: track.datatype,
    releaseDate: track.releaseDate,
    artists: track.artists,
  };
}
