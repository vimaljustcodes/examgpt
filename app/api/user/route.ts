import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await req.json()

    // Validate required fields
    if (!userData.email || !userData.country || !userData.university || !userData.course || !userData.year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create or update user profile
    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          clerk_id: userId,
          email: userData.email,
          country: userData.country,
          university: userData.university,
          course: userData.course,
          year: userData.year,
          subscription_status: userData.subscription_status || "free",
          messages_used: userData.messages_used || 0,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "clerk_id",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save user data" }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error("User API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("clerk_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    return NextResponse.json({ user: user || null })
  } catch (error) {
    console.error("User API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await req.json()

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error("User API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
