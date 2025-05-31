import { supabase, Song, SongInsert, SongUpdate } from "../supabase";

// Lấy bài hát theo id
export const getSongById = async (id: string): Promise<Song | null> => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// Lấy tất cả bài hát của một nghệ sĩ
export const getSongsByArtistId = async (artistId: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("song_artists")
    .select("song_id, songs(*)")
    .eq("artist_id", artistId);
  if (error) throw error;
  return (data || []).map((row: any) => row.songs).filter(Boolean);
};

// Lấy tất cả bài hát thuộc một thể loại
export const getSongsByGenreId = async (genreId: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("song_genres")
    .select("song_id, songs(*)")
    .eq("genre_id", genreId);
  if (error) throw error;
  return (data || []).map((row: any) => row.songs).filter(Boolean);
};

// Lấy tất cả bài hát trong một playlist
export const getSongsByPlaylistId = async (
  playlistId: string
): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("song_id, songs(*)")
    .eq("playlist_id", playlistId);
  if (error) throw error;
  return (data || []).map((row: any) => row.songs).filter(Boolean);
};

// Tìm kiếm bài hát theo từ khóa (title hoặc artist_names)
export const searchSongs = async (keyword: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .or(`title.ilike.%${keyword}%,artist_names.ilike.%${keyword}%`);
  if (error) throw error;
  return data || [];
};

// CRUD cơ bản
export const createSong = async (song: SongInsert): Promise<Song> => {
  const { data, error } = await supabase
    .from("songs")
    .insert([song])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateSong = async (
  id: string,
  song: SongUpdate
): Promise<Song> => {
  const { data, error } = await supabase
    .from("songs")
    .update(song)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteSong = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("songs").delete().eq("id", id);
  if (error) throw error;
  return true;
};

export const getAllSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase.from("songs").select("*");
  if (error) throw error;
  return data || [];
};
