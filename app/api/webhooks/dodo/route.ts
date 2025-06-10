import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import crypto from "crypto"

function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")

    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("dodo-signature") || req.headers.get("x-dodo-signature")
    const body = await req.text()

    // Verify webhook signature if secret is provided
    if (process.env.DODO_PAYMENTS_WEBHOOK_SECRET && signature) {
      const isValid = verifySignature(body, signature, process.env.DODO_PAYMENTS_WEBHOOK_SECRET)
      if (!isValid) {
        console.error("Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const event = JSON.parse(body)
    console.log("Received webhook event:", event.type)

    switch (event.type) {
      case "payment.completed":
      case "payment.success":
        await handlePaymentSuccess(event.data)
        break

      case "payment.failed":
        await handlePaymentFailed(event.data)
        break

      case "subscription.created":
        await handleSubscriptionCreated(event.data)
        break

      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.data)
        break

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentSuccess(data: any) {
  try {
    const { customer_id, metadata, amount, currency, id: paymentId } = data
    const { plan_id, user_id } = metadata || {}

    if (!user_id || !plan_id) {
      console.error("Missing user_id or plan_id in webhook metadata")
      return
    }

    // Calculate expiration date
    const expiresAt = plan_id === "lifetime" ? new Date("2099-12-31") : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    // Update user subscription
    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({
        subscription_status: "active",
        subscription_plan: plan_id,
        subscription_expires_at: expiresAt.toISOString(),
        messages_used: 0, // Reset message count
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_id", user_id)

    if (userError) {
      console.error("Failed to update user subscription:", userError)
      return
    }

    // Get user's internal ID for payment record
    const { data: user } = await supabaseAdmin.from("users").select("id").eq("clerk_id", user_id).single()

    if (user) {
      // Save payment record
      await supabaseAdmin.from("payments").insert({
        user_id: user.id,
        dodo_payment_id: paymentId,
        amount: amount || 0,
        currency: currency || "INR",
        plan: plan_id,
        status: "completed",
        created_at: new Date().toISOString(),
      })
    }

    console.log(`Payment successful for user ${user_id}, plan ${plan_id}`)
  } catch (error) {
    console.error("Error handling payment success:", error)
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const { metadata, id: paymentId } = data
    const { user_id } = metadata || {}

    if (!user_id) return

    // Get user's internal ID
    const { data: user } = await supabaseAdmin.from("users").select("id").eq("clerk_id", user_id).single()

    if (user) {
      // Save failed payment record
      await supabaseAdmin.from("payments").insert({
        user_id: user.id,
        dodo_payment_id: paymentId,
        amount: data.amount || 0,
        currency: data.currency || "INR",
        plan: metadata.plan_id || "unknown",
        status: "failed",
        created_at: new Date().toISOString(),
      })
    }

    console.log(`Payment failed for user ${user_id}`)
  } catch (error) {
    console.error("Error handling payment failure:", error)
  }
}

async function handleSubscriptionCreated(data: any) {
  // Handle subscription creation if needed
  console.log("Subscription created:", data)
}

async function handleSubscriptionCancelled(data: any) {
  try {
    const { customer_id } = data

    if (!customer_id) return

    // Update user subscription status
    await supabaseAdmin
      .from("users")
      .update({
        subscription_status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_id", customer_id)

    console.log(`Subscription cancelled for user ${customer_id}`)
  } catch (error) {
    console.error("Error handling subscription cancellation:", error)
  }
}
