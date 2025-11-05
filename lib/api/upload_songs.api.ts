import { supabase } from "../supabase";

// Type definition for uploaded songs
// This is a workaround until the upload_songs table is properly defined in database.types.ts
export type UploadSong = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  upload_at: string;
  created_at?: string;
};

/**
 * Get all songs uploaded by the current user
 * @returns Array of uploaded songs
 */
export const getUserUploadedSongs = async (): Promise<UploadSong[]> => {
  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("User not authenticated:", userError);
      return [];
    }

    // Query the uploaded songs for the current user
    const { data, error } = await supabase
      .from("upload_songs")
      .select("*")
      .eq("user_id", user.id)
      .order("upload_at", { ascending: false });

    if (error) {
      console.log("Error fetching uploaded songs:", error);
      return [];
    }

    return data as UploadSong[];
  } catch (err) {
    console.log("Error in getUserUploadedSongs:", err);
    return [];
  }
};

/**
 * Delete an uploaded song
 * @param songId ID of the song to delete
 * @returns Object with success status and error if any
 */
export const deleteUploadedSong = async (
  songId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Get the song to find the file path
    const { data: song, error: fetchError } = await supabase
      .from("upload_songs")
      .select("*")
      .eq("id", songId)
      .single();

    if (fetchError || !song) {
      console.log("Error fetching song:", fetchError);
      return { success: false, error: fetchError };
    }

    // Extract the file path from the URL
    const url = new URL(song.url);
    const filePath = url.pathname.split("/").slice(-2).join("/"); // Get userId/fileName

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("usermusic")
      .remove([filePath]);

    if (storageError) {
      console.log("Error deleting file from storage:", storageError);
      // Continue anyway to delete the database entry
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("upload_songs")
      .delete()
      .eq("id", songId);

    if (deleteError) {
      console.log("Error deleting song record:", deleteError);
      return { success: false, error: deleteError };
    }

    return { success: true };
  } catch (err) {
    console.log("Error in deleteUploadedSong:", err);
    return { success: false, error: err };
  }
};
