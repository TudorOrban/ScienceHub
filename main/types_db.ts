export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_model_teams: {
        Row: {
          ai_model_id: number
          created_at: string
          role: Database["public"]["Enums"]["role"] | null
          team_id: string
        }
        Insert: {
          ai_model_id: number
          created_at?: string
          role?: Database["public"]["Enums"]["role"] | null
          team_id: string
        }
        Update: {
          ai_model_id?: number
          created_at?: string
          role?: Database["public"]["Enums"]["role"] | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_teams_ai_model_id_fkey"
            columns: ["ai_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_model_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_model_users: {
        Row: {
          ai_model_id: number
          created_at: string
          role: Database["public"]["Enums"]["role"] | null
          user_id: string
        }
        Insert: {
          ai_model_id: number
          created_at?: string
          role?: Database["public"]["Enums"]["role"] | null
          user_id: string
        }
        Update: {
          ai_model_id?: number
          created_at?: string
          role?: Database["public"]["Enums"]["role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_users_ai_model_id_fkey"
            columns: ["ai_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_model_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_models: {
        Row: {
          code_path: string | null
          created_at: string
          current_work_version_id: number | null
          description: string | null
          file_location: Json | null
          folder_id: number | null
          id: number
          model_path: string | null
          model_type: string | null
          public: boolean | null
          submitted: boolean | null
          title: string | null
          updated_at: string | null
          work_metadata: Json | null
          work_type: string | null
        }
        Insert: {
          code_path?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          model_path?: string | null
          model_type?: string | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Update: {
          code_path?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          model_path?: string | null
          model_type?: string | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_current_work_version_id_fkey"
            columns: ["current_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_models_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          }
        ]
      }
      bookmarks: {
        Row: {
          bookmark_data: Json | null
          created_at: string
          id: number
          object_id: number | null
          object_type: string | null
          user_id: string | null
        }
        Insert: {
          bookmark_data?: Json | null
          created_at?: string
          id?: number
          object_id?: number | null
          object_type?: string | null
          user_id?: string | null
        }
        Update: {
          bookmark_data?: Json | null
          created_at?: string
          id?: number
          object_id?: number | null
          object_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          chat_id: number
          content: string | null
          created_at: string
          id: number
          seen: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chat_id?: number
          content?: string | null
          created_at?: string
          id?: number
          seen?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          chat_id?: number
          content?: string | null
          created_at?: string
          id?: number
          seen?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_teams: {
        Row: {
          chat_id: number
          created_at: string
          team_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          team_id: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_teams_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_users: {
        Row: {
          chat_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          user_id: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_users_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chats: {
        Row: {
          created_at: string
          id: number
          title: string | null
          type: Database["public"]["Enums"]["chat_types"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          title?: string | null
          type?: Database["public"]["Enums"]["chat_types"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          title?: string | null
          type?: Database["public"]["Enums"]["chat_types"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      citations: {
        Row: {
          created_at: string
          id: number
          source_object_id: string | null
          source_object_type: string | null
          target_object_id: string | null
          target_object_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          source_object_id?: string | null
          source_object_type?: string | null
          target_object_id?: string | null
          target_object_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          source_object_id?: string | null
          source_object_type?: string | null
          target_object_id?: string | null
          target_object_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      code_block_teams: {
        Row: {
          code_block_id: number
          created_at: string
          role: Database["public"]["Enums"]["role"] | null
          team_id: string
        }
        Insert: {
          code_block_id: number
          created_at?: string
          role?: Database["public"]["Enums"]["role"] | null
          team_id: string
        }
        Update: {
          code_block_id?: number
          created_at?: string
          role?: Database["public"]["Enums"]["role"] | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_block_teams_code_block_id_fkey"
            columns: ["code_block_id"]
            isOneToOne: false
            referencedRelation: "code_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_block_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      code_block_users: {
        Row: {
          code_block_id: number
          created_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          code_block_id: number
          created_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          code_block_id?: number
          created_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_block_users_code_block_id_fkey"
            columns: ["code_block_id"]
            isOneToOne: false
            referencedRelation: "code_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_block_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      code_blocks: {
        Row: {
          code_path: string | null
          created_at: string
          current_work_version_id: number | null
          description: string | null
          file_location: Json | null
          folder_id: number | null
          id: number
          public: boolean | null
          submitted: boolean | null
          title: string | null
          updated_at: string | null
          work_metadata: Json | null
          work_type: string | null
        }
        Insert: {
          code_path?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Update: {
          code_path?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_blocks_current_work_version_id_fkey"
            columns: ["current_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_blocks_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      comment_upvotes: {
        Row: {
          comment_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_upvotes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "discussion_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      data_analyses: {
        Row: {
          created_at: string
          current_work_version_id: number | null
          description: string | null
          file_location: Json | null
          folder_id: number | null
          id: number
          notebook_path: string | null
          public: boolean | null
          submitted: boolean | null
          title: string | null
          updated_at: string | null
          work_metadata: Json | null
          work_type: string | null
        }
        Insert: {
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          notebook_path?: string | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Update: {
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          notebook_path?: string | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_analyses_current_work_version_id_fkey"
            columns: ["current_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_analyses_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      data_analysis_teams: {
        Row: {
          created_at: string
          data_analysis_id: number
          role: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          data_analysis_id: number
          role?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          data_analysis_id?: number
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_analysis_teams_data_analysis_id_fkey"
            columns: ["data_analysis_id"]
            isOneToOne: false
            referencedRelation: "data_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_analysis_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      data_analysis_users: {
        Row: {
          created_at: string
          data_analysis_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data_analysis_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data_analysis_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_analysis_users_data_analysis_id_fkey"
            columns: ["data_analysis_id"]
            isOneToOne: false
            referencedRelation: "data_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_analysis_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dataset_teams: {
        Row: {
          created_at: string
          dataset_id: number
          role: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          dataset_id: number
          role?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          dataset_id?: number
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dataset_teams_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dataset_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      dataset_users: {
        Row: {
          created_at: string
          dataset_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dataset_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dataset_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dataset_users_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dataset_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      datasets: {
        Row: {
          created_at: string
          current_work_version_id: number | null
          dataset_location: Json | null
          description: string | null
          file_location: Json | null
          folder_id: number | null
          id: number
          notes: string[] | null
          public: boolean | null
          submitted: boolean | null
          title: string | null
          updated_at: string | null
          work_metadata: Json | null
          work_type: string | null
        }
        Insert: {
          created_at?: string
          current_work_version_id?: number | null
          dataset_location?: Json | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          notes?: string[] | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Update: {
          created_at?: string
          current_work_version_id?: number | null
          dataset_location?: Json | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          notes?: string[] | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "datasets_current_work_version_id_fkey"
            columns: ["current_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "datasets_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      discussion_comments: {
        Row: {
          children_comments_count: number | null
          content: string | null
          created_at: string | null
          discussion_id: number | null
          id: number
          parent_comment_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          children_comments_count?: number | null
          content?: string | null
          created_at?: string | null
          discussion_id?: number | null
          id?: number
          parent_comment_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          children_comments_count?: number | null
          content?: string | null
          created_at?: string | null
          discussion_id?: number | null
          id?: number
          parent_comment_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "discussion_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      discussion_upvotes: {
        Row: {
          created_at: string
          discussion_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_upvotes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      discussions: {
        Row: {
          content: string | null
          created_at: string
          id: number
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      experiment_teams: {
        Row: {
          created_at: string
          experiment_id: number
          role: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          experiment_id: number
          role?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          experiment_id?: number
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_teams_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      experiment_users: {
        Row: {
          created_at: string
          experiment_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          experiment_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          experiment_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_users_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      experiments: {
        Row: {
          conclusion: string | null
          created_at: string
          current_work_version_id: number | null
          description: string | null
          experiment_path: string | null
          file_location: Json | null
          folder_id: number | null
          hypothesis: string | null
          id: number
          license: string | null
          methodology: Json | null
          objective: string | null
          pdf_path: string | null
          public: boolean | null
          research_grants: string[] | null
          research_score: number | null
          status: string | null
          submitted: boolean | null
          supplementary_material: string | null
          title: string | null
          updated_at: string | null
          work_metadata: Json | null
          work_type: string | null
        }
        Insert: {
          conclusion?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          experiment_path?: string | null
          file_location?: Json | null
          folder_id?: number | null
          hypothesis?: string | null
          id?: number
          license?: string | null
          methodology?: Json | null
          objective?: string | null
          pdf_path?: string | null
          public?: boolean | null
          research_grants?: string[] | null
          research_score?: number | null
          status?: string | null
          submitted?: boolean | null
          supplementary_material?: string | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Update: {
          conclusion?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          experiment_path?: string | null
          file_location?: Json | null
          folder_id?: number | null
          hypothesis?: string | null
          id?: number
          license?: string | null
          methodology?: Json | null
          objective?: string | null
          pdf_path?: string | null
          public?: boolean | null
          research_grants?: string[] | null
          research_score?: number | null
          status?: string | null
          submitted?: boolean | null
          supplementary_material?: string | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiments_current_work_version_id_fkey"
            columns: ["current_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiments_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback_responses: {
        Row: {
          content: string | null
          created_at: string
          feedback_id: number | null
          id: number
          public: boolean | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          feedback_id?: number | null
          id?: number
          public?: boolean | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          feedback_id?: number | null
          id?: number
          public?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedbacks: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: number
          public: boolean | null
          tags: Json[] | null
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: number
          public?: boolean | null
          tags?: Json[] | null
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: number
          public?: boolean | null
          tags?: Json[] | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      field_of_research_relationships: {
        Row: {
          child_field_id: number
          created_at: string
          parent_field_id: number
          relationship_type: string | null
        }
        Insert: {
          child_field_id: number
          created_at?: string
          parent_field_id: number
          relationship_type?: string | null
        }
        Update: {
          child_field_id?: number
          created_at?: string
          parent_field_id?: number
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_of_research_relationships_child_field_id_fkey"
            columns: ["child_field_id"]
            isOneToOne: false
            referencedRelation: "fields_of_research"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_of_research_relationships_parent_field_id_fkey"
            columns: ["parent_field_id"]
            isOneToOne: false
            referencedRelation: "fields_of_research"
            referencedColumns: ["id"]
          }
        ]
      }
      fields_of_research: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          content: string | null
          created_at: string
          id: number
          name: string | null
          project_id: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          name?: string | null
          project_id?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          name?: string | null
          project_id?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      folders: {
        Row: {
          created_at: string | null
          id: number
          name: string
          parent_id: number | null
          project_id: number
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          parent_id?: number | null
          project_id: number
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          parent_id?: number | null
          project_id?: number
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      follows: {
        Row: {
          created_at: string
          followed_id: string
          follower_id: string
        }
        Insert: {
          created_at?: string
          followed_id: string
          follower_id: string
        }
        Update: {
          created_at?: string
          followed_id?: string
          follower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      issue_teams: {
        Row: {
          created_at: string
          issue_id: number
          team_id: string
        }
        Insert: {
          created_at?: string
          issue_id: number
          team_id: string
        }
        Update: {
          created_at?: string
          issue_id?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_teams_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      issue_users: {
        Row: {
          created_at: string
          issue_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          issue_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          issue_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_users_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      issues: {
        Row: {
          created_at: string
          description: string | null
          id: number
          object_id: string | null
          object_type: string | null
          public: boolean | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          object_id?: string | null
          object_type?: string | null
          public?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          object_id?: string | null
          object_type?: string | null
          public?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      liked_songs: {
        Row: {
          created_at: string
          song_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          song_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          song_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liked_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liked_songs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      links: {
        Row: {
          created_at: string
          id: number
          relationship_type: string | null
          source_object_id: string | null
          source_object_type: string | null
          target_object_id: string | null
          target_object_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          relationship_type?: string | null
          source_object_id?: string | null
          source_object_type?: string | null
          target_object_id?: string | null
          target_object_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          relationship_type?: string | null
          source_object_id?: string | null
          source_object_type?: string | null
          target_object_id?: string | null
          target_object_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      paper_teams: {
        Row: {
          created_at: string
          paper_id: number
          role: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          paper_id: number
          role?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          paper_id?: number
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_teams_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_users: {
        Row: {
          created_at: string
          paper_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          paper_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          paper_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_users_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      papers: {
        Row: {
          abstract: string | null
          created_at: string
          current_work_version_id: number | null
          description: string | null
          file_location: Json | null
          folder_id: number | null
          id: number
          pdf_path: string | null
          public: boolean | null
          submitted: boolean | null
          title: string | null
          updated_at: string | null
          work_metadata: Json | null
          work_type: string | null
        }
        Insert: {
          abstract?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          pdf_path?: string | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Update: {
          abstract?: string | null
          created_at?: string
          current_work_version_id?: number | null
          description?: string | null
          file_location?: Json | null
          folder_id?: number | null
          id?: number
          pdf_path?: string | null
          public?: boolean | null
          submitted?: boolean | null
          title?: string | null
          updated_at?: string | null
          work_metadata?: Json | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "papers_current_work_version_id_fkey"
            columns: ["current_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "papers_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      plan_users: {
        Row: {
          created_at: string
          plan_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          plan_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          plan_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_users_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      plans: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          ending_at_date: string | null
          id: number
          linked_objects: Json | null
          public: boolean | null
          starting_at_date: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          ending_at_date?: string | null
          id?: number
          linked_objects?: Json | null
          public?: boolean | null
          starting_at_date?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          ending_at_date?: string | null
          id?: number
          linked_objects?: Json | null
          public?: boolean | null
          starting_at_date?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      project_ai_models: {
        Row: {
          ai_model_id: number
          created_at: string
          project_id: number
        }
        Insert: {
          ai_model_id: number
          created_at?: string
          project_id: number
        }
        Update: {
          ai_model_id?: number
          created_at?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_ai_models_ai_model_id_fkey"
            columns: ["ai_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_ai_models_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_code_blocks: {
        Row: {
          code_block_id: number
          created_at: string
          project_id: number
        }
        Insert: {
          code_block_id: number
          created_at?: string
          project_id: number
        }
        Update: {
          code_block_id?: number
          created_at?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_code_blocks_code_block_id_fkey"
            columns: ["code_block_id"]
            isOneToOne: false
            referencedRelation: "code_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_code_blocks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_data_analyses: {
        Row: {
          created_at: string
          data_analysis_id: number
          project_id: number
        }
        Insert: {
          created_at?: string
          data_analysis_id: number
          project_id: number
        }
        Update: {
          created_at?: string
          data_analysis_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_data_analyses_data_analysis_id_fkey"
            columns: ["data_analysis_id"]
            isOneToOne: false
            referencedRelation: "data_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_data_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_datasets: {
        Row: {
          created_at: string
          dataset_id: number
          project_id: number
        }
        Insert: {
          created_at?: string
          dataset_id: number
          project_id: number
        }
        Update: {
          created_at?: string
          dataset_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_datasets_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_datasets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_deltas: {
        Row: {
          created_at: string
          delta_data: Json | null
          final_project_version_id: number | null
          id: number
          initial_project_version_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          delta_data?: Json | null
          final_project_version_id?: number | null
          id?: number
          initial_project_version_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          delta_data?: Json | null
          final_project_version_id?: number | null
          id?: number
          initial_project_version_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_deltas_final_project_version_id_fkey"
            columns: ["final_project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_deltas_initial_project_version_id_fkey"
            columns: ["initial_project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          }
        ]
      }
      project_experiments: {
        Row: {
          created_at: string
          experiment_id: number
          project_id: number
        }
        Insert: {
          created_at?: string
          experiment_id: number
          project_id: number
        }
        Update: {
          created_at?: string
          experiment_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_experiments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_experiments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_fields_of_research: {
        Row: {
          created_at: string
          field_of_research_id: number
          project_id: number
        }
        Insert: {
          created_at?: string
          field_of_research_id: number
          project_id: number
        }
        Update: {
          created_at?: string
          field_of_research_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_fields_of_research_field_of_research_id_fkey"
            columns: ["field_of_research_id"]
            isOneToOne: false
            referencedRelation: "fields_of_research"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_fields_of_research_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_issue_responses: {
        Row: {
          content: string | null
          created_at: string
          id: number
          project_issue_id: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          project_issue_id?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          project_issue_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_issue_responses_project_issue_id_fkey"
            columns: ["project_issue_id"]
            isOneToOne: false
            referencedRelation: "project_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issue_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_issue_teams: {
        Row: {
          created_at: string
          project_issue_id: number
          team_id: string
        }
        Insert: {
          created_at?: string
          project_issue_id: number
          team_id: string
        }
        Update: {
          created_at?: string
          project_issue_id?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_issue_teams_project_issue_id_fkey"
            columns: ["project_issue_id"]
            isOneToOne: false
            referencedRelation: "project_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issue_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      project_issue_users: {
        Row: {
          created_at: string
          project_issue_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          project_issue_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          project_issue_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_issue_users_project_issue_id_fkey"
            columns: ["project_issue_id"]
            isOneToOne: false
            referencedRelation: "project_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issue_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_issues: {
        Row: {
          created_at: string
          description: string | null
          id: number
          project_id: number | null
          public: boolean | null
          status: Database["public"]["Enums"]["issue_status"] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_papers: {
        Row: {
          created_at: string
          paper_id: number
          project_id: number
        }
        Insert: {
          created_at?: string
          paper_id: number
          project_id: number
        }
        Update: {
          created_at?: string
          paper_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_papers_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_papers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_review_teams: {
        Row: {
          created_at: string
          project_review_id: number
          team_id: string
        }
        Insert: {
          created_at?: string
          project_review_id: number
          team_id: string
        }
        Update: {
          created_at?: string
          project_review_id?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_review_teams_project_review_id_fkey"
            columns: ["project_review_id"]
            isOneToOne: false
            referencedRelation: "project_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_review_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      project_review_users: {
        Row: {
          created_at: string
          project_review_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          project_review_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          project_review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_review_users_project_review_id_fkey"
            columns: ["project_review_id"]
            isOneToOne: false
            referencedRelation: "project_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_review_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_reviews: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: number
          project_id: number | null
          public: boolean | null
          review_type: Database["public"]["Enums"]["review_type"] | null
          status: Database["public"]["Enums"]["review_status"] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          review_type?: Database["public"]["Enums"]["review_type"] | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          review_type?: Database["public"]["Enums"]["review_type"] | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_shares: {
        Row: {
          created_at: string | null
          project_id: number
          sharing_user_id: string
        }
        Insert: {
          created_at?: string | null
          project_id: number
          sharing_user_id: string
        }
        Update: {
          created_at?: string | null
          project_id?: number
          sharing_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_shares_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_shares_sharing_user_id_fkey"
            columns: ["sharing_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_snapshots: {
        Row: {
          created_at: string
          id: number
          project_id: number | null
          project_version_id: number | null
          snapshot_data: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          project_id?: number | null
          project_version_id?: number | null
          snapshot_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          project_id?: number | null
          project_version_id?: number | null
          snapshot_data?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_snapshots_project_version_id_fkey"
            columns: ["project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          }
        ]
      }
      project_submission_teams: {
        Row: {
          created_at: string
          project_submission_id: number | null
          role: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          project_submission_id?: number | null
          role?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          project_submission_id?: number | null
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_submission_teams_project_submission_id_fkey"
            columns: ["project_submission_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submission_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      project_submission_users: {
        Row: {
          created_at: string
          project_submission_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          project_submission_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          project_submission_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_submission_users_project_submission_id_fkey"
            columns: ["project_submission_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submission_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_submissions: {
        Row: {
          accepted_data: Json | null
          created_at: string
          description: string | null
          final_project_version_id: number | null
          id: number
          initial_project_version_id: number | null
          project_delta: Json | null
          project_id: number | null
          public: boolean | null
          status: Database["public"]["Enums"]["submission_status"] | null
          submitted_data: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_data?: Json | null
          created_at?: string
          description?: string | null
          final_project_version_id?: number | null
          id?: number
          initial_project_version_id?: number | null
          project_delta?: Json | null
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_data?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_data?: Json | null
          created_at?: string
          description?: string | null
          final_project_version_id?: number | null
          id?: number
          initial_project_version_id?: number | null
          project_delta?: Json | null
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_data?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_submissions_final_project_version_id_fkey"
            columns: ["final_project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submissions_initial_project_version_id_fkey"
            columns: ["initial_project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_teams: {
        Row: {
          created_at: string
          project_id: number
          role: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          project_id: number
          role?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          project_id?: number
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_teams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      project_upvotes: {
        Row: {
          created_at: string
          project_id: number
          upvoting_user_id: string
        }
        Insert: {
          created_at?: string
          project_id: number
          upvoting_user_id: string
        }
        Update: {
          created_at?: string
          project_id?: number
          upvoting_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_upvotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_upvotes_upvoting_user_id_fkey"
            columns: ["upvoting_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_users: {
        Row: {
          created_at: string
          project_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          project_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          project_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_version_teams: {
        Row: {
          created_at: string
          project_version_id: number
          role: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          project_version_id: number
          role?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          project_version_id?: number
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_version_teams_project_version_id_fkey"
            columns: ["project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_version_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      project_version_users: {
        Row: {
          created_at: string
          project_version_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          project_version_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          project_version_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_version_users_project_version_id_fkey"
            columns: ["project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_version_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_versions: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          project_id: number
          updated_at: string | null
          version_number: number | null
          version_tag: string | null
          works: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          project_id: number
          updated_at?: string | null
          version_number?: number | null
          version_tag?: string | null
          works?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          project_id?: number
          updated_at?: string | null
          version_number?: number | null
          version_tag?: string | null
          works?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "project_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_versions_graphs: {
        Row: {
          created_at: string
          graph_data: Json | null
          id: number
          project_id: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          graph_data?: Json | null
          id?: number
          project_id?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          graph_data?: Json | null
          id?: number
          project_id?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_versions_graphs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_views: {
        Row: {
          created_at: string
          project_id: number
          viewing_user_id: string
        }
        Insert: {
          created_at?: string
          project_id: number
          viewing_user_id: string
        }
        Update: {
          created_at?: string
          project_id?: number
          viewing_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_views_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_views_viewing_user_id_fkey"
            columns: ["viewing_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_work_submissions: {
        Row: {
          project_submission_id: number
          work_submission_id: number
        }
        Insert: {
          project_submission_id: number
          work_submission_id: number
        }
        Update: {
          project_submission_id?: number
          work_submission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_work_submissions_project_submission_id_fkey"
            columns: ["project_submission_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_work_submissions_work_submission_id_fkey"
            columns: ["work_submission_id"]
            isOneToOne: false
            referencedRelation: "work_submissions"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string
          current_project_version_id: number | null
          description: string | null
          h_index: number | null
          id: number
          image_path: string | null
          keywords: string[] | null
          license: string | null
          name: string | null
          project_metadata: Json | null
          public: boolean | null
          research_grants: string[] | null
          research_score: number | null
          stars: number | null
          title: string | null
          total_citations_count: number | null
          total_project_citations_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          current_project_version_id?: number | null
          description?: string | null
          h_index?: number | null
          id?: number
          image_path?: string | null
          keywords?: string[] | null
          license?: string | null
          name?: string | null
          project_metadata?: Json | null
          public?: boolean | null
          research_grants?: string[] | null
          research_score?: number | null
          stars?: number | null
          title?: string | null
          total_citations_count?: number | null
          total_project_citations_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          current_project_version_id?: number | null
          description?: string | null
          h_index?: number | null
          id?: number
          image_path?: string | null
          keywords?: string[] | null
          license?: string | null
          name?: string | null
          project_metadata?: Json | null
          public?: boolean | null
          research_grants?: string[] | null
          research_score?: number | null
          stars?: number | null
          title?: string | null
          total_citations_count?: number | null
          total_project_citations_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_current_project_version_id_fkey"
            columns: ["current_project_version_id"]
            isOneToOne: false
            referencedRelation: "project_versions"
            referencedColumns: ["id"]
          }
        ]
      }
      review_teams: {
        Row: {
          created_at: string
          review_id: number
          team_id: string
        }
        Insert: {
          created_at?: string
          review_id: number
          team_id: string
        }
        Update: {
          created_at?: string
          review_id?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_teams_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      review_users: {
        Row: {
          created_at: string
          review_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          review_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_users_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          created_at: string
          description: string | null
          id: number
          object_id: string | null
          object_type: string | null
          public: boolean | null
          review_type: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          object_id?: string | null
          object_type?: string | null
          public?: boolean | null
          review_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          object_id?: string | null
          object_type?: string | null
          public?: boolean | null
          review_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      songs: {
        Row: {
          author: string | null
          created_at: string
          id: number
          image_path: string | null
          song_path: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_users: {
        Row: {
          created_at: string
          role: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          public: boolean | null
          team_name: string | null
          team_username: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          public?: boolean | null
          team_name?: string | null
          team_username?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          public?: boolean | null
          team_name?: string | null
          team_username?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          editor_settings: Json | null
          header_off: boolean | null
          pinned_pages: Json | null
          research_highlights: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          editor_settings?: Json | null
          header_off?: boolean | null
          pinned_pages?: Json | null
          research_highlights?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          editor_settings?: Json | null
          header_off?: boolean | null
          pinned_pages?: Json | null
          research_highlights?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_status: {
        Row: {
          created_at: string
          id: number
          is_online: boolean | null
          last_seen: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_online?: boolean | null
          last_seen?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_online?: boolean | null
          last_seen?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          affiliations: string | null
          avatar_url: string | null
          billing_address: Json | null
          bio: string | null
          contact_information: string | null
          created_at: string | null
          education: string | null
          email: string | null
          external_accounts: Json | null
          fields_of_research: string | null
          first_name: string | null
          full_name: string
          h_index: number | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          location: string | null
          number_of_projects: number | null
          number_of_submissions: number | null
          number_of_works: number | null
          occupations: string | null
          payment_method: Json | null
          positions: Json | null
          qualifications: string | null
          research_interests: string | null
          research_score: number | null
          reviews_count: number | null
          roles: string | null
          status: string | null
          total_citations: number | null
          total_upvotes: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          affiliations?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          bio?: string | null
          contact_information?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          external_accounts?: Json | null
          fields_of_research?: string | null
          first_name?: string | null
          full_name: string
          h_index?: number | null
          id: string
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          number_of_projects?: number | null
          number_of_submissions?: number | null
          number_of_works?: number | null
          occupations?: string | null
          payment_method?: Json | null
          positions?: Json | null
          qualifications?: string | null
          research_interests?: string | null
          research_score?: number | null
          reviews_count?: number | null
          roles?: string | null
          status?: string | null
          total_citations?: number | null
          total_upvotes?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          affiliations?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          bio?: string | null
          contact_information?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          external_accounts?: Json | null
          fields_of_research?: string | null
          first_name?: string | null
          full_name?: string
          h_index?: number | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          number_of_projects?: number | null
          number_of_submissions?: number | null
          number_of_works?: number | null
          occupations?: string | null
          payment_method?: Json | null
          positions?: Json | null
          qualifications?: string | null
          research_interests?: string | null
          research_score?: number | null
          reviews_count?: number | null
          roles?: string | null
          status?: string | null
          total_citations?: number | null
          total_upvotes?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      work_deltas: {
        Row: {
          created_at: string
          delta_data: Json | null
          id: number
          updated_at: string | null
          work_type: string | null
          work_version_id_from: number | null
          work_version_id_to: number | null
        }
        Insert: {
          created_at?: string
          delta_data?: Json | null
          id?: number
          updated_at?: string | null
          work_type?: string | null
          work_version_id_from?: number | null
          work_version_id_to?: number | null
        }
        Update: {
          created_at?: string
          delta_data?: Json | null
          id?: number
          updated_at?: string | null
          work_type?: string | null
          work_version_id_from?: number | null
          work_version_id_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_deltas_work_version_id_from_fkey"
            columns: ["work_version_id_from"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_deltas_work_version_id_to_fkey"
            columns: ["work_version_id_to"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          }
        ]
      }
      work_fields_of_research: {
        Row: {
          created_at: string
          field_of_research_id: number | null
          work_id: number | null
          work_type: string | null
        }
        Insert: {
          created_at?: string
          field_of_research_id?: number | null
          work_id?: number | null
          work_type?: string | null
        }
        Update: {
          created_at?: string
          field_of_research_id?: number | null
          work_id?: number | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_fields_of_research_field_of_research_id_fkey"
            columns: ["field_of_research_id"]
            isOneToOne: false
            referencedRelation: "fields_of_research"
            referencedColumns: ["id"]
          }
        ]
      }
      work_issue_responses: {
        Row: {
          content: string | null
          created_at: string
          id: number
          user_id: string | null
          work_issue_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
          work_issue_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
          work_issue_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_issue_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_issue_responses_work_issue_id_fkey"
            columns: ["work_issue_id"]
            isOneToOne: false
            referencedRelation: "work_issues"
            referencedColumns: ["id"]
          }
        ]
      }
      work_issue_teams: {
        Row: {
          created_at: string
          team_id: string
          work_issue_id: number
        }
        Insert: {
          created_at?: string
          team_id: string
          work_issue_id: number
        }
        Update: {
          created_at?: string
          team_id?: string
          work_issue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_issue_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_issue_teams_work_issue_id_fkey"
            columns: ["work_issue_id"]
            isOneToOne: false
            referencedRelation: "work_issues"
            referencedColumns: ["id"]
          }
        ]
      }
      work_issue_users: {
        Row: {
          created_at: string
          user_id: string
          work_issue_id: number
        }
        Insert: {
          created_at?: string
          user_id: string
          work_issue_id: number
        }
        Update: {
          created_at?: string
          user_id?: string
          work_issue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_issue_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_issue_users_work_issue_id_fkey"
            columns: ["work_issue_id"]
            isOneToOne: false
            referencedRelation: "work_issues"
            referencedColumns: ["id"]
          }
        ]
      }
      work_issues: {
        Row: {
          created_at: string
          description: string | null
          id: number
          project_id: number | null
          public: boolean | null
          status: Database["public"]["Enums"]["issue_status"] | null
          title: string | null
          updated_at: string | null
          work_id: number | null
          work_type: Database["public"]["Enums"]["work_type"] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title?: string | null
          updated_at?: string | null
          work_id?: number | null
          work_type?: Database["public"]["Enums"]["work_type"] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title?: string | null
          updated_at?: string | null
          work_id?: number | null
          work_type?: Database["public"]["Enums"]["work_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "work_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      work_review_teams: {
        Row: {
          created_at: string
          team_id: string
          work_review_id: number
        }
        Insert: {
          created_at?: string
          team_id: string
          work_review_id: number
        }
        Update: {
          created_at?: string
          team_id?: string
          work_review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_review_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_review_teams_work_review_id_fkey"
            columns: ["work_review_id"]
            isOneToOne: false
            referencedRelation: "work_reviews"
            referencedColumns: ["id"]
          }
        ]
      }
      work_review_users: {
        Row: {
          created_at: string
          user_id: string
          work_review_id: number
        }
        Insert: {
          created_at?: string
          user_id: string
          work_review_id: number
        }
        Update: {
          created_at?: string
          user_id?: string
          work_review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_review_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_review_users_work_review_id_fkey"
            columns: ["work_review_id"]
            isOneToOne: false
            referencedRelation: "work_reviews"
            referencedColumns: ["id"]
          }
        ]
      }
      work_reviews: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: number
          project_id: number | null
          public: boolean | null
          review_type: Database["public"]["Enums"]["review_type"] | null
          status: Database["public"]["Enums"]["review_status"] | null
          title: string | null
          updated_at: string | null
          work_id: number | null
          work_type: Database["public"]["Enums"]["work_type"] | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          review_type?: Database["public"]["Enums"]["review_type"] | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          updated_at?: string | null
          work_id?: number | null
          work_type?: Database["public"]["Enums"]["work_type"] | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: number
          project_id?: number | null
          public?: boolean | null
          review_type?: Database["public"]["Enums"]["review_type"] | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          updated_at?: string | null
          work_id?: number | null
          work_type?: Database["public"]["Enums"]["work_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "work_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      work_snapshots: {
        Row: {
          created_at: string
          id: number
          snapshot_data: Json | null
          work_id: string | null
          work_type: string | null
          work_version_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          snapshot_data?: Json | null
          work_id?: string | null
          work_type?: string | null
          work_version_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          snapshot_data?: Json | null
          work_id?: string | null
          work_type?: string | null
          work_version_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_snapshots_work_version_id_fkey"
            columns: ["work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          }
        ]
      }
      work_submission_teams: {
        Row: {
          created_at: string
          team_id: string
          work_submission_id: number
        }
        Insert: {
          created_at?: string
          team_id: string
          work_submission_id: number
        }
        Update: {
          created_at?: string
          team_id?: string
          work_submission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_submission_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_submission_teams_work_submission_id_fkey"
            columns: ["work_submission_id"]
            isOneToOne: false
            referencedRelation: "work_submissions"
            referencedColumns: ["id"]
          }
        ]
      }
      work_submission_users: {
        Row: {
          created_at: string
          role: string | null
          user_id: string
          work_submission_id: number
        }
        Insert: {
          created_at?: string
          role?: string | null
          user_id: string
          work_submission_id: number
        }
        Update: {
          created_at?: string
          role?: string | null
          user_id?: string
          work_submission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_submission_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_submission_users_work_submission_id_fkey"
            columns: ["work_submission_id"]
            isOneToOne: false
            referencedRelation: "work_submissions"
            referencedColumns: ["id"]
          }
        ]
      }
      work_submissions: {
        Row: {
          accepted_data: Json | null
          created_at: string
          description: string | null
          file_changes: Json | null
          final_work_version_id: number | null
          id: number
          initial_work_version_id: number | null
          project_id: number | null
          public: boolean | null
          status: Database["public"]["Enums"]["submission_status"] | null
          submitted_data: Json | null
          title: string | null
          updated_at: string | null
          work_delta: Json | null
          work_id: number | null
          work_type: Database["public"]["Enums"]["work_type"] | null
        }
        Insert: {
          accepted_data?: Json | null
          created_at?: string
          description?: string | null
          file_changes?: Json | null
          final_work_version_id?: number | null
          id?: number
          initial_work_version_id?: number | null
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_data?: Json | null
          title?: string | null
          updated_at?: string | null
          work_delta?: Json | null
          work_id?: number | null
          work_type?: Database["public"]["Enums"]["work_type"] | null
        }
        Update: {
          accepted_data?: Json | null
          created_at?: string
          description?: string | null
          file_changes?: Json | null
          final_work_version_id?: number | null
          id?: number
          initial_work_version_id?: number | null
          project_id?: number | null
          public?: boolean | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_data?: Json | null
          title?: string | null
          updated_at?: string | null
          work_delta?: Json | null
          work_id?: number | null
          work_type?: Database["public"]["Enums"]["work_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "work_submissions_final_work_version_id_fkey"
            columns: ["final_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_submissions_initial_work_version_id_fkey"
            columns: ["initial_work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      work_version_teams: {
        Row: {
          created_at: string
          role: string | null
          team_id: string
          work_version_id: number
        }
        Insert: {
          created_at?: string
          role?: string | null
          team_id: string
          work_version_id: number
        }
        Update: {
          created_at?: string
          role?: string | null
          team_id?: string
          work_version_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_version_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_version_teams_work_version_id_fkey"
            columns: ["work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          }
        ]
      }
      work_version_users: {
        Row: {
          created_at: string
          role: string | null
          user_id: string
          work_version_id: number
        }
        Insert: {
          created_at?: string
          role?: string | null
          user_id: string
          work_version_id: number
        }
        Update: {
          created_at?: string
          role?: string | null
          user_id?: string
          work_version_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_version_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_version_users_work_version_id_fkey"
            columns: ["work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          }
        ]
      }
      work_versions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          public: boolean | null
          updated_at: string | null
          version_number: number | null
          work_id: number | null
          work_type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          public?: boolean | null
          updated_at?: string | null
          version_number?: number | null
          work_id?: number | null
          work_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          public?: boolean | null
          updated_at?: string | null
          version_number?: number | null
          work_id?: number | null
          work_type?: string | null
        }
        Relationships: []
      }
      work_versions_graphs: {
        Row: {
          created_at: string
          graph_data: Json | null
          id: number
          work_id: number | null
          work_type: string | null
        }
        Insert: {
          created_at?: string
          graph_data?: Json | null
          id?: number
          work_id?: number | null
          work_type?: string | null
        }
        Update: {
          created_at?: string
          graph_data?: Json | null
          id?: number
          work_id?: number | null
          work_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_work_submissions: {
        Args: {
          version_pairs: number[]
        }
        Returns: {
          id: number
          work_type: string
          work_id: number
          initial_work_version_id: number
          final_work_version_id: number
          project_id: number
          work_delta: Json
        }[]
      }
      update_project_delta_partial: {
        Args: {
          submission_id: number
          delta_changes: Json
        }
        Returns: undefined
      }
      update_work_delta_field: {
        Args: {
          submission_id: number
          field_path: string[]
          new_value: Json
        }
        Returns: undefined
      }
      update_work_delta_fields: {
        Args: {
          submission_id: number
          keys: string[]
          new_values: Json[]
        }
        Returns: undefined
      }
      update_work_delta_partial: {
        Args: {
          submission_id: number
          delta_changes: Json
        }
        Returns: undefined
      }
      update_work_deltas: {
        Args: {
          submission_id: number
          field_paths: string[]
          new_values: Json[]
        }
        Returns: undefined
      }
    }
    Enums: {
      chat_types: "Private chat" | "Group chat"
      issue_status: "Opened" | "Closed"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      review_status: "In progress" | "Submitted"
      review_type: "Community Review" | "Blind Review"
      role: "Main Author" | "Contributor"
      submission_status: "In progress" | "Submitted" | "Accepted"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
      work_type:
        | "Paper"
        | "Experiment"
        | "Dataset"
        | "Data Analysis"
        | "AI Model"
        | "Code Block"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
