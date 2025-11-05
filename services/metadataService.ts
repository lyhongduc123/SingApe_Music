import { unknownTrackImageSource } from "@/constants/image";
import { MusicInfo } from "expo-music-info-2";

export async function getMusicInfo(uri: string) {
  try {
    const info = await MusicInfo.getMusicInfoAsync(uri, {
      title: true,
      artist: true,
      album: true,
      genre: true,
      picture: true,
    });

    return info;
  } catch (error) {
    console.log("Error getting music info:", error);
    throw error;
  }
}
