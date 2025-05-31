// import React, { useEffect, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   ImageBackground,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import { useLocalSearchParams, Stack, useRouter } from "expo-router";
// import { getSongsByArtistId } from "@/lib/api/songs";
// import { getArtistById } from "@/lib/api/artists";
// import { Song } from "@/lib/api/songs";
// import { Artist } from "@/lib/api/artists";
// import { Track } from "react-native-track-player";
// import { TrackList } from "@/components/TrackList";
// import CustomHeader from "@/components/CustomHeader";
// import { LoadingOverlay } from "@/components/LoadingOverlay";
// import { Text, VStack, HStack, Button } from "@/components/ui";
// import Feather from "@expo/vector-icons/Feather";
// import { LinearGradient } from "expo-linear-gradient";

// export default function ArtistDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [artist, setArtist] = useState<Artist | null>(null);
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (id) {
//       loadArtistData(id.toString());
//     }
//   }, [id]);

//   const loadArtistData = async (artistId: string) => {
//     try {
//       setLoading(true);
//       // Load artist details
//       const artistData = await getArtistById(artistId);
//       setArtist(artistData);

//       // Load songs by this artist
//       const songsData = await getSongsByArtistId(artistId);
//       setSongs(songsData);
//     } catch (err) {
//       console.error("Failed to load artist data:", err);
//       setError("Failed to load artist data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Convert Song objects to Track objects for TrackList
//   const songsToTracks = (songs: Song[]): Track[] => {
//     return songs.map((song) => ({
//       id: song.id,
//       title: song.title || "Unknown Title",
//       artist: artist?.name || "Unknown Artist",
//       url: song.url || "",
//       artwork:
//         song.cover_url ||
//         artist?.cover_art_url ||
//         "https://via.placeholder.com/400",
//       duration: 0,
//     }));
//   };

//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           header: () => (
//             <CustomHeader title={artist?.name || "Artist"} showBack />
//           ),
//         }}
//       />

//       {loading ? (
//         <LoadingOverlay />
//       ) : error ? (
//         <View style={styles.errorContainer}>
//           <Text className="text-red-500">{error}</Text>
//         </View>
//       ) : (
//         <VStack style={styles.content}>
//           {/* Artist Header with Background */}
//           <View style={styles.headerContainer}>
//             {artist?.cover_art_url ? (
//               <ImageBackground
//                 source={{ uri: artist.cover_art_url }}
//                 style={styles.headerBackground}
//               >
//                 <LinearGradient
//                   colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
//                   style={styles.gradient}
//                 >
//                   <VStack style={styles.artistInfo}>
//                     {artist?.cover_art_url && (
//                       <Image
//                         source={{ uri: artist.cover_art_url }}
//                         style={styles.artistImage}
//                       />
//                     )}
//                     <Text className="text-white text-2xl font-bold mt-4">
//                       {artist?.name || "Unknown Artist"}
//                     </Text>
//                     {artist?.bio && (
//                       <Text
//                         className="text-white text-sm opacity-80 mt-2"
//                         numberOfLines={2}
//                       >
//                         {artist.bio}
//                       </Text>
//                     )}
//                   </VStack>
//                 </LinearGradient>
//               </ImageBackground>
//             ) : (
//               <View style={[styles.headerBackground, styles.placeholderHeader]}>
//                 <VStack style={styles.artistInfo}>
//                   <View style={styles.placeholderArtistImage}>
//                     <Text className="text-white text-4xl font-bold">
//                       {artist?.name?.charAt(0) || "A"}
//                     </Text>
//                   </View>
//                   <Text className="text-black text-2xl font-bold mt-4">
//                     {artist?.name || "Unknown Artist"}
//                   </Text>
//                   {artist?.bio && (
//                     <Text
//                       className="text-black text-sm opacity-80 mt-2"
//                       numberOfLines={2}
//                     >
//                       {artist.bio}
//                     </Text>
//                   )}
//                 </VStack>
//               </View>
//             )}
//           </View>

//           {/* Song List */}
//           <View style={styles.songListContainer}>
//             <HStack className="justify-between items-center mb-4">
//               <Text className="text-xl font-bold">Bài hát</Text>
//               <Text className="text-gray-500">{songs.length} tracks</Text>
//             </HStack>

//             {songs.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <Feather name="music" size={50} color="#ccc" />
//                 <Text className="text-gray-500 mt-4">
//                   Không có bài hát nào của nghệ sĩ này
//                 </Text>
//               </View>
//             ) : (
//               <TrackList scrollEnabled={true} tracks={songsToTracks(songs)} />
//             )}
//           </View>
//         </VStack>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   content: {
//     flex: 1,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   headerContainer: {
//     height: 280,
//   },
//   headerBackground: {
//     width: "100%",
//     height: "100%",
//   },
//   placeholderHeader: {
//     backgroundColor: "#e0e0e0",
//     justifyContent: "flex-end",
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: "flex-end",
//     padding: 20,
//   },
//   artistInfo: {
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   artistImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 2,
//     borderColor: "white",
//   },
//   placeholderArtistImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#888",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   songListContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 30,
//   },
// });
