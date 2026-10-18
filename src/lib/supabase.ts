import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// Only create client if we have valid credentials (not placeholder values)
export const supabase = supabaseUrl !== 'https://placeholder.supabase.co' && 
                        supabaseAnonKey !== 'placeholder_key' &&
                        supabaseUrl.startsWith('https://') &&
                        supabaseAnonKey.startsWith('eyJ')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface Database {
  public: {
    Tables: {
      standings: {
        Row: {
          id: string
          club: string
          logo: string | null
          played: number
          won: number
          lost: number
          pw: number // Penalty shootout wins
          pl: number // Penalty shootout losses
          gf: number
          ga: number
          gd: number
          points: number
          last5: string[] // 'W' | 'PW' | 'PL' | 'L'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club: string
          logo?: string | null
          played?: number
          won?: number
          lost?: number
          pw?: number
          pl?: number
          gf?: number
          ga?: number
          gd?: number
          points?: number
          last5?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club?: string
          logo?: string | null
          played?: number
          won?: number
          lost?: number
          pw?: number
          pl?: number
          gf?: number
          ga?: number
          gd?: number
          points?: number
          last5?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          home_team: string
          away_team: string
          home_image: string | null
          away_image: string | null
          venue: string
          date: string
          home_goals: number | null
          away_goals: number | null
          home_penalties: number | null // Shootout score, only when level after 90 minutes
          away_penalties: number | null
          highlight: string | null
          is_finished: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          home_team: string
          away_team: string
          home_image?: string | null
          away_image?: string | null
          venue: string
          date: string
          home_goals?: number | null
          away_goals?: number | null
          home_penalties?: number | null
          away_penalties?: number | null
          highlight?: string | null
          is_finished?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          home_team?: string
          away_team?: string
          home_image?: string | null
          away_image?: string | null
          venue?: string
          date?: string
          home_goals?: number | null
          away_goals?: number | null
          home_penalties?: number | null
          away_penalties?: number | null
          highlight?: string | null
          is_finished?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
