import { useAuth } from "@/context/auth";
import { supabase } from "@/lib/supabase";
import { Track } from "react-native-track-player";

export async function getSongs() {
  const { data, error } = await supabase.from("songs").select(`*,
    song_artists (
    *,
      artists (*)
    ),
    albums (*),
    song_genres (
    *,
      genres (*)
  )`);
  if (error) {
    console.log("Error fetching songs:", error);
    throw error;
  }

  return data;
}

export async function likeSong(track: Track) {
  const { user } = useAuth();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await supabase
    .from("liked_songs")
    .select("*")
    .eq("user_id", user?.id)
    .eq("song_id", track.id);

  if (data) {
    const { error: deleteError } = await supabase
      .from("liked_songs")
      .delete()
      .eq("user_id", user?.id)
      .eq("song_id", track.id);
  } else {
    const { error: insertError } = await supabase.from("liked_songs").insert({
      liked_at: new Date().toISOString(),
      user_id: user?.id,
      song_id: track.id,
    });
  }

  if (error) {
    console.log("Error liking song:", error);
    throw error;
  }

  return data;
}
