// Auto-generated from Supabase — do not edit manually.
// Regenerate with: npx supabase gen types typescript --project-id xakzoieksppiocaxdfhu > types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type WorkspaceRole = 'owner' | 'admin' | 'member'
export type ProjectStatus =
  | 'planning'
  | 'in_progress'
  | 'in_review'
  | 'in_revision'
  | 'awaiting_feedback'
  | 'complete'
  | 'archived'
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type PlanType = 'free' | 'solo' | 'studio'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          plan: PlanType
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          plan?: PlanType
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          logo_url?: string | null
          plan?: PlanType
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: WorkspaceRole
          invited_by: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: WorkspaceRole
          invited_by?: string | null
          joined_at?: string
        }
        Update: {
          role?: WorkspaceRole
        }
      }
      clients: {
        Row: {
          id: string
          workspace_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          website: string | null
          notes: string | null
          avatar_url: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          website?: string | null
          notes?: string | null
          avatar_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          website?: string | null
          notes?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          workspace_id: string
          client_id: string | null
          name: string
          description: string | null
          status: ProjectStatus
          due_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          client_id?: string | null
          name: string
          description?: string | null
          status?: ProjectStatus
          due_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          name?: string
          description?: string | null
          status?: ProjectStatus
          due_date?: string | null
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          workspace_id: string
          project_id: string
          title: string
          description: string | null
          status: TaskStatus
          priority: TaskPriority
          assignee_id: string | null
          due_date: string | null
          completed_at: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          project_id: string
          title: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assignee_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assignee_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          workspace_id: string
          project_id: string
          task_id: string | null
          user_id: string
          description: string | null
          minutes: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          project_id: string
          task_id?: string | null
          user_id: string
          description?: string | null
          minutes: number
          logged_at?: string
          created_at?: string
        }
        Update: {
          description?: string | null
          minutes?: number
          logged_at?: string
        }
      }
      revenue_entries: {
        Row: {
          id: string
          workspace_id: string
          project_id: string | null
          client_id: string | null
          description: string
          amount_cents: number
          currency: string
          invoiced_at: string | null
          paid_at: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          project_id?: string | null
          client_id?: string | null
          description: string
          amount_cents: number
          currency?: string
          invoiced_at?: string | null
          paid_at?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          description?: string
          amount_cents?: number
          currency?: string
          invoiced_at?: string | null
          paid_at?: string | null
        }
      }
      activity_logs: {
        Row: {
          id: string
          workspace_id: string
          actor_id: string
          entity_type: string
          entity_id: string
          action: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          actor_id: string
          entity_type: string
          entity_id: string
          action: string
          metadata?: Json | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: {
      get_user_workspace_ids: {
        Args: Record<string, never>
        Returns: string[]
      }
      get_workspace_role: {
        Args: { p_workspace_id: string }
        Returns: WorkspaceRole
      }
      create_workspace_for_user: {
        Args: { p_name: string; p_slug: string }
        Returns: string
      }
    }
    Enums: {
      workspace_role: WorkspaceRole
      project_status: ProjectStatus
      task_status: TaskStatus
      task_priority: TaskPriority
      plan_type: PlanType
    }
  }
}
