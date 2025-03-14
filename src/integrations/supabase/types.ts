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
      contents: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          id: string
          provider: string | null
          publication_date: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
