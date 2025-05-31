import {
  supabase,
  Artist,
  ArtistInsert,
  ArtistUpdate,
  Song,
} from "../supabase";

export const getArtistById = async (id: string): Promise<Artist | null> => {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const getArtistsByUserId = async (userId: string): Promise<Artist[]> => {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const getAllArtists = async (): Promise<Artist[]> => {
  const { data, error } = await supabase.from("artists").select("*");
  if (error) throw error;
  return data || [];
};

export const getSongsByArtistId = async (artistId: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("song_artists")
    .select("song_id, songs(*)")
    .eq("artist_id", artistId);
  if (error) throw error;
  return (data || []).map((row: any) => row.songs).filter(Boolean);
};

export const createArtist = async (artist: ArtistInsert): Promise<Artist> => {
  const { data, error } = await supabase
    .from("artists")
    .insert([artist])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateArtist = async (
  id: string,
  artist: ArtistUpdate
): Promise<Artist> => {
  const { data, error } = await supabase
    .from("artists")
    .update(artist)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteArtist = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("artists").delete().eq("id", id);
  if (error) throw error;
  return true;
};
