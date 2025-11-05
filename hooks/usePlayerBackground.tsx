// hooks/usePlayerBackground.tsx
import { useEffect, useState } from "react";
import { Image, Platform } from "react-native";
import { colors as appColors } from "@/constants/tokens";

// Kiểm tra nếu không phải là web, mới import thư viện react-native-image-colors
let getColors: any;
if (Platform.OS !== "web") {
  try {
    const imageColors = require("react-native-image-colors");
    getColors = imageColors.getColors;
  } catch (error) {
    console.log("Không thể import react-native-image-colors:", error);
  }
}

type ImageColorsType = {
  background: string;
  primary: string;
};

export const usePlayerBackground = (image: string | number) => {
  const [imageColors, setImageColors] = useState<ImageColorsType>({
    background: appColors.background,
    primary: appColors.background,
  });

  useEffect(() => {
    // Nếu đang chạy trên web hoặc không thể lấy getColors, trả về luôn
    if (Platform.OS === "web" || !getColors) {
      return;
    }

    let uri: string | undefined;

    if (typeof image === "string") {
      uri = image;
    } else {
      const resolved = Image.resolveAssetSource(image);
      uri = resolved?.uri;
    }

    if (!uri) {
      console.warn("⚠️ Không lấy được URI từ ảnh:", image);
      return;
    }

    const fetchColors = async () => {
      try {
        const result = await getColors(uri!, {
          fallback: appColors.background,
          cache: true,
          key: uri,
        });

        if (result.platform === "android") {
          setImageColors({
            background: result.dominant ?? appColors.background,
            primary: result.average ?? appColors.background,
          });
        }
      } catch (err) {
        console.warn(" Lỗi khi lấy màu ảnh:", err);
      }
    };

    fetchColors();
  }, [image]);

  return { imageColors };
};
// Thêm default export để tránh warning từ Expo Router
export default usePlayerBackground;
