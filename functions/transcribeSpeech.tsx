import { Audio } from "expo-av";
import { MutableRefObject } from "react";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { readBlobAsBase64 } from "./readBlobAsBase64";

// Function to get the appropriate server URL based on platform
const getServerUrl = () => {
  if (Platform.OS === "android") {
    // For Android emulator
    if (!Device.isDevice) {
      return "http://10.0.2.2:4000";
    }
    // For Android device
    return "http://192.168.1.11:4000";
  }
  // For iOS and web
  return "http://localhost:4000";
};

export const transcribeSpeech = async (
  audioRecordingRef: MutableRefObject<Audio.Recording>
) => {
  const status = await audioRecordingRef.current?.getStatusAsync();
  console.log("🎧 Recording status before stop:", status);

  if (!status?.isRecording) {
    console.log("❌ No recording in progress. Cannot stop.");
    return;
  }

  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });
    const isPrepared = audioRecordingRef?.current?._canRecord;
    if (isPrepared) {
      await audioRecordingRef?.current?.stopAndUnloadAsync();

      const recordingUri = audioRecordingRef?.current?.getURI() || "";
      let base64Uri = "";

      if (Platform.OS === "web") {
        const blob = await fetch(recordingUri).then((res) => res.blob());
        const foundBase64 = (await readBlobAsBase64(blob)) as string;
        // Example: data:audio/wav;base64,asdjfioasjdfoaipsjdf
        const removedPrefixBase64 = foundBase64.split("base64,")[1];
        base64Uri = removedPrefixBase64;
      } else {
        base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const dataUrl = base64Uri;

      audioRecordingRef.current = new Audio.Recording();

      const audioConfig = {
        encoding:
          Platform.OS === "android"
            ? "AMR_WB"
            : Platform.OS === "web"
            ? "WEBM_OPUS"
            : "LINEAR16",
        sampleRateHertz:
          Platform.OS === "android"
            ? 16000
            : Platform.OS === "web"
            ? 48000
            : 41000,
        languageCode: "vi-VN",
        alternativeLanguageCodes: ["en-US"],
      };

      if (recordingUri && dataUrl) {
        const serverUrl = getServerUrl();
        console.log("Server URL:", serverUrl);

        try {
          const serverResponse = await fetch(`${serverUrl}/speech-to-text`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ audioUrl: dataUrl, config: audioConfig }),
          });

          if (!serverResponse.ok) {
            throw new Error(
              `Server responded with status: ${serverResponse.status}`
            );
          }

          const data = await serverResponse.json();
          const results = data?.results;
          console.log("Server response:", results);

          if (results) {
            const transcript = results?.[0].alternatives?.[0].transcript;
            if (!transcript) {
              console.log("No transcript found in results");
              return undefined;
            }
            return transcript;
          } else {
            console.log("No results found in server response");
            return undefined;
          }
        } catch (error) {
          console.log("Error calling speech-to-text API:", error);
          return undefined;
        }
      }
    } else {
      console.log("Recording must be prepared prior to unloading");
      return undefined;
    }
  } catch (e) {
    console.log("Failed to transcribe speech!", e);
    return undefined;
  }
};
