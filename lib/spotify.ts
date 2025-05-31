// const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
// const CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET';

import { Chart, ExtendedTrack } from "@/types/zing.types";
import { supabase } from "./supabase";

// const getAccessToken = async () => {
//   const credsB64 = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

//   const response = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       Authorization: `Basic ${credsB64}`,
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: 'grant_type=client_credentials',
//   });

//   const data = await response.json();
//   return data.access_token;
// };

// const fetchSpotifyData = async () => {
//   const token = await getAccessToken();

//   const res = await fetch('https://api.spotify.com/v1/artists/1Xyo4u8uXC1ZmMpatF05PJ', { // Example: The Weeknd
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const json = await res.json();
//   console.log(json);
// };

// const KOYEB_API_URL = "http://192.168.0.101:8080/"; // Replace with your Koyeb API URL
// =======
const KOYEB_API_URL =
  "https://yielding-leia-vietnam-national-university-83340bf5.koyeb.app/";

// const KOYEB_API_URL = "http://192.168.1.2:25565/";

export const getSpotifyToken = async () => {
  const response = await fetch(`${KOYEB_API_URL}spotify-token`);
  const { access_token } = await response.json();
  return access_token;
};

export const fetchSearch = async (query: string) => {
  const response = await fetch(
    KOYEB_API_URL + "zingmp3/search?keyword=" + query
  );
  const data = await response.json();
  return data.data;
};

export const fetchTop100Tracks = async () => {
  const response = await fetch(KOYEB_API_URL + "zingmp3/top100");
  const data = await response.json();
  return data;
};

export const fetchChart = async (): Promise<Chart> => {
  const response = await fetch(KOYEB_API_URL + "zingmp3/chart");
  const data = await response.json();
  return data.data;
};

export const fetchHome = async () => {
  const response = await fetch(KOYEB_API_URL + "zingmp3/home");
  const data = await response.json();
  return data.data;
};

export const fetchSong = async (encodeId: string) => {
  try {
    const response = await fetch(
      "http://192.168.1.13:8080/" + "zingmp3/song/" + encodeId
    );
    const data = await response.json();
    // console.log("data", data);
    return data.data["128"];
  } catch (error) {
    console.error("Error fetching song URL:", error);
    throw error;
  }
};

export const fetchPlaylist = async (encodeId: string) => {
  try {
    const response = await fetch(
      KOYEB_API_URL + "zingmp3/playlist/" + encodeId
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error;
  }
};

export const fetchArtist = async (encodeId: string) => {
  try {
    const response = await fetch(KOYEB_API_URL + "zingmp3/artist/" + encodeId);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching artist:", error);
    throw error;
  }
};

export const fetchLyric = async (encodeId: string) => {
  const response = await fetch(KOYEB_API_URL + "zingmp3/lyric/" + encodeId);
  const data = await response.json();
  console.log("data", data);
  return data.data;
};
