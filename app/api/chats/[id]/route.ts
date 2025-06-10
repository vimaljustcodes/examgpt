import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = params.id

    // Get user ID
    const { data: userResult } = await supabaseAdmin.from("users").select("id").eq("clerk_id", userId).single()

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get chat with messages
    const { data: chat, error } = await supabaseAdmin
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
          mode,
          subject,
          created_at
        )
      `)
      .eq("id", chatId)
      .eq("user_id", userResult.id)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Sort messages by creation time
    if (chat.messages) {
      chat.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    return NextResponse.json({ chat })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = params.id

    // Get user ID
    const { data: userResult } = await supabaseAdmin.from("users").select("id").eq("clerk_id", userId).single()

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete chat (messages will be deleted via CASCADE)
    const { error } = await supabaseAdmin.from("chats").delete().eq("id", chatId).eq("user_id", userResult.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = params.id
    const { title } = await req.json()

    // Get user ID
    const { data: userResult } = await supabaseAdmin.from("users").select("id").eq("clerk_id", userId).single()

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update chat
    const { data: chat, error } = await supabaseAdmin
      .from("chats")
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId)
      .eq("user_id", userResult.id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update chat" }, { status: 500 })
    }

    return NextResponse.json({ chat })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
