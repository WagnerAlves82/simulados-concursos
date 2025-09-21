// Adicione antes ou após a definição de Database
export type Profile = Database['public']['Tables']['profiles']['Row'];
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
    PostgrestVersion: "13.0.5"
  }

  
public: {
  Tables: {
    areas_conhecimento: {
      Row: {
        created_at: string | null
        descricao: string | null
        id: number
        nome: string
      }
      Insert: {
        created_at?: string | null
        descricao?: string | null
        id?: number
        nome: string
      }
      Update: {
        created_at?: string | null
        descricao?: string | null
        id?: number
        nome?: string
      }
      Relationships: []
    },
    admin_logs: {
      Row: {
        id: number
        user_id: string | null
        action: string
        details: Json | null
        timestamp: string | null
        ip_address: string | null
        user_agent: string | null
      }
      Insert: {
        id?: number
        user_id?: string | null
        action: string
        details?: Json | null
        timestamp?: string | null
        ip_address?: string | null
        user_agent?: string | null
      }
      Update: {
        id?: number
        user_id?: string | null
        action?: string
        details?: Json | null
        timestamp?: string | null
        ip_address?: string | null
        user_agent?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "admin_logs_user_id_fkey"
          columns: ["user_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }
      ]
    },
      cargo_areas: {
        Row: {
          cargo_id: number | null
          created_at: string | null
          area_id: number | null
          id: number
          numero_questoes: number
          peso: number | null
        }
        Insert: {
          area_id?: number | null
          cargo_id?: number | null
          created_at?: string | null
          id?: number
          numero_questoes: number
          peso?: number | null
        }
        Update: {
          area_id?: number | null
          cargo_id?: number | null
          created_at?: string | null
          id?: number
          numero_questoes?: number
          peso?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cargo_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargo_areas_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
      cargos: {
        Row: {
          ativo: boolean | null
          banca: string
          created_at: string | null
          descricao: string | null
          id: number
          nivel_escolaridade: string
          nome: string
          orgao: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          banca?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nivel_escolaridade: string
          nome: string
          orgao: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          banca?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nivel_escolaridade?: string
          nome?: string
          orgao?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      estatisticas_areas: {
        Row: {
          acertos: number | null
          area_id: number | null
          cargo_id: number | null
          id: number
          percentual: number | null
          total_questoes: number | null
          ultima_atualizacao: string | null
          user_id: string | null
        }
        Insert: {
          acertos?: number | null
          area_id?: number | null
          cargo_id?: number | null
          id?: number
          percentual?: number | null
          total_questoes?: number | null
          ultima_atualizacao?: string | null
          user_id?: string | null
        }
        Update: {
          acertos?: number | null
          area_id?: number | null
          cargo_id?: number | null
          id?: number
          percentual?: number | null
          total_questoes?: number | null
          ultima_atualizacao?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estatisticas_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estatisticas_areas_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estatisticas_areas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      legislacao_educacional: {
        Row: {
          ano: number | null
          created_at: string | null
          descricao: string | null
          id: number
          link_oficial: string | null
          numero: string | null
          relevancia: number | null
          tipo: string
          titulo: string
        }
        Insert: {
          ano?: number | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          link_oficial?: string | null
          numero?: string | null
          relevancia?: number | null
          tipo: string
          titulo: string
        }
        Update: {
          ano?: number | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          link_oficial?: string | null
          numero?: string | null
          relevancia?: number | null
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          data_cadastro: string | null
          email: string
          id: string
          nome: string
          plano: string | null
          ultimo_acesso: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_cadastro?: string | null
          email: string
          id: string
          nome: string
          plano?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_cadastro?: string | null
          email?: string
          id?: string
          nome?: string
          plano?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      questao_legislacao: {
        Row: {
          legislacao_id: number
          questao_id: number
        }
        Insert: {
          legislacao_id: number
          questao_id: number
        }
        Update: {
          legislacao_id?: number
          questao_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "questao_legislacao_legislacao_id_fkey"
            columns: ["legislacao_id"]
            isOneToOne: false
            referencedRelation: "legislacao_educacional"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questao_legislacao_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes"
            referencedColumns: ["id"]
          },
        ]
      }
      questoes: {
        Row: {
          alternativa_a: string
          alternativa_b: string
          alternativa_c: string
          alternativa_d: string
          alternativa_e: string | null
          ano_referencia: number | null
          area_id: number | null
          ativo: boolean | null
          cargo_id: number | null
          created_at: string | null
          dificuldade: number | null
          enunciado: string
          feedback: string
          fonte: string | null
          id: number
          resposta_correta: string
          updated_at: string | null
        }
        Insert: {
          alternativa_a: string
          alternativa_b: string
          alternativa_c: string
          alternativa_d: string
          alternativa_e?: string | null
          ano_referencia?: number | null
          area_id?: number | null
          ativo?: boolean | null
          cargo_id?: number | null
          created_at?: string | null
          dificuldade?: number | null
          enunciado: string
          feedback: string
          fonte?: string | null
          id?: number
          resposta_correta: string
          updated_at?: string | null
        }
        Update: {
          alternativa_a?: string
          alternativa_b?: string
          alternativa_c?: string
          alternativa_d?: string
          alternativa_e?: string | null
          ano_referencia?: number | null
          area_id?: number | null
          ativo?: boolean | null
          cargo_id?: number | null
          created_at?: string | null
          dificuldade?: number | null
          enunciado?: string
          feedback?: string
          fonte?: string | null
          id?: number
          resposta_correta?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_questoes_area"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_questoes_cargo"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questoes_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questoes_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
      simulado_questoes: {
        Row: {
          correta: boolean | null
          created_at: string | null
          id: number
          ordem: number
          questao_id: number | null
          resposta_usuario: string | null
          simulado_id: number | null
          tempo_resposta: number | null
        }
        Insert: {
          correta?: boolean | null
          created_at?: string | null
          id?: number
          ordem: number
          questao_id?: number | null
          resposta_usuario?: string | null
          simulado_id?: number | null
          tempo_resposta?: number | null
        }
        Update: {
          correta?: boolean | null
          created_at?: string | null
          id?: number
          ordem?: number
          questao_id?: number | null
          resposta_usuario?: string | null
          simulado_id?: number | null
          tempo_resposta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "simulado_questoes_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulado_questoes_simulado_id_fkey"
            columns: ["simulado_id"]
            isOneToOne: false
            referencedRelation: "simulados"
            referencedColumns: ["id"]
          },
        ]
      }
      simulados: {
        Row: {
          cargo_id: number | null
          configuracoes: Json | null
          created_at: string | null
          data_conclusao: string | null
          data_inicio: string | null
          id: number
          percentual_acertos: number | null
          pontuacao_total: number | null
          status: string | null
          tempo_gasto: number | null
          tipo: string | null
          user_id: string | null
        }
        Insert: {
          cargo_id?: number | null
          configuracoes?: Json | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          id?: number
          percentual_acertos?: number | null
          pontuacao_total?: number | null
          status?: string | null
          tempo_gasto?: number | null
          tipo?: string | null
          user_id?: string | null
        }
        Update: {
          cargo_id?: number | null
          configuracoes?: Json | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          id?: number
          percentual_acertos?: number | null
          pontuacao_total?: number | null
          status?: string | null
          tempo_gasto?: number | null
          tipo?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulados_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulados_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const

// Tipos auxiliares para facilitar o uso
export type Cargo = Tables<'cargos'>
export type Area = Tables<'areas_conhecimento'>
export type Questao = Tables<'questoes'>
export type Simulado = Tables<'simulados'>
export type SimuladoQuestao = Tables<'simulado_questoes'>
export type EstatisticaArea = Tables<'estatisticas_areas'>

// Tipos para inserção
export type CargoInsert = TablesInsert<'cargos'>
export type AreaInsert = TablesInsert<'areas_conhecimento'>
export type QuestaoInsert = TablesInsert<'questoes'>
export type SimuladoInsert = TablesInsert<'simulados'>

// Tipos para atualização
export type CargoUpdate = TablesUpdate<'cargos'>
export type AreaUpdate = TablesUpdate<'areas_conhecimento'>
export type QuestaoUpdate = TablesUpdate<'questoes'>
export type SimuladoUpdate = TablesUpdate<'simulados'>