import { createClient } from "@supabase/supabase-js"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database types
export interface User {
  id: string
  clerk_id: string
  email: string
  country?: string
  university?: string
  course?: string
  year?: number
  subscription_status: "free" | "active" | "cancelled" | "expired"
  subscription_plan?: string
  subscription_expires_at?: string
  messages_used: number
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages?: Message[]
}

export interface Message {
  id: string
  chat_id: string
  content: string
  sender: "user" | "ai"
  mode: "explain" | "practice"
  subject: string
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  dodo_payment_id: string
  amount: number
  currency: string
  plan: string
  status: string
  created_at: string
}
