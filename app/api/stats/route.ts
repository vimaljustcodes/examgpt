import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's internal ID
    const { data: userResult } = await supabaseAdmin
      .from("users")
      .select("id, messages_used, subscription_status, created_at")
      .eq("clerk_id", userId)
      .single()

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get chat count
    const { count: chatCount } = await supabaseAdmin
      .from("chats")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userResult.id)

    // Get total messages count
    const { count: messageCount } = await supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in(
        "chat_id",
        await supabaseAdmin
          .from("chats")
          .select("id")
          .eq("user_id", userResult.id)
          .then(({ data }) => data?.map((chat) => chat.id) || []),
      )

    // Calculate days since joining
    const daysSinceJoining = Math.floor(
      (Date.now() - new Date(userResult.created_at).getTime()) / (1000 * 60 * 60 * 24),
    )

    return NextResponse.json({
      stats: {
        messagesUsed: userResult.messages_used,
        totalChats: chatCount || 0,
        totalMessages: messageCount || 0,
        subscriptionStatus: userResult.subscription_status,
        daysSinceJoining: Math.max(1, daysSinceJoining),
        messagesPerDay: Math.round((messageCount || 0) / Math.max(1, daysSinceJoining)),
      },
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
