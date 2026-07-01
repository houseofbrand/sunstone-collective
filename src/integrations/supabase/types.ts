export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      catalogue_download_events: {
        Row: {
          catalogue_id: string | null
          catalogue_slug: string | null
          created_at: string
          id: string
          lead_id: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          catalogue_id?: string | null
          catalogue_slug?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          catalogue_id?: string | null
          catalogue_slug?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_download_events_catalogue_id_fkey"
            columns: ["catalogue_id"]
            isOneToOne: false
            referencedRelation: "catalogues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalogue_download_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "catalogue_downloads"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogue_downloads: {
        Row: {
          city: string
          company: string
          country: string
          created_at: string
          email: string
          gst: string | null
          id: string
          mobile: string
          name: string
        }
        Insert: {
          city: string
          company: string
          country: string
          created_at?: string
          email: string
          gst?: string | null
          id?: string
          mobile: string
          name: string
        }
        Update: {
          city?: string
          company?: string
          country?: string
          created_at?: string
          email?: string
          gst?: string | null
          id?: string
          mobile?: string
          name?: string
        }
        Relationships: []
      }
      catalogues: {
        Row: {
          created_at: string
          description: string | null
          file_path: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_active: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          business_type: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          gst: string | null
          id: string
          message: string | null
          mobile: string
          name: string
          product_category: string | null
          product_code: string | null
          quantity: number | null
          source: string | null
        }
        Insert: {
          business_type?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          gst?: string | null
          id?: string
          message?: string | null
          mobile: string
          name: string
          product_category?: string | null
          product_code?: string | null
          quantity?: number | null
          source?: string | null
        }
        Update: {
          business_type?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          gst?: string | null
          id?: string
          message?: string | null
          mobile?: string
          name?: string
          product_category?: string | null
          product_code?: string | null
          quantity?: number | null
          source?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          height: number | null
          id: string
          is_primary: boolean
          product_id: string
          public_url: string
          size_bytes: number | null
          sort_order: number
          storage_path: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          product_id: string
          public_url: string
          size_bytes?: number | null
          sort_order?: number
          storage_path: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          product_id?: string
          public_url?: string
          size_bytes?: number | null
          sort_order?: number
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_slug: string
          code: string
          colours: string[]
          created_at: string
          description: string | null
          frame_material: string
          id: string
          is_active: boolean
          lens_material: string
          name: string
          price: number
          sort_order: number
          updated_at: string
          weight: string
        }
        Insert: {
          category_slug: string
          code: string
          colours?: string[]
          created_at?: string
          description?: string | null
          frame_material?: string
          id?: string
          is_active?: boolean
          lens_material?: string
          name: string
          price?: number
          sort_order?: number
          updated_at?: string
          weight?: string
        }
        Update: {
          category_slug?: string
          code?: string
          colours?: string[]
          created_at?: string
          description?: string | null
          frame_material?: string
          id?: string
          is_active?: boolean
          lens_material?: string
          name?: string
          price?: number
          sort_order?: number
          updated_at?: string
          weight?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          catalogue_url: string
          id: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          catalogue_url?: string
          id?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          catalogue_url?: string
          id?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
