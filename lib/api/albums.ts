import { supabase, Album, AlbumInsert, AlbumUpdate, Song } from "../supabase";

export const getAlbumById = async (id: string): Promise<Album | null> => {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const getAlbumsByArtistId = async (
  artistId: string
): Promise<Album[]> => {
  const { data, error } = await supabase
    .from("album_artists")
    .select("album_id, albums(*)")
    .eq("artist_id", artistId);
  if (error) throw error;
  return (data || []).map((row: any) => row.albums).filter(Boolean);
};

export const getSongsInAlbum = async (albumId: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("album_id", albumId);
  if (error) throw error;
  return data || [];
};

export const createAlbum = async (album: AlbumInsert): Promise<Album> => {
  const { data, error } = await supabase
    .from("albums")
    .insert([album])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateAlbum = async (
  id: string,
  album: AlbumUpdate
): Promise<Album> => {
  const { data, error } = await supabase
    .from("albums")
    .update(album)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteAlbum = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("albums").delete().eq("id", id);
  if (error) throw error;
  return true;
};
