import React, { useEffect, useState, useRef, useMemo } from "react";
import { ScrollView } from "react-native";
import { Box, Text, VStack, HStack } from "@/components/ui";
import { fetchLyric } from "@/lib/spotify";
import { useActiveTrack, useProgress } from "react-native-track-player";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface Word {
  startTime: number;
  endTime: number;
  data: string;
}

interface Sentence {
  words: Word[];
  startTime: number;
  endTime: number;
}

const KaraokeHeader = () => {
  return (
    <Box className="w-full py-4 px-4">
      <HStack className="items-center justify-between">
        <Feather
          name="chevron-down"
          size={28}
          color="white"
          onPress={() => router.back()}
        />
        <Box className="w-7" />
      </HStack>
    </Box>
  );
};

const parseLyrics = (lyricText: string): Sentence[] => {
  const lines = lyricText.split("\n").filter((line) => line.trim());
  const sentences: Sentence[] = [];

  lines.forEach((line, index) => {
    if (
      line.startsWith("[ti:") ||
      line.startsWith("[ar:") ||
      line.startsWith("[al:")
    ) {
      return;
    }

    const timeMatch = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
    if (timeMatch) {
      const [, minutes, seconds, milliseconds] = timeMatch;
      const currentTime =
        (parseInt(minutes) * 60 + parseInt(seconds)) * 1000 +
        parseInt(milliseconds);

      const lyricText = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, "").trim();
      if (lyricText) {
        const words = lyricText.split(" ").filter((word) => word.trim());

        // Tính thời gian cho mỗi từ dựa trên độ dài của từ và tổng số từ
        const totalWords = words.length;
        const nextLineTime =
          index < lines.length - 1
            ? (() => {
                const nextTimeMatch = lines[index + 1].match(
                  /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
                );
                if (nextTimeMatch) {
                  const [, nextMin, nextSec, nextMs] = nextTimeMatch;
                  return (
                    (parseInt(nextMin) * 60 + parseInt(nextSec)) * 1000 +
                    parseInt(nextMs)
                  );
                }
                return currentTime + 3000; // Mặc định 3 giây nếu không tìm thấy thời gian tiếp theo
              })()
            : currentTime + 3000;

        const timePerWord = (nextLineTime - currentTime) / totalWords;

        const sentenceWords: Word[] = words.map((word, wordIndex) => ({
          startTime: currentTime + wordIndex * timePerWord,
          endTime: currentTime + (wordIndex + 1) * timePerWord,
          data: word,
        }));

        sentences.push({
          words: sentenceWords,
          startTime: sentenceWords[0].startTime,
          endTime: sentenceWords[sentenceWords.length - 1].endTime,
        });
      }
    }
  });

  return sentences;
};

interface KaraokeModeProps {
  lyricText: string;
}
export const KaraokeMode: React.FC<KaraokeModeProps> = ({ lyricText }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const activeTrack = useActiveTrack();
  const scrollViewRef = useRef<ScrollView>(null);
  const progress = useProgress();

  const lyrics = useMemo(() => parseLyrics(lyricText), [lyricText]);
  console.log("length", lyrics.length);
  console.log("isloading", isLoading);

  useEffect(() => {
    const positionMs = progress.position * 1000 + 550;

    const newIndex = lyrics.findIndex(
      (sentence) =>
        positionMs >= sentence.startTime && positionMs <= sentence.endTime
    );

    if (newIndex !== -1 && newIndex !== currentSentenceIndex) {
      setCurrentSentenceIndex(newIndex);
      if (scrollViewRef.current) {
        const itemHeight = 50;
        const screenHeight = 400;
        const scrollPosition = Math.max(
          0,
          newIndex * itemHeight - screenHeight / 2
        );
        scrollViewRef.current.scrollTo({ y: scrollPosition, animated: true });
      }
    }
  }, [progress.position, lyrics]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        {/* <KaraokeHeader /> */}
        <Box className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Đang tải lời bài hát...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (lyrics.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        {/* <KaraokeHeader /> */}
        <Box className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Không tìm thấy lời bài hát</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KaraokeHeader />
      <Box className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack space="md" className="items-center">
            {lyrics.map((sentence, sentenceIndex) => {
              const isCurrentSentence = sentenceIndex === currentSentenceIndex;
              const isPastSentence = sentenceIndex < currentSentenceIndex;

              return (
                <HStack
                  key={sentenceIndex}
                  className={`flex-wrap justify-center px-5 py-2 ${
                    isCurrentSentence
                      ? "opacity-100"
                      : isPastSentence
                      ? "opacity-30"
                      : "opacity-50"
                  }`}
                >
                  {sentence.words.map((word, wordIndex) => (
                    <Text
                      key={wordIndex}
                      className={`${
                        isCurrentSentence
                          ? "text-white text-2xl font-bold"
                          : isPastSentence
                          ? "text-gray-400 text-lg"
                          : "text-gray-500 text-lg"
                      }`}
                    >
                      {word.data}{" "}
                    </Text>
                  ))}
                </HStack>
              );
            })}
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};
