import { Alert, Platform } from "react-native";
import RNFS from "react-native-fs";
import { PermissionsAndroid } from "react-native";

// Hàm tải nhạc về
export const downloadSong = async (url: string, filename: string) => {
  try {
    // Kiểm tra quyền truy cập bộ nhớ ngoài trên Android
    if (Platform.OS === "android") {
      // Yêu cầu quyền WRITE_EXTERNAL_STORAGE cho các phiên bản Android thấp hơn 11
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cấp quyền lưu tệp",
          message: "Ứng dụng cần quyền lưu trữ để tải nhạc về",
          buttonNeutral: "Hỏi lại",
          buttonNegative: "Hủy",
          buttonPositive: "Đồng ý",
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Lỗi", "Cần cấp quyền để tải nhạc.");
        return null;
      }
    }

    const path =
      Platform.OS === "android"
        ? `${RNFS.ExternalStorageDirectoryPath}/Download/${filename}` // Lưu vào thư mục Download trên Android
        : `${RNFS.DocumentDirectoryPath}/${filename}`; // Lưu vào thư mục Document trên iOS

    // Tải tệp về
    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
    });

    // Chờ kết quả của quá trình tải
    const result = await download.promise;

    if (result.statusCode === 200) {
      return path;
    } else {
      Alert.alert("Lỗi", "Không thể tải nhạc.");
      return null;
    }
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert("Lỗi", "Đã có lỗi xảy ra khi tải nhạc.");
    return null;
  }
};
