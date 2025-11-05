import { supabase } from "../supabase";

export const getSongMp3Url = async (songId: string): Promise<string | null> => {
  try {
    // First check if the file exists in storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("songs")
      .list("", {
        search: `${songId}.mp3`,
      });

    if (fileError || !fileData || fileData.length === 0) {
      console.log(
        "File not found in storage:",
        fileError || "No matching files"
      );

      // If not found with .mp3 extension, try without extension
      const { data: fileData2, error: fileError2 } = await supabase.storage
        .from("songs")
        .list("", {
          search: songId,
        });

      if (fileError2 || !fileData2 || fileData2.length === 0) {
        console.log(
          "File not found in storage (second attempt):",
          fileError2 || "No matching files"
        );
        return null;
      }

      // Use the first matching file
      const fileName = fileData2[0].name;
      const { data } = await supabase.storage
        .from("songs")
        .createSignedUrl(`${fileName}`, 3600); // 1 hour expiry

      return data?.signedUrl ?? null;
    }

    // Use the exact .mp3 file found
    const { data, error } = await supabase.storage
      .from("songs")
      .createSignedUrl(`${songId}.mp3`, 3600); // 1 hour expiry

    if (error) {
      console.log("Error creating signed URL:", error);
      return null;
    }

    return data?.signedUrl ?? null;
  } catch (error) {
    console.log("Error in getSongMp3Url:", error);
    return null;
  }
};
