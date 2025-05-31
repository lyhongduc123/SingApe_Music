export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      songs: {
        Row: {
          id: string;
          title: string | null;
          release_date: string | null;
          thumbnail_url: string | null;
          artist_names: string | null;
          duration: number | null;
          total_view: number | null;
          view_in_week: number | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          release_date?: string | null;
          thumbnail_url?: string | null;
          artist_names?: string | null;
          duration?: number | null;
          total_view?: number | null;
          view_in_week?: number | null;
        };
        Update: {
          id?: string;
          title?: string | null;
          release_date?: string | null;
          thumbnail_url?: string | null;
          artist_names?: string | null;
          duration?: number | null;
          total_view?: number | null;
          view_in_week?: number | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          created_at: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          email: string | null;
          artist_ids: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          email?: string | null;
          artist_ids?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          email?: string | null;
          artist_ids?: string | null;
        };
        Relationships: [];
      };
      artists: {
        Row: {
          id: string;
          name: string | null;
          bio: string | null;
          alias: string | null;
          thumbnail_url: string | null;
          playlist_id: string | null;
          short_bio: string | null;
          realname: string | null;
          total_view: number | null;
          view_in_week: number | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          bio?: string | null;
          alias?: string | null;
          thumbnail_url?: string | null;
          playlist_id?: string | null;
          short_bio?: string | null;
          realname?: string | null;
          total_view?: number | null;
          view_in_week?: number | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          bio?: string | null;
          alias?: string | null;
          thumbnail_url?: string | null;
          playlist_id?: string | null;
          short_bio?: string | null;
          realname?: string | null;
          total_view?: number | null;
          view_in_week?: number | null;
        };
        Relationships: [];
      };
      albums: {
        Row: {
          id: string;
          title: string | null;
          release_date: string | null;
          cover_url: string | null;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          release_date?: string | null;
          cover_url?: string | null;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string | null;
          release_date?: string | null;
          cover_url?: string | null;
          description?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      genres: {
        Row: {
          id: string;
          name: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      playlists: {
        Row: {
          id: string;
          title: string | null;
          description: string | null;
          user_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          description?: string | null;
          user_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string | null;
          description?: string | null;
          user_id?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      liked_songs: {
        Row: {
          user_id: string;
          song_id: string;
          liked_at: string | null;
        };
        Insert: {
          user_id: string;
          song_id: string;
          liked_at?: string | null;
        };
        Update: {
          user_id?: string;
          song_id?: string;
          liked_at?: string | null;
        };
        Relationships: [];
      };
      followers: {
        Row: {
          user_id: string;
          artist_id: string;
          followed_at: string | null;
        };
        Insert: {
          user_id: string;
          artist_id: string;
          followed_at?: string | null;
        };
        Update: {
          user_id?: string;
          artist_id?: string;
          followed_at?: string | null;
        };
        Relationships: [];
      };
      song_artists: {
        Row: {
          song_id: string;
          artist_id: string;
        };
        Insert: {
          song_id: string;
          artist_id: string;
        };
        Update: {
          song_id?: string;
          artist_id?: string;
        };
        Relationships: [];
      };
      song_genres: {
        Row: {
          song_id: string;
          genre_id: string;
        };
        Insert: {
          song_id: string;
          genre_id: string;
        };
        Update: {
          song_id?: string;
          genre_id?: string;
        };
        Relationships: [];
      };
      playlist_songs: {
        Row: {
          playlist_id: string;
          song_id: string;
          position: number | null;
        };
        Insert: {
          playlist_id: string;
          song_id: string;
          position?: number | null;
        };
        Update: {
          playlist_id?: string;
          song_id?: string;
          position?: number | null;
        };
        Relationships: [];
      };
      album_artists: {
        Row: {
          album_id: string;
          artist_id: string;
        };
        Insert: {
          album_id: string;
          artist_id: string;
        };
        Update: {
          album_id?: string;
          artist_id?: string;
        };
        Relationships: [];
      };
      blacklist: {
        Row: {
          user_id: string;
          song_id: string;
          hated_at: string | null;
        };
        Insert: {
          user_id: string;
          song_id: string;
          hated_at?: string | null;
        };
        Update: {
          user_id?: string;
          song_id?: string;
          hated_at?: string | null;
        };
        Relationships: [];
      };
      song_views: {
        Row: {
          user_id: string;
          song_id: string;
          last_listened_at: string | null;
        };
        Insert: {
          user_id: string;
          song_id: string;
          last_listened_at?: string | null;
        };
        Update: {
          album_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          track_number?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }      
      users: {
        Row: {
          song_id: string;
        };
        Insert: {
          song_id: string;
        };
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      upload_songs: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          upload_at: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          upload_at?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          upload_at?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upload_songs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
