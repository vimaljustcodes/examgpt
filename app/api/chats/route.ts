import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // Get user's chats with message preview
    const { data: userResult } = await supabaseAdmin.from("users").select("id").single()

    if (!userResult) {
      return NextResponse.json({ chats: [] })
    }

    const { data: chats, error } = await supabaseAdmin
      .from("chats")
      .select(`
        id,
        title,
        created_at,
        updated_at,
        messages (
          id,
          content,
          sender,
          created_at
        )
      `)
      .eq("user_id", userResult.id)
      .order("updated_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
    }

    // Format chats with message preview
    const formattedChats =
      chats?.map((chat) => ({
        ...chat,
        messageCount: chat.messages?.length || 0,
        lastMessage: chat.messages?.[chat.messages.length - 1] || null,
        preview: chat.messages?.[0]?.content?.slice(0, 100) || chat.title,
      })) || []

    return NextResponse.json({ chats: formattedChats })
  } catch (error) {
    console.error("Chats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user ID
    const { data: userResult } = await supabaseAdmin.from("users").select("id").single()

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create new chat
    const { data: chat, error } = await supabaseAdmin
      .from("chats")
      .insert({
        user_id: userResult.id,
        title: "New Chat",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
    }

    return NextResponse.json({ chat })
  } catch (error) {
    console.error("Chats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
