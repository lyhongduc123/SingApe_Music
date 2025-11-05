import { Linking } from "react-native";
import Share from "react-native-share";

/**
 * Hàm chia sẻ bài hát lên Facebook hoặc qua hệ thống share mặc định
 */
export const shareSong = async ({
  title,
  artist,
  url,
  image,
  method = "native", // 'facebook' | 'native'
}: {
  title: string;
  artist: string;
  url: string;
  image?: string;
  method?: "facebook" | "native";
}) => {
  const message = `${title} - ${artist}\nNghe ngay tại: ${url}`;

  if (method === "facebook") {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(title + " - " + artist)}`;

    try {
      await Linking.openURL(facebookShareUrl);
    } catch (err) {
      console.log("Failed to open Facebook:", err);
    }
  } else {
    try {
      await Share.open({
        title: "Chia sẻ bài hát",
        message,
        url,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  }
};
