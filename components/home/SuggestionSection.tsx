import React, { useEffect, useMemo, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Text, VStack } from "@/components/ui";
import { supabase } from "@/components/utils/supabase";
import { Track } from "react-native-track-player";
import Library from "@/assets/data/library.json";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { useTracks } from "@/store/library";
import { trackTitleFilter } from "@/helpers/filter";
import { TracksList } from "../TrackList";
import { generateTracksListId } from "@/services/playbackService";

interface SuggestionSectionProps {
  onPressSong?: (song: Track) => void;
}

const SuggestionSection = ({ onPressSong }: SuggestionSectionProps) => {
  const [suggestedSongs, setSuggestedSongs] = useState<Track[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("id, title, url") // lấy đủ fields chuẩn Track
        .limit(10);

      if (error) {
        console.error("Lỗi khi fetch songs từ Supabase:", error.message);
      } else if (data) {
        setSuggestedSongs(data as Track[]);
      }
    };

    fetchSuggestions();
  }, []);
  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: "Find in songs",
    },
  });

  const tracks = useTracks();

  const filteredTracks = useMemo(() => {
    if (!search) return tracks;

    return tracks.filter(trackTitleFilter(search));
  }, [search, tracks]);

  return (
    <VStack className="p-4">
      <Text className="text-2xl font-bold mb-2">Gợi ý cho bạn</Text>
      <TracksList
        id={generateTracksListId("songs", search)}
        tracks={filteredTracks}
        scrollEnabled={false}
      />
    </VStack>
  );
};

export default SuggestionSection;
