import { Track } from "react-native-track-player";

export interface Album {
    encodeId: string;
    title: string;
    thumbnail: string;
    link: string;
    isIndie: boolean;
    releaseDate: string;
}

export interface Artist {
    id: string;
    encodeId: string;
    name: string;
    link: string;
    spotlight: string;
    alias: string;
    thumbnailM: string;
    thumbnail: string;
    isOA: boolean;
    playlistId: string;
    totalFollow: number;
}

export interface Playlist {
    song: {
        items: ExtendedTrack[];
    }
    artists: Artist[];
}

export interface ExtendedTrack {
    encodeId: string;
    title: string;
    alias: string;
    artists: Artist[];
    album: Album;
    isWorldWide: boolean;
    thumbnailM: string;
    link: string;
    thumbnail: string;
    duration: number;
    releaseDate: string;
    distributor: string;
    hasLyric: boolean;
    weeklyRanking: number;
    score: number;
    rakingStatus: number;
    streamingStatus: number;
    streamPrivileges: number[];
    datatype?: MyTrackType;
}

export type MyTrackType = "playlist" | "album" | "track" | "artist" | "mv" | "user" | "unknown";

export interface MyTrack extends Track {
    id: string;
    score?: number;
    alias?: string;
    description?: string;
    sortDescription?: string;
    rakingStatus?: number;
    weeklyRanking?: number;
    createdBy?: string;
    releaseDate?: string;
    datatype?: MyTrackType;
}

export interface MyPlaylist extends MyTrack {
    tracks: MyTrack[];
}

export interface RegionChart {
    banner: string;
    playlistId: string;
    chartId: number;
    country: string;
    week: string;
    items: ExtendedTrack[];
}

export interface Chart {
    weekChart: {
        vn: RegionChart;
        us: RegionChart;
        korea: RegionChart;
    };
    RTChart: {
        promotes: ExtendedTrack[];
        items: ExtendedTrack[];
    };
    newRelease: ExtendedTrack[];
}

export interface Home {
    items: {
        sectionId: string;
        sectionType: string;
        title: string;
        link: string;
        items: ExtendedTrack[] | {
            all: ExtendedTrack[];
            vPop: ExtendedTrack[];
            others: ExtendedTrack[];
        };
    }[];
}

export interface SearchResult {
    top: ExtendedTrack;
    artists: Artist[];
    songs: ExtendedTrack[];
    playlists: ExtendedTrack[];
}

export interface ArtistResult {
    id: string;
    name: string;
    link: string;
    thumbnail: string;
    thumbnailM: string;
    totalFollow: number;
    sections: [
        {
            sectionId: string;
            sectionType: string;
            title: string;
            link: string;
            items: ExtendedTrack[];
        }
    ]
}