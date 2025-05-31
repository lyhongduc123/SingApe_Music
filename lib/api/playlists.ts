import {
  supabase,
  Playlist,
  PlaylistInsert,
  PlaylistUpdate,
  Song,
} from "../supabase";

export const getPlaylistById = async (id: string): Promise<Playlist | null> => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const getPlaylistsByUserId = async (
  userId: string
): Promise<Playlist[]> => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const getSongsInPlaylist = async (
  playlistId: string
): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("song_id, songs(*)")
    .eq("playlist_id", playlistId);
  if (error) throw error;
  return (data || []).map((row: any) => row.songs).filter(Boolean);
};

export const createPlaylist = async (
  playlist: PlaylistInsert
): Promise<Playlist> => {
  const { data, error } = await supabase
    .from("playlists")
    .insert([playlist])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updatePlaylist = async (
  id: string,
  playlist: PlaylistUpdate
): Promise<Playlist> => {
  const { data, error } = await supabase
    .from("playlists")
    .update(playlist)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePlaylist = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("playlists").delete().eq("id", id);
  if (error) throw error;
  return true;
};
