import { AppState } from "react-native";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

// Instant types cho từng bảng
export type Album = Database["public"]["Tables"]["albums"]["Row"];
export type AlbumInsert = Database["public"]["Tables"]["albums"]["Insert"];
export type AlbumUpdate = Database["public"]["Tables"]["albums"]["Update"];

export type Artist = Database["public"]["Tables"]["artists"]["Row"];
export type ArtistInsert = Database["public"]["Tables"]["artists"]["Insert"];
export type ArtistUpdate = Database["public"]["Tables"]["artists"]["Update"];

export type Song = Database["public"]["Tables"]["songs"]["Row"];
export type SongInsert = Database["public"]["Tables"]["songs"]["Insert"];
export type SongUpdate = Database["public"]["Tables"]["songs"]["Update"];

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type Playlist = Database["public"]["Tables"]["playlists"]["Row"];
export type PlaylistInsert =
  Database["public"]["Tables"]["playlists"]["Insert"];
export type PlaylistUpdate =
  Database["public"]["Tables"]["playlists"]["Update"];

export type UploadSong = Database["public"]["Tables"]["upload_songs"]["Row"];
export type UploadSongInsert =
  Database["public"]["Tables"]["upload_songs"]["Insert"];
export type UploadSongUpdate =
  Database["public"]["Tables"]["upload_songs"]["Update"];

// ... (các type instant khác nếu cần)

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || "null").trim();
const supabaseAnonKey = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "null"
).trim();

console.log("Supabase URL:", supabaseUrl.substring(0, 10) + "...");
console.log("Supabase Key:", supabaseAnonKey.substring(0, 10) + "...");

if (supabaseUrl === "null" || supabaseAnonKey === "null") {
  console.warn(
    "Supabase URL and Anon Key must be set in environment variables"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Default export for the supabase client
export default supabase;
