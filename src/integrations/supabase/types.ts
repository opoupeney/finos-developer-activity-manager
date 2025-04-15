export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          custom_id: string | null
          date: string | null
          end_date: string | null
          id: string
          kick_off_date: string | null
          location: string
          marketing_campaign: string
          marketing_description: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_id?: string | null
          date?: string | null
          end_date?: string | null
          id?: string
          kick_off_date?: string | null
          location: string
          marketing_campaign: string
          marketing_description: string
          status: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_id?: string | null
          date?: string | null
          end_date?: string | null
          id?: string
          kick_off_date?: string | null
          location?: string
          marketing_campaign?: string
          marketing_description?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      ambassadors: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string
          first_name: string
          github_id: string | null
          headshot_url: string | null
          id: string
          last_name: string
          linkedin_profile: string | null
          location: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string
          first_name: string
          github_id?: string | null
          headshot_url?: string | null
          id?: string
          last_name: string
          linkedin_profile?: string | null
          location?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string
          first_name?: string
          github_id?: string | null
          headshot_url?: string | null
          id?: string
          last_name?: string
          linkedin_profile?: string | null
          location?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contents: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          id: string
          provider: string | null
          publication_date: string | null
          source: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          provider?: string | null
          publication_date?: string | null
          source?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          provider?: string | null
          publication_date?: string | null
          source?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      impacts: {
        Row: {
          activity_id: string
          id: string
          projects: string[]
          strategic_initiative: string
          targeted_personas: string[]
          use_case: string
        }
        Insert: {
          activity_id: string
          id?: string
          projects: string[]
          strategic_initiative: string
          targeted_personas: string[]
          use_case: string
        }
        Update: {
          activity_id?: string
          id?: string
          projects?: string[]
          strategic_initiative?: string
          targeted_personas?: string[]
          use_case?: string
        }
        Relationships: [
          {
            foreignKeyName: "impacts_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      key_dates: {
        Row: {
          activity_id: string
          created_at: string
          date: string
          description: string
          id: string
          owner: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          date: string
          description: string
          id?: string
          owner: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          owner?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_dates_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          activity_id: string
          current_participants: number
          current_registrations: number
          id: string
          participation_percentage: number
          registration_percentage: number
          targeted_participants: number
          targeted_registrations: number
        }
        Insert: {
          activity_id: string
          current_participants: number
          current_registrations: number
          id?: string
          participation_percentage: number
          registration_percentage: number
          targeted_participants: number
          targeted_registrations: number
        }
        Update: {
          activity_id?: string
          current_participants?: number
          current_registrations?: number
          id?: string
          participation_percentage?: number
          registration_percentage?: number
          targeted_participants?: number
          targeted_registrations?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      ownerships: {
        Row: {
          activity_id: string
          ambassador: string
          channel: string
          finos_lead: string
          finos_team: string[]
          id: string
          marketing_liaison: string
          member_success_liaison: string
          sponsors_partners: string[]
          toc: string
        }
        Insert: {
          activity_id: string
          ambassador: string
          channel: string
          finos_lead: string
          finos_team: string[]
          id?: string
          marketing_liaison: string
          member_success_liaison: string
          sponsors_partners: string[]
          toc: string
        }
        Update: {
          activity_id?: string
          ambassador?: string
          channel?: string
          finos_lead?: string
          finos_team?: string[]
          id?: string
          marketing_liaison?: string
          member_success_liaison?: string
          sponsors_partners?: string[]
          toc?: string
        }
        Relationships: [
          {
            foreignKeyName: "ownerships_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
